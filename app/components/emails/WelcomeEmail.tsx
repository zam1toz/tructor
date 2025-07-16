import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userNickname: string;
  userRegion: string;
}

export const WelcomeEmail = ({
  userNickname = '사용자',
  userRegion = '서울',
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>트럭터에 오신 것을 환영합니다! 🚛</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>트럭터</Heading>
            <Text style={headerText}>트럭 기사들을 위한 커뮤니티</Text>
          </Section>

          <Section style={content}>
            <Heading style={h2}>안녕하세요, {userNickname}님! 👋</Heading>
            
            <Text style={text}>
              트럭터에 가입해 주셔서 감사합니다. 이제 트럭 기사들과 함께 정보를 공유하고 
              소통할 수 있습니다.
            </Text>

            <Text style={text}>
              <strong>가입 정보:</strong><br />
              • 닉네임: {userNickname}<br />
              • 지역: {userRegion}
            </Text>

            <Text style={text}>
              트럭터에서 다음과 같은 기능들을 이용하실 수 있습니다:
            </Text>

            <ul style={featureList}>
              <li style={featureItem}>📝 커뮤니티 게시글 작성 및 조회</li>
              <li style={featureItem}>🗺️ 휴게소 및 주차장 정보 공유</li>
              <li style={featureItem}>🚨 단속 정보 실시간 공유</li>
              <li style={featureItem}>🏆 포인트 적립 및 랭킹 시스템</li>
              <li style={featureItem}>📱 실시간 알림 서비스</li>
            </ul>

            <Text style={text}>
              안전한 운전과 함께 트럭터를 즐겨주세요!
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              본 이메일은 트럭터 회원가입 확인을 위해 발송되었습니다.
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

export default WelcomeEmail;

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
  backgroundColor: '#1f2937',
  color: '#ffffff',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const headerText = {
  color: '#9ca3af',
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

const featureList = {
  margin: '16px 0',
  paddingLeft: '24px',
};

const featureItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
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