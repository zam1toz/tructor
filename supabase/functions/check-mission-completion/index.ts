import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function checkMissionCompletion() {
  try {
    console.log('🚀 미션 완료 체크 시작...')

    // 1. 데이터베이스 함수로 미션 진행 상황 업데이트
    const { error: updateError } = await supabase.rpc('update_mission_progress')
    if (updateError) {
      console.error('❌ 미션 진행 상황 업데이트 실패:', updateError)
      throw updateError
    }
    console.log('✅ 미션 진행 상황 업데이트 완료')

    // 2. 완료된 미션 조회
    const { data: completedMissions, error: queryError } = await supabase
      .from('user_missions')
      .select(`
        *,
        missions (
          title,
          points
        )
      `)
      .eq('is_completed', false)
      .gte('progress', 'max_progress')

    if (queryError) {
      console.error('❌ 완료된 미션 조회 실패:', queryError)
      throw queryError
    }

    console.log(`📊 완료된 미션 ${completedMissions?.length || 0}개 발견`)

    // 3. 각 완료된 미션에 대해 포인트 지급 및 알림
    for (const mission of completedMissions || []) {
      await processCompletedMission(mission)
    }

    console.log('🎉 미션 완료 체크 완료')
    return { success: true, completedCount: completedMissions?.length || 0 }

  } catch (error) {
    console.error('💥 미션 완료 체크 중 오류:', error)
    throw error
  }
}

async function processCompletedMission(mission: any) {
  try {
    const { user_id, missions } = mission
    const points = missions?.points || 0

    // 1. 미션 완료 상태 업데이트
    const { error: updateError } = await supabase
      .from('user_missions')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', mission.id)

    if (updateError) {
      console.error(`❌ 미션 완료 상태 업데이트 실패 (${mission.id}):`, updateError)
      return
    }

    // 2. 포인트 지급
    const { error: pointsError } = await supabase
      .from('points')
      .insert({
        user_id,
        amount: points,
        reason: `미션 완료: ${missions?.title}`,
        type: 'earned'
      })

    if (pointsError) {
      console.error(`❌ 포인트 지급 실패 (${user_id}):`, pointsError)
    } else {
      console.log(`💰 포인트 지급 완료: ${user_id}에게 ${points}포인트`)
    }

    // 3. 알림 생성
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title: '미션 완료! 🎉',
        message: `"${missions?.title}" 미션을 완료하여 ${points}포인트를 획득했습니다!`,
        type: 'mission_complete',
        is_read: false
      })

    if (notificationError) {
      console.error(`❌ 알림 생성 실패 (${user_id}):`, notificationError)
    } else {
      console.log(`📢 알림 생성 완료: ${user_id}`)
    }

  } catch (error) {
    console.error(`❌ 미션 처리 중 오류 (${mission.id}):`, error)
  }
}

// CRON 작업으로 호출될 때 실행
Deno.serve(async (req) => {
  try {
    const result = await checkMissionCompletion()
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}) 