#!/usr/bin/env bash
# Bring docs.valyd.work live: install the nginx vhost + obtain TLS.
# Prereqs: (1) DNS A record docs.valyd.work -> 96.250.208.62 already resolves,
#          (2) the site is built (dist/ exists).
#
#   sudo bash /var/www/pollus_main_servers/docs.valyd.work/deploy/go-live.sh
#
set -euo pipefail

DEPLOY=/var/www/pollus_main_servers/docs.valyd.work/deploy
SA=/etc/nginx/sites-available
SE=/etc/nginx/sites-enabled
DOMAIN=docs.valyd.work

if [ ! -f /var/www/pollus_main_servers/docs.valyd.work/dist/index.html ]; then
  echo "!! dist/ not built. Run 'bun run build' (or npm run build) first." >&2
  exit 1
fi

echo ">> Checking DNS for $DOMAIN"
if ! getent hosts "$DOMAIN" >/dev/null; then
  echo "!! $DOMAIN does not resolve yet. Add an A record -> 96.250.208.62 first." >&2
  exit 1
fi

echo ">> Installing nginx vhost"
cp "$DEPLOY/$DOMAIN.nginx.conf" "$SA/$DOMAIN"
ln -sf "$SA/$DOMAIN" "$SE/$DOMAIN"

echo ">> Testing + reloading nginx"
nginx -t
systemctl reload nginx

echo ">> Obtaining TLS certificate"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m innoxitech@gmail.com --redirect

echo ">> Final nginx test + reload"
nginx -t && systemctl reload nginx

echo ">> Smoke test"
curl -s -o /dev/null -w "https://$DOMAIN/ -> %{http_code}\n" "https://$DOMAIN/" || true
echo ">> Done."
