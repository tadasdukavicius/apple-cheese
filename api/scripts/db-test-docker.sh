#!/usr/bin/env bash
# Runs scripts/db-test.sh against a throwaway Postgres container (requires Docker).
set -euo pipefail

cd "$(dirname "$0")/.."

NAME="obuolius-db-test-$$"
trap 'docker rm -f "$NAME" >/dev/null 2>&1 || true' EXIT

docker run -d --rm --name "$NAME" -e POSTGRES_PASSWORD=postgres postgres:16-alpine >/dev/null

echo "Waiting for Postgres..."
# The image restarts once during initialisation, so wait until a real query works.
for _ in $(seq 1 60); do
  docker exec "$NAME" psql -U postgres -qc 'select 1' >/dev/null 2>&1 && break
  sleep 1
done

PSQL_CMD="docker exec -i $NAME psql -U postgres" ./scripts/db-test.sh
