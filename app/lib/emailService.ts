import { sendReactEmail } from './email';
import WelcomeEmail from '../components/emails/WelcomeEmail';
import PasswordResetEmail from '../components/emails/PasswordResetEmail';
import NotificationEmail from '../components/emails/NotificationEmail';

// 이메일 서비스 클래스
export class EmailService {
  // 환영 이메일 전송
  static async sendWelcomeEmail(userEmail: string, userNickname: string, userRegion: string) {
    try {
      const result = await sendReactEmail({
        to: userEmail,
        subject: '트럭터에 오신 것을 환영합니다! 🚛',
        component: WelcomeEmail({
          userNickname,
          userRegion,
        }),
      });

      if (result.success) {
        console.log('✅ 환영 이메일 전송 성공:', userEmail);
      } else {
        console.error('❌ 환영 이메일 전송 실패:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ 환영 이메일 전송 중 오류:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 비밀번호 재설정 이메일 전송
  static async sendPasswordResetEmail(
    userEmail: string, 
    userNickname: string, 
    resetUrl: string, 
    expiresIn: string = '1시간'
  ) {
    try {
      const result = await sendReactEmail({
        to: userEmail,
        subject: '트럭터 비밀번호 재설정 요청',
        component: PasswordResetEmail({
          userNickname,
          resetUrl,
          expiresIn,
        }),
      });

      if (result.success) {
        console.log('✅ 비밀번호 재설정 이메일 전송 성공:', userEmail);
      } else {
        console.error('❌ 비밀번호 재설정 이메일 전송 실패:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ 비밀번호 재설정 이메일 전송 중 오류:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 알림 이메일 전송
  static async sendNotificationEmail({
    userEmail,
    userNickname,
    title,
    message,
    actionUrl,
    actionText,
    notificationType = 'general',
  }: {
    userEmail: string;
    userNickname: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    notificationType?: 'comment' | 'like' | 'mission' | 'report' | 'general';
  }) {
    try {
      const result = await sendReactEmail({
        to: userEmail,
        subject: title,
        component: NotificationEmail({
          userNickname,
          title,
          message,
          actionUrl,
          actionText,
          notificationType,
        }),
      });

      if (result.success) {
        console.log('✅ 알림 이메일 전송 성공:', userEmail, title);
      } else {
        console.error('❌ 알림 이메일 전송 실패:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ 알림 이메일 전송 중 오류:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 댓글 알림 이메일 전송
  static async sendCommentNotificationEmail(
    userEmail: string,
    userNickname: string,
    commenterNickname: string,
    postTitle: string,
    postUrl: string
  ) {
    return this.sendNotificationEmail({
      userEmail,
      userNickname,
      title: '새로운 댓글이 달렸습니다 💬',
      message: `${commenterNickname}님이 "${postTitle}" 게시글에 댓글을 남겼습니다.`,
      actionUrl: postUrl,
      actionText: '댓글 보기',
      notificationType: 'comment',
    });
  }

  // 좋아요 알림 이메일 전송
  static async sendLikeNotificationEmail(
    userEmail: string,
    userNickname: string,
    likerNickname: string,
    postTitle: string,
    postUrl: string
  ) {
    return this.sendNotificationEmail({
      userEmail,
      userNickname,
      title: '게시글에 좋아요가 달렸습니다 ❤️',
      message: `${likerNickname}님이 "${postTitle}" 게시글에 좋아요를 눌렀습니다.`,
      actionUrl: postUrl,
      actionText: '게시글 보기',
      notificationType: 'like',
    });
  }

  // 미션 완료 알림 이메일 전송
  static async sendMissionCompletionEmail(
    userEmail: string,
    userNickname: string,
    missionTitle: string,
    points: number,
    profileUrl: string
  ) {
    return this.sendNotificationEmail({
      userEmail,
      userNickname,
      title: '미션을 완료했습니다! 🎯',
      message: `"${missionTitle}" 미션을 완료하여 ${points}포인트를 획득했습니다!`,
      actionUrl: profileUrl,
      actionText: '포인트 확인하기',
      notificationType: 'mission',
    });
  }

  // 신고 처리 완료 알림 이메일 전송
  static async sendReportProcessedEmail(
    userEmail: string,
    userNickname: string,
    reportTitle: string,
    status: string,
    reportsUrl: string
  ) {
    return this.sendNotificationEmail({
      userEmail,
      userNickname,
      title: '신고가 처리되었습니다 🚨',
      message: `"${reportTitle}" 신고가 ${status} 처리되었습니다.`,
      actionUrl: reportsUrl,
      actionText: '신고 내역 확인',
      notificationType: 'report',
    });
  }
} 