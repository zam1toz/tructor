import 'dotenv/config';
import { verifyEmailConfig, sendEmail } from '../app/lib/email';
import { EmailService } from '../app/lib/emailService';

async function testEmailConfig() {
  console.log('📧 이메일 설정 테스트 시작...\n');

  try {
    // 1. 이메일 설정 검증
    console.log('1️⃣ 이메일 설정 검증 중...');
    const isValid = await verifyEmailConfig();
    
    if (!isValid) {
      console.error('❌ 이메일 설정이 유효하지 않습니다.');
      console.log('\n📝 다음 사항을 확인해주세요:');
      console.log('   - .env 파일의 EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS 설정');
      console.log('   - Gmail을 사용하는 경우 앱 비밀번호 설정');
      console.log('   - 방화벽이나 네트워크 설정');
      return;
    }
    
    console.log('✅ 이메일 설정이 유효합니다.\n');

    // 2. 기본 이메일 전송 테스트
    console.log('2️⃣ 기본 이메일 전송 테스트...');
    const testEmail = 'zeze1toz@gmail.com'; // 실제 받을 이메일로 변경
    
    const basicResult = await sendEmail({
      to: testEmail,
      subject: '트럭터 이메일 테스트',
      html: `
        <h1>트럭터 이메일 테스트</h1>
        <p>이메일 설정이 정상적으로 작동합니다!</p>
        <p>전송 시간: ${new Date().toLocaleString('ko-KR')}</p>
      `
    });

    if (basicResult.success) {
      console.log('✅ 기본 이메일 전송 성공');
    } else {
      console.error('❌ 기본 이메일 전송 실패:', basicResult.error);
    }

    // 3. React Email 템플릿 테스트
    console.log('\n3️⃣ React Email 템플릿 테스트...');
    
    const welcomeResult = await EmailService.sendWelcomeEmail(
      testEmail,
      '테스트사용자',
      '서울'
    );

    if (welcomeResult.success) {
      console.log('✅ 환영 이메일 전송 성공');
    } else {
      console.error('❌ 환영 이메일 전송 실패:', welcomeResult.error);
    }

    const notificationResult = await EmailService.sendNotificationEmail({
      userEmail: testEmail,
      userNickname: '테스트사용자',
      title: '테스트 알림',
      message: '이것은 테스트 알림입니다.',
      actionUrl: 'https://tructor.com',
      actionText: '확인하기',
      notificationType: 'general'
    });

    if (notificationResult.success) {
      console.log('✅ 알림 이메일 전송 성공');
    } else {
      console.error('❌ 알림 이메일 전송 실패:', notificationResult.error);
    }

    console.log('\n🎉 이메일 테스트 완료!');
    console.log(`📧 테스트 이메일이 ${testEmail}로 전송되었습니다.`);

  } catch (error) {
    console.error('💥 이메일 테스트 중 오류:', error);
  }
}

// 스크립트 실행
testEmailConfig().catch(console.error); 