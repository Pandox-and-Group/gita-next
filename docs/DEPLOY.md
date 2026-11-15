# Deploy runbook — gita.rpandox.com

The reader runs on the Pandox server (the Lightsail box that also serves rpandox.com; its own runbook is
`deploy/README.md` in the private `pandox-api` repo). It is a separate stack there: its own folder, compose project,
nginx site file, certificate and deploy key. Nothing under `/opt/pandox` is used or edited, and the platform's
containers, compose file, scripts and certificate were left as they were when this was installed (2026-11-15).

```
visitor → Cloudflare (proxied) → host nginx :443 (Let's Encrypt, certificate "gita.rpandox.com")
  gita.rpandox.com   everything → 127.0.0.1:3400  container `gita` (nginx serving the exported site)
```

| Where on the server | What | Source in this repo |
|---|---|---|
| `/opt/gita/docker-compose.yml` | compose project `gita`, one service | `deploy/docker-compose.yml` |
| `/opt/gita/deploy.sh` | the only command the deploy key may run | `deploy/deploy.sh` |
| `/opt/gita/.docker/` | this app's own docker login, empty between deploys | created by `deploy.sh` |
| `/etc/nginx/sites-available/gita.conf` (linked in `sites-enabled`) | the site | `deploy/nginx/gita.conf` |
| `/etc/letsencrypt/live/gita.rpandox.com/` | its certificate, renewed by the server's certbot timer | — |
| one line in `~ubuntu/.ssh/authorized_keys` | deploy key, forced to `/opt/gita/deploy.sh` | — |

The container is nginx with a read-only filesystem and a 48 MB memory limit (it uses about 8 MB). It carries the label
that tells the platform's Watchtower to leave it alone.

## How a deploy works

Every push to `main` runs `.github/workflows/ci.yml`:

1. **Check**: `pnpm build`, which first runs `scripts/check-data.mjs`.
2. **Build and push image**: `ghcr.io/pandox-and-group/gita-next`, tagged `:sha-<commit>` and `:latest`.
3. **Deploy**: only on `main`, and only while the repository variable `DEPLOY_ENABLED` is `true`. CI connects with
   the deploy key and sends `deploy gita sha256:<digest>`, with its short-lived token on stdin. On the server
   `deploy.sh` logs in to ghcr.io with that token, pulls that exact image, points the local tag `gita-next:live` at it,
   recreates the container, and waits until that image answers `/healthz`. If it does not, it puts the previous image
   back and the CI run fails. Then it logs out, so no registry credential stays on the server.

Repository settings the deploy step needs (Settings → Secrets and variables → Actions):

| Name | Kind | Value |
|---|---|---|
| `DEPLOY_SSH_KEY` | secret | private half of the deploy key |
| `DEPLOY_KNOWN_HOSTS` | secret | the server's ed25519 host key line |
| `DEPLOY_USER`, `DEPLOY_HOST` | secrets | the SSH user and address of the server |
| `DEPLOY_ENABLED` | variable | `true`; set to anything else to pause deploys |

## By hand

```bash
ssh rp_portfolio_ls
cd /opt/gita
docker compose ps                                   # gita: Up (healthy)
curl -fsS http://127.0.0.1:3400/healthz             # ok
docker compose logs --tail 50 gita
journalctl -t gita-deploy -n 20                     # what each deploy did
```

**Roll back to the previous build** (the last deploy keeps it as `gita-next:previous`):

```bash
cd /opt/gita
docker tag gita-next:previous gita-next:live
docker compose up -d --no-deps gita
```

Then pause deploys (`DEPLOY_ENABLED` to `false`) or revert the commit, or the next push to `main` will replace it again.

**Deploy an older commit**: re-run that commit's CI run from the Actions page (Re-run all jobs).

**Change the nginx site**: edit `deploy/nginx/gita.conf` here, then on the server:

```bash
sudo install -m 644 gita.conf /etc/nginx/sites-available/gita.conf
sudo nginx -t && sudo systemctl reload nginx
```

**Change the compose file or the deploy script**: copy them to `/opt/gita/` (`install -m 644` and `install -m 755`),
then `docker compose up -d` for a compose change.

## First install (what was done on 2026-11-15)

1. Cloudflare DNS: `A gita → <server address>`, proxied.
2. `/opt/gita` created; compose file and deploy script copied in.
3. nginx: the port-80 block of `gita.conf` only, `nginx -t`, reload.
4. `sudo certbot certonly --webroot -w /var/www/certbot --cert-name gita.rpandox.com -d gita.rpandox.com`
   (a new certificate; the platform's certificate was not expanded).
5. nginx: the full `gita.conf`, `nginx -t`, reload.
6. A new ed25519 deploy key; its public half appended to `~ubuntu/.ssh/authorized_keys` as
   `command="/opt/gita/deploy.sh",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty ssh-ed25519 …`
   (the file before that edit is kept as `authorized_keys.bak-gita-2026-11-15`).
7. The secrets and the variable above set on the repository; CI run on `main` did the first deploy.

## Remove it

```bash
cd /opt/gita && docker compose down
sudo rm /etc/nginx/sites-enabled/gita.conf && sudo nginx -t && sudo systemctl reload nginx
sudo certbot delete --cert-name gita.rpandox.com
# then: delete the deploy-key line from ~/.ssh/authorized_keys, the DNS record, and /opt/gita
```

## The old address

`bhagawadgita.netlify.app` was the first home of this reader. Netlify built it from the repository under its old
owner; after the move to this organisation it no longer receives pushes unless the Netlify site is re-linked. Either
re-link it, or point it at the new address, or delete the Netlify site. `netlify.toml` is kept so a Netlify build
still works.
