# gita-next: build the reader as static files with Node, serve them with nginx on 3400.
# The reader has no server code, so the running container is nginx only (a few MB of memory).
ARG NODE_VERSION=22.23.4

FROM node:${NODE_VERSION}-bookworm-slim AS builder
WORKDIR /app
# pnpm at the version pinned in package.json ("packageManager")
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# STATIC_EXPORT=1 makes `next build` write the whole site to /app/out (next.config.mjs)
RUN STATIC_EXPORT=1 pnpm build

# Unprivileged variant: runs as the nginx user (uid 101), pid and temp files under /tmp.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 3400
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3400/healthz > /dev/null || exit 1
