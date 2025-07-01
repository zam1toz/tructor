import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config, validateConfig } from '../config';

// 설정 유효성 검사
validateConfig();

// PostgreSQL 클라이언트 생성
const client = postgres(config.database.url, {
  max: 10, // 최대 연결 수
  idle_timeout: 20, // 유휴 타임아웃 (초)
  connect_timeout: 10, // 연결 타임아웃 (초)
});

// Drizzle 인스턴스 생성
export const db = drizzle(client, { schema });

// 타입 내보내기
export * from './schema'; 