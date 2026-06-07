#!/usr/bin/env bash
set -euo pipefail

# ----------------------------------------------------------------------
# deploy.sh - Install nginx, certbot, configure SSL for quins.dev and
#             api.quins.dev, then start services.
# Usage:
#   chmod +x deploy.sh
#   sudo ./deploy.sh
# ----------------------------------------------------------------------

# Ensure script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (sudo)." 
   exit 1
fi

DOMAIN="quins.dev"
API_DOMAIN="api.quins.dev"
EMAIL="admin@quins.dev"                # change to your email
WEB_PORT=3000
API_PORT=4000

echo "==> Updating package lists..."
apt update -y

echo "==> Installing nginx..."
apt install -y nginx

# Enable and start nginx
systemctl enable nginx
systemctl start nginx

echo "==> Installing certbot (using snap)..."
snap install core; snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

echo "==> Obtaining SSL certificates for $DOMAIN and $API_DOMAIN..."
# Stop nginx briefly to allow standalone certbot mode (or use webroot)
systemctl stop nginx

certbot certonly --standalone --non-interactive --agree-tos \
  -m "$EMAIL" -d "$DOMAIN" -d "$API_DOMAIN"

# Start nginx again
systemctl start nginx

echo "==> Copying nginx configuration..."
# Assumes this script is located in the root of your repo where nginx.conf exists
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONFIG="$SCRIPT_DIR/nginx.conf"

if [[ -f "$NGINX_CONFIG" ]]; then
  cp "$NGINX_CONFIG" /etc/nginx/sites-available/quins
  ln -sf /etc/nginx/sites-available/quins /etc/nginx/sites-enabled/quins
  # Remove default site to avoid conflicts
  rm -f /etc/nginx/sites-enabled/default
else
  echo "ERROR: nginx.conf not found in $SCRIPT_DIR"
  exit 1
fi

echo "==> Testing nginx configuration..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo "==> Next.js web app (should be running on port $WEB_PORT)"
echo "==> Express API (should be running on port $API_PORT)"
echo "Deployment completed successfully!"
