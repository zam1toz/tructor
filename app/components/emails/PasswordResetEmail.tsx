import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  userNickname: string;
  resetUrl: string;
  expiresIn: string;
}

export const PasswordResetEmail = ({
  userNickname = '사용자',
  resetUrl = 'https://tructor.com/reset-password',
  expiresIn = '1시간',
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>트럭터 비밀번호 재설정 요청</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>트럭터</Heading>
            <Text style={headerText}>비밀번호 재설정</Text>
          </Section>

          <Section style={content}>
            <Heading style={h2}>안녕하세요, {userNickname}님</Heading>
            
            <Text style={text}>
              트럭터 계정의 비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 
              새로운 비밀번호를 설정하실 수 있습니다.
            </Text>

            <Text style={text}>
              <strong>주의사항:</strong>
            </Text>
            <ul style={warningList}>
              <li style={warningItem}>본 링크는 {expiresIn} 후에 만료됩니다</li>
              <li style={warningItem}>본인이 요청하지 않았다면 이 이메일을 무시하세요</li>
              <li style={warningItem}>비밀번호 재설정 링크는 한 번만 사용 가능합니다</li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                비밀번호 재설정하기
              </Button>
            </Section>

            <Text style={text}>
              버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣기 해주세요:
            </Text>
            
            <Text style={linkText}>
              <Link href={resetUrl} style={link}>
                {resetUrl}
              </Link>
            </Text>

            <Text style={text}>
              보안을 위해 비밀번호 재설정이 완료되면 이 링크는 더 이상 사용할 수 없습니다.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              본 이메일은 트럭터 비밀번호 재설정 요청을 위해 발송되었습니다.
            </Text>
            <Text style={footerText}>
              문의사항이 있으시면{' '}
              <Link href="mailto:support@tructor.com" style={link}>
                support@tructor.com
              </Link>
              으로 연락해 주세요.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  textAlign: 'center' as const,
  padding: '32px 0',
  backgroundColor: '#dc2626',
  color: '#ffffff',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const headerText = {
  color: '#fecaca',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '32px 24px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const warningList = {
  margin: '16px 0',
  paddingLeft: '24px',
};

const warningItem = {
  color: '#dc2626',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  cursor: 'pointer',
};

const linkText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const footer = {
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
}; 