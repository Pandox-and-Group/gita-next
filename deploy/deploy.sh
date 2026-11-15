#!/usr/bin/env bash
# The only command the gita-next deploy key may run (forced in ~ubuntu/.ssh/authorized_keys; docs/DEPLOY.md).
# CI connects with:  ssh ubuntu@host "deploy gita sha256:<digest of the image it just pushed>"
# and writes its short-lived GITHUB_TOKEN (packages: read) to stdin, so no registry secret lives on the server.
# 1. ghcr.io login with that token, in this app's own docker config  2. pull that exact image
# 3. point gita-next:live at it and recreate the container  4. wait until that image is running and healthy,
#    else put the previous image back and exit 1 so the CI run turns red  5. log out again.
# It touches only the `gita` container and /opt/gita.
set -euo pipefail
cd "$(dirname "$0")"
log() { echo "$*"; logger -t gita-deploy -- "$*"; }

registry_image=ghcr.io/pandox-and-group/gita-next
health=http://127.0.0.1:3400/healthz
compose=(docker compose -f docker-compose.yml)
# A docker config of its own: the platform's deploys log in and out of ghcr.io in ~/.docker and must not be disturbed.
cfg="$PWD/.docker"

# SSH_ORIGINAL_COMMAND is what CI asked for; accept only "deploy gita sha256:<64 hex>".
read -r verb service want extra <<< "${SSH_ORIGINAL_COMMAND:-}" || true
if [[ "${verb:-}" != deploy || "${service:-}" != gita || -n "${extra:-}" || ! "${want:-}" =~ ^sha256:[0-9a-f]{64}$ ]]; then
  log "refused: ${SSH_ORIGINAL_COMMAND:-}"
  exit 2
fi

IFS= read -r -t 10 ghcr_token || true
[[ -n "${ghcr_token:-}" ]] || { log "error: no ghcr.io token on stdin"; exit 1; }
exec < /dev/null

exec 9> .deploy.lock
flock -w 300 9 || { log "error: another deploy held the lock for 5 minutes"; exit 1; }

healthy() {
  for _ in $(seq 1 30); do
    curl -fsS --max-time 3 "$health" > /dev/null 2>&1 && return 0
    sleep 2
  done
  return 1
}

log "deploy gita requested $want"
install -d -m 700 "$cfg"
trap 'docker --config "$cfg" logout ghcr.io > /dev/null 2>&1 || true' EXIT
printf '%s' "$ghcr_token" | docker --config "$cfg" login ghcr.io --username ci --password-stdin > /dev/null
unset ghcr_token

docker --config "$cfg" pull --quiet "$registry_image@$want" > /dev/null
new_id="$(docker image inspect -f '{{.Id}}' "$registry_image@$want")"
old_id="$(docker inspect -f '{{.Image}}' gita 2> /dev/null || true)"

if [[ -n "$old_id" && "$old_id" != "$new_id" ]]; then
  docker tag "$old_id" gita-next:previous # kept for a rollback by hand (docs/DEPLOY.md)
fi
docker tag "$new_id" gita-next:live

if "${compose[@]}" up -d --no-deps gita > /dev/null 2>&1 && healthy &&
  [[ "$(docker inspect -f '{{.Image}}' gita)" == "$new_id" ]]; then
  log "healthy: $want"
  docker image prune -f > /dev/null 2>&1 || true # dangling layers only; gita-next:previous stays
  exit 0
fi

log "error: $want did not become healthy"
"${compose[@]}" logs --tail 40 gita >&2 || true
if [[ -n "$old_id" && "$old_id" != "$new_id" ]]; then
  log "rolling back to the previous image"
  docker tag "$old_id" gita-next:live
  "${compose[@]}" up -d --no-deps gita > /dev/null 2>&1 && healthy && log "rolled back"
fi
exit 1
