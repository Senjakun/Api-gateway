# NusaAI Gateway — Install Guide (Fresh VPS Ubuntu 22.04)

## Spesifikasi VPS
- Ubuntu 22.04
- Min 2GB RAM
- Domain: quins.dev (web) + api.quins.dev (backend)

---

## Step 1 — Install Dependencies

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# pnpm
npm install -g pnpm pm2

# PostgreSQL
apt install -y postgresql postgresql-contrib

# Nginx + Certbot
apt install -y nginx
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
```

---

## Step 2 — Setup Database

```bash
sudo -u postgres psql -c "CREATE USER nusaai WITH PASSWORD 'nusaai123';"
sudo -u postgres psql -c "CREATE DATABASE nusaai OWNER nusaai;"
sudo -u postgres psql -c "ALTER USER nusaai CREATEDB;"
```

---

## Step 3 — Clone & Install

```bash
git clone https://github.com/Senjakun/Api-gateway.git ~/nusaai
cd ~/nusaai
pnpm install
```

---

## Step 4 — Environment Variables

```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://nusaai:nusaai123@localhost:5432/nusaai
JWT_SECRET=ganti_dengan_secret_random_panjang
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=production
UPSTREAM_API_BASE=https://inference.do-ai.run/v1
DO_API_KEYS=doo_v1_xxxxx,doo_v1_yyyyy
NEXT_PUBLIC_API_URL=https://api.quins.dev/api/v1
EOF

cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.quins.dev/api/v1
EOF
```

---

## Step 5 — Database Migration

```bash
# Fix prisma client path untuk monorepo
cat > apps/api/src/lib/prisma.ts << 'EOF'
import { PrismaClient } from '/root/nusaai/apps/api/node_modules/.prisma/client';
export const prisma = new PrismaClient();
EOF

cd ~/nusaai
npm install prisma@5.22.0 @prisma/client@5.22.0 --save-dev
npx prisma migrate deploy
npx prisma generate
cd apps/api
npx prisma generate --schema=../../prisma/schema.prisma
cd ~/nusaai
```

---

## Step 6 — Jalankan dengan PM2

```bash
# Backend API
cd ~/nusaai/apps/api
pm2 start "pnpm dev" --name api

# Web (development)
cd ~/nusaai/apps/web
pm2 start "pnpm dev" --name web

# Atau build production
cd ~/nusaai/apps/web
pnpm build
pm2 start "pnpm start" --name web

pm2 save
pm2 startup
# Jalankan command yang muncul
```

---

## Step 7 — Nginx + SSL

```bash
# SSL Certificate
certbot certonly --standalone -d quins.dev -d www.quins.dev
certbot certonly --standalone -d api.quins.dev

# Nginx config
cat > /etc/nginx/nginx.conf << 'EOF'
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name quins.dev www.quins.dev;
        return 301 https://$host$request_uri;
    }
    server {
        listen 443 ssl;
        server_name quins.dev www.quins.dev;
        ssl_certificate /etc/letsencrypt/live/quins.dev/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/quins.dev/privkey.pem;
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    server {
        listen 80;
        server_name api.quins.dev;
        return 301 https://$host$request_uri;
    }
    server {
        listen 443 ssl;
        server_name api.quins.dev;
        ssl_certificate /etc/letsencrypt/live/api.quins.dev/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/api.quins.dev/privkey.pem;
        location / {
            proxy_pass http://localhost:4000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
EOF

nginx -t && systemctl restart nginx
```

---

## Troubleshooting

**Prisma client error:**
```bash
cd ~/nusaai
npx prisma generate
cd apps/api && npx prisma generate --schema=../../prisma/schema.prisma
```

**Port 80 busy saat certbot:**
```bash
systemctl stop nginx
certbot certonly --standalone -d quins.dev
systemctl start nginx
```

**Cek status:**
```bash
pm2 status
pm2 logs api --lines 20
pm2 logs web --lines 20
```
