#!/usr/bin/env bash
# ponytail: curl smoke test instead of a jest suite. Run the app first: npm run start:dev
# Swap for supertest/jest when the API grows past CRUD.
set -euo pipefail

BASE=${BASE:-http://localhost:3000/api}
KEY=${ADMIN_API_KEY:-change-me}
EMAIL="smoke-$RANDOM@example.com"
fail() { echo "FAIL: $1"; exit 1; }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

# create
BODY=$(curl -s -X POST "$BASE/user/create" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Smoke\",\"email\":\"$EMAIL\",\"age\":30}")
ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
[ -n "$ID" ] || fail "create: $BODY"

# validation / get / update / list
[ "$(code -X POST "$BASE/user/create" -H 'Content-Type: application/json' -d '{"name":"D","email":"nope"}')" = 400 ] || fail "validation"
[ "$(code -X POST "$BASE/user/create" -H 'Content-Type: application/json' -d "{\"name\":\"Dup\",\"email\":\"$EMAIL\"}")" = 409 ] || fail "duplicate email"
[ "$(code "$BASE/user/get/$ID")" = 200 ] || fail "get"
[ "$(code "$BASE/user/get/abc")" = 400 ] || fail "invalid id"
[ "$(code "$BASE/user/get/000000000000000000000000")" = 404 ] || fail "missing id"
[ "$(code -X PATCH "$BASE/user/update/$ID" -H 'Content-Type: application/json' -d '{"age":31}')" = 200 ] || fail "update"
[ "$(code "$BASE/user/list?page=1&limit=5")" = 200 ] || fail "list"

# admin signup: api-key middleware
AEMAIL="admin-$RANDOM@example.com"
APASS="secret1234"
[ "$(code -X POST "$BASE/admin/create" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Root\",\"email\":\"$AEMAIL\",\"password\":\"$APASS\"}")" = 401 ] \
  || fail "admin create without api key should be 401"
ABODY=$(curl -s -X POST "$BASE/admin/create" -H 'Content-Type: application/json' -H "x-api-key: $KEY" \
  -d "{\"name\":\"Root\",\"email\":\"$AEMAIL\",\"password\":\"$APASS\"}")
AID=$(echo "$ABODY" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
[ -n "$AID" ] || fail "admin create: $ABODY"
echo "$ABODY" | grep -q password && fail "password leaked in create response"

# login
[ "$(code -X POST "$BASE/admin/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$AEMAIL\",\"password\":\"wrong-password\"}")" = 401 ] || fail "wrong password"
LBODY=$(curl -s -X POST "$BASE/admin/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$AEMAIL\",\"password\":\"$APASS\"}")
TOKEN=$(echo "$LBODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
[ -n "$TOKEN" ] || fail "login: $LBODY"
echo "$LBODY" | grep -q password && fail "password leaked in login response"

# verifyAdmin middleware guards list / get / update / delete
AUTH="Authorization: Bearer $TOKEN"
for args in "$BASE/admin/list" "$BASE/admin/get/$AID"; do
  [ "$(code "$args")" = 401 ] || fail "no token should be 401: $args"
  [ "$(code "$args" -H "$AUTH")" = 200 ] || fail "with token should be 200: $args"
done
[ "$(code "$BASE/admin/list" -H 'Authorization: Bearer not.a.token')" = 401 ] || fail "bad token"
[ "$(code -X PATCH "$BASE/admin/update/$AID" -H 'Content-Type: application/json' -d '{"name":"Nope"}')" = 401 ] || fail "patch without token"
[ "$(code -X PATCH "$BASE/admin/update/$AID" -H "$AUTH" -H 'Content-Type: application/json' -d '{"name":"Root Two"}')" = 200 ] || fail "patch with token"
# delete a second admin, so the caller's own token stays valid afterwards
VID=$(curl -s -X POST "$BASE/admin/create" -H 'Content-Type: application/json' -H "x-api-key: $KEY" \
  -d "{\"name\":\"Victim\",\"email\":\"victim-$RANDOM@example.com\",\"password\":\"$APASS\"}" \
  | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
[ "$(code -X DELETE "$BASE/admin/delete/$VID")" = 401 ] || fail "delete without token"
[ "$(code -X DELETE "$BASE/admin/delete/$VID" -H "$AUTH")" = 200 ] || fail "delete with token"
[ "$(code "$BASE/admin/get/$VID" -H "$AUTH")" = 404 ] || fail "deleted admin should be gone"
# a deleted admin's own token stops working
[ "$(code -X DELETE "$BASE/admin/delete/$AID" -H "$AUTH")" = 200 ] || fail "self delete"
[ "$(code "$BASE/admin/list" -H "$AUTH")" = 401 ] || fail "token of deleted admin should be rejected"

# password changed via PATCH must be re-hashed, not stored plain
PBODY=$(curl -s -X POST "$BASE/admin/create" -H 'Content-Type: application/json' -H "x-api-key: $KEY" \
  -d "{\"name\":\"Rot\",\"email\":\"rot-$RANDOM@example.com\",\"password\":\"$APASS\"}")
PID=$(echo "$PBODY" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
PEMAIL=$(echo "$PBODY" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
LT=$(curl -s -X POST "$BASE/admin/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$PEMAIL\",\"password\":\"$APASS\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
curl -s -o /dev/null -X PATCH "$BASE/admin/update/$PID" -H "Authorization: Bearer $LT" \
  -H 'Content-Type: application/json' -d '{"password":"newsecret1234"}'
[ "$(code -X POST "$BASE/admin/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$PEMAIL\",\"password\":\"newsecret1234\"}")" = 200 ] || fail "login with new password"
[ "$(code -X POST "$BASE/admin/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$PEMAIL\",\"password\":\"$APASS\"}")" = 401 ] || fail "old password should stop working"

echo "OK"
