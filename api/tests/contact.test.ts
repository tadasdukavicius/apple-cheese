import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetSupabaseMock, supabaseState } from './helpers/supabase.js';

// The factory runs lazily, so it can use the same helper module instance as the tests below.
vi.mock('../src/config/supabaseClient.js', async () => (await import('./helpers/supabase.js')).supabaseMockModule());

// The contact limiter keeps state per process, so these tests live in their own file.
const { default: app } = await import('../src/app.js');

const valid = { name: 'Jonas', email: 'jonas@example.lt', subject: 'Klausimas', message: 'Ar turite sūrio be cukraus?' };

beforeEach(() => {
  resetSupabaseMock();
  supabaseState.results.contact_messages = { data: null, error: null };
});

const inserts = () => supabaseState.calls.filter(([table, method]) => table === 'contact_messages' && method === 'insert');

describe('POST /api/contact', () => {
  it('validates input with Lithuanian messages', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'J', email: 'not-an-email', subject: '', message: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
    const fields = res.body.error.details.map((d: { field: string }) => d.field).sort();
    expect(fields).toEqual(['email', 'message', 'name', 'subject']);
    expect(inserts()).toHaveLength(0);
  });

  it('pretends to succeed on honeypot submissions without storing anything', async () => {
    const res = await request(app).post('/api/contact').send({ ...valid, website: 'http://spam.example' });
    expect(res.status).toBe(201);
    expect(inserts()).toHaveLength(0);
  });

  it('stores valid messages', async () => {
    const res = await request(app).post('/api/contact').send(valid);
    expect(res.status).toBe(201);
    expect(inserts()).toHaveLength(1);
    expect(inserts()[0]?.[2][0]).toEqual({ name: valid.name, email: valid.email, subject: valid.subject, message: valid.message });
  });

  it('rate limits after 5 requests', async () => {
    // Earlier tests in this file already used part of the 5-request window.
    let last = await request(app).post('/api/contact').send(valid);
    for (let i = 0; i < 6 && last.status !== 429; i++) last = await request(app).post('/api/contact').send(valid);
    expect(last.status).toBe(429);
    expect(last.body.error.code).toBe('RATE_LIMITED');
  });
});
