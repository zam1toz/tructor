import type { Config } from 'drizzle-kit';

import { config } from './app/lib/config';

export default {
  schema: './app/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.url,
  },
  verbose: true,
  strict: true,
} satisfies Config; 