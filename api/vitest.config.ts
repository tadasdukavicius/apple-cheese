import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Satisfies the startup config validation; no real Supabase is contacted in tests.
    env: {
      NODE_ENV: 'test',
      SUPABASE_URL: 'http://127.0.0.1:54321',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      CORS_ORIGINS: 'http://localhost:3000',
    },
    coverage: { provider: 'v8', include: ['src/**/*.ts'], exclude: ['src/server.ts', 'src/types/**'] },
  },
});
