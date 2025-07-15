/// <reference types="https://deno.land/x/deno@v1.40.4/lib/deno.ns.d.ts" />

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 부적절한 키워드 목록 (실제로는 더 정교한 필터링 필요)
const INAPPROPRIATE_KEYWORDS = [
  '욕설', '비방', '스팸', '광고', '사기', '허위', '음란', '폭력'
]

export async function processReports() {
  try {
    console.log('🚀 신고 자동 처리 시작...')

    // 1. 대기 중인 신고 조회
    const { data: pendingReports, error: queryError } = await supabase
      .from('reports')
      .select(`
        *,
        users!reports_reporter_id_fkey (
          nickname
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (queryError) {
      console.error('❌ 신고 조회 실패:', queryError)
      throw queryError
    }

    console.log(`📊 대기 중인 신고 ${pendingReports?.length || 0}개 발견`)

    // 2. 각 신고에 대해 자동 처리
    for (const report of pendingReports || []) {
      await processReport(report)
    }

    console.log('🎉 신고 자동 처리 완료')
    return { success: true, processedCount: pendingReports?.length || 0 }

  } catch (error) {
    console.error('💥 신고 처리 중 오류:', error)
    throw error
  }
}

async function processReport(report: any) {
  try {
    const { id, target_type, target_id, reason, reporter_id } = report

    // 1. 신고 대상 콘텐츠 조회
    let targetContent = ''
    let targetTable = ''

    switch (target_type) {
      case 'post':
        targetTable = 'posts'
        const { data: post } = await supabase
          .from('posts')
          .select('content, title, author_id')
          .eq('id', target_id)
          .single()
        targetContent = post?.content || post?.title || ''
        break

      case 'comment':
        targetTable = 'comments'
        const { data: comment } = await supabase
          .from('comments')
          .select('content, author_id')
          .eq('id', target_id)
          .single()
        targetContent = comment?.content || ''
        break

      default:
        console.log(`⚠️ 알 수 없는 신고 타입: ${target_type}`)
        return
    }

    // 2. 자동 판단 로직
    const shouldAutoDelete = await autoJudgeContent(targetContent, reason)

    if (shouldAutoDelete) {
      // 3. 콘텐츠 자동 삭제
      const { error: deleteError } = await supabase
        .from(targetTable)
        .delete()
        .eq('id', target_id)

      if (deleteError) {
        console.error(`❌ 콘텐츠 삭제 실패 (${target_id}):`, deleteError)
      } else {
        console.log(`🗑️ 콘텐츠 자동 삭제: ${target_id}`)
      }

      // 4. 신고 상태 업데이트 (자동 처리)
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: 'reviewed',
          handled_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        console.error(`❌ 신고 상태 업데이트 실패 (${id}):`, updateError)
      }

      // 5. 관리자 로그 기록
      await supabase
        .from('admin_action_logs')
        .insert({
          admin_id: '00000000-0000-0000-0000-000000000000', // 시스템 자동 처리
          action: 'auto_delete_content',
          target_type,
          target_id,
          memo: `자동 삭제: ${reason}`
        })

      // 6. 신고자에게 알림
      await supabase
        .from('notifications')
        .insert({
          user_id: reporter_id,
          title: '신고 처리 완료',
          message: `신고하신 ${target_type === 'post' ? '게시글' : '댓글'}이 자동으로 삭제되었습니다.`,
          type: 'report_processed',
          is_read: false
        })

    } else {
      // 7. 수동 검토가 필요한 경우 관리자 알림
      await notifyAdmins(report)
    }

  } catch (error) {
    console.error(`❌ 신고 처리 중 오류 (${report.id}):`, error)
  }
}

async function autoJudgeContent(content: string, reason: string): Promise<boolean> {
  // 1. 키워드 기반 판단
  const hasInappropriateKeyword = INAPPROPRIATE_KEYWORDS.some(keyword => 
    content.includes(keyword) || reason.includes(keyword)
  )

  // 2. 스팸 패턴 판단
  const isSpam = content.length > 1000 && (
    content.includes('광고') || 
    content.includes('홍보') || 
    content.includes('문의') ||
    (content.match(/[0-9]{3,}/g)?.length || 0) > 3 // 전화번호 패턴
  )

  // 3. 반복 패턴 판단
  const repeatedChars = content.match(/(.)\1{4,}/g) // 5번 이상 반복
  const isRepeated = repeatedChars && repeatedChars.length > 2

  return hasInappropriateKeyword || isSpam || isRepeated
}

async function notifyAdmins(report: any) {
  try {
    // 관리자 목록 조회
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('is_admin', true)

    // 각 관리자에게 알림
    for (const admin of admins || []) {
      await supabase
        .from('notifications')
        .insert({
          user_id: admin.id,
          title: '신고 검토 필요',
          message: `새로운 신고가 접수되었습니다. (ID: ${report.id})`,
          type: 'report_review_needed',
          is_read: false
        })
    }

    console.log(`📢 관리자 알림 발송: ${admins?.length || 0}명`)
  } catch (error) {
    console.error('❌ 관리자 알림 발송 실패:', error)
  }
}

// CRON 작업으로 호출될 때 실행
Deno.serve(async (req: Request) => {
  try {
    const result = await processReports()
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}) 