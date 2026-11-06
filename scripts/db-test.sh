#!/usr/bin/env bash
# Applies the stubs, migrations and seed to a throwaway Postgres and runs supabase/tests/*.test.sql.
#
#   DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres npm run test:db
#
# Without psql installed locally, use Docker instead:  npm run test:db:docker
set -euo pipefail

cd "$(dirname "$0")/.."

PSQL_CMD="${PSQL_CMD:-psql ${DATABASE_URL:?Set DATABASE_URL (or PSQL_CMD) to a disposable Postgres}}"

# -o discards result rows (the assertions print empty ones); errors and \echo still show
run() { $PSQL_CMD -v ON_ERROR_STOP=1 -q -o /dev/null -f - < "$1"; }

echo "→ stubs";      run supabase/tests/00_stubs.sql
for f in "${MIGRATIONS_DIR:-supabase/migrations}"/*.sql; do echo "→ $f"; run "$f"; done
echo "→ seed";       run supabase/seed.sql
for f in supabase/tests/*.test.sql; do echo "→ $f"; run "$f"; done
