import { vi } from 'vitest';

/** Shared mock state (one module instance per test file). */
export const supabaseState = {
  /** table name -> result returned when that table's query chain is awaited */
  results: {} as Record<string, { data: unknown; error: unknown }>,
  /** every query-builder method call, in order: [table, method, args] */
  calls: [] as Array<[string, string, unknown[]]>,
  rpc: vi.fn(),
  getUser: vi.fn(),
};

/** A chainable, awaitable stand-in for the Supabase query builder. */
function builderFor(table: string) {
  const proxy: unknown = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') {
          const result = supabaseState.results[table] ?? { data: null, error: null };
          return (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
            Promise.resolve(result).then(resolve, reject);
        }
        return (...args: unknown[]) => {
          supabaseState.calls.push([table, String(prop), args]);
          return proxy;
        };
      },
    }
  );
  return proxy;
}

export const supabaseMockModule = () => ({
  supabase: {
    from: (table: string) => builderFor(table),
    auth: { getUser: supabaseState.getUser },
  },
  createUserClient: () => ({
    from: (table: string) => builderFor(table),
    rpc: supabaseState.rpc,
  }),
});

export function resetSupabaseMock() {
  supabaseState.results = {};
  supabaseState.calls = [];
  supabaseState.rpc.mockReset();
  supabaseState.getUser.mockReset();
}

/** Makes the auth middleware accept `Bearer valid-token` as this user. */
export function signInAs(userId = '11111111-1111-4111-8111-111111111111') {
  supabaseState.getUser.mockImplementation(async (token: string) =>
    token === 'valid-token'
      ? { data: { user: { id: userId, email: 'jonas@example.lt' } }, error: null }
      : { data: { user: null }, error: { message: 'invalid JWT' } }
  );
}

export const AUTH = { Authorization: 'Bearer valid-token' };
