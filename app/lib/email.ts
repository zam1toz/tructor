import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { config } from './config';

// 이메일 전송기 생성
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// 이메일 전송 함수
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 이메일 전송 성공:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ 이메일 전송 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// React Email 컴포넌트를 HTML로 렌더링하고 전송
export async function sendReactEmail({
  to,
  subject,
  component,
}: {
  to: string;
  subject: string;
  component: React.ReactElement;
}) {
  try {
    const html = await render(component);
    return await sendEmail({ to, subject, html });
  } catch (error) {
    console.error('❌ React Email 렌더링 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// 이메일 전송기 검증
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ 이메일 설정이 유효합니다.');
    return true;
  } catch (error) {
    console.error('❌ 이메일 설정이 유효하지 않습니다:', error);
    return false;
  }
} 