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

interface NotificationEmailProps {
  userNickname: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  notificationType: 'comment' | 'like' | 'mission' | 'report' | 'general';
}

export const NotificationEmail = ({
  userNickname = '사용자',
  title = '새로운 알림',
  message = '새로운 알림이 있습니다.',
  actionUrl,
  actionText,
  notificationType = 'general',
}: NotificationEmailProps) => {
  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'mission':
        return '🎯';
      case 'report':
        return '🚨';
      default:
        return '📢';
    }
  };

  const getNotificationColor = () => {
    switch (notificationType) {
      case 'comment':
        return '#3b82f6';
      case 'like':
        return '#ef4444';
      case 'mission':
        return '#10b981';
      case 'report':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>트럭터</Heading>
            <Text style={headerText}>새로운 알림</Text>
          </Section>

          <Section style={content}>
            <div style={notificationHeader}>
              <Text style={notificationIcon}>{getNotificationIcon()}</Text>
              <Heading style={h2}>{title}</Heading>
            </div>
            
            <Text style={greeting}>안녕하세요, {userNickname}님</Text>

            <Text style={text}>
              {message}
            </Text>

            {actionUrl && actionText && (
              <Section style={buttonContainer}>
                <Button 
                  style={{...button, backgroundColor: getNotificationColor()}} 
                  href={actionUrl}
                >
                  {actionText}
                </Button>
              </Section>
            )}

            <Text style={text}>
              트럭터에서 더 많은 정보를 확인하시려면{' '}
              <Link href="https://tructor.com" style={link}>
                트럭터 홈페이지
              </Link>
              를 방문해 주세요.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              본 이메일은 트럭터 알림 서비스를 통해 발송되었습니다.
            </Text>
            <Text style={footerText}>
              알림 설정을 변경하시려면{' '}
              <Link href="https://tructor.com/me" style={link}>
                프로필 설정
              </Link>
              에서 확인하실 수 있습니다.
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

export default NotificationEmail;

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

const notificationHeader = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',
};

const notificationIcon = {
  fontSize: '32px',
  margin: '0 16px 0 0',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const greeting = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
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