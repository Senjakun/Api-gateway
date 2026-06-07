# NusaAI – AI Gateway

NusaAI is a self-hosted AI gateway providing unified API access, usage tracking, quota management, and a beautiful web dashboard. Built with:

- **Backend:** Express + TypeScript + Prisma + PostgreSQL
- **Web:** Next.js 14 + Tailwind CSS + Recharts + Geist font
- **CLI:** Node.js CLI (Commander)
- **Monorepo:** pnpm workspaces

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL

### Setup

1. Clone and install:

```bash
git clone <your-repo>
cd nusaai
pnpm install
```

2. Set up environment:

```bash
cp .env.example apps/api/.env
# Edit apps/api/.env with your database URL and upstream API keys
```

3. Run database migrations:

```bash
cd apps/api
pnpm prisma migrate dev
```

4. Start development servers:

```bash
# From root
pnpm dev
```

Backend API runs on `http://localhost:4000`
Web dashboard runs on `http://localhost:3000`

### CLI Setup

```bash
cd apps/cli
pnpm build

# Link globally (optional)
npm link

# Configure
nusaai config set-key <your-api-key>
nusaai config set-url http://localhost:4000/api/v1
```

## Deploy to VPS

1. Build all apps:

```bash
pnpm build
```

2. Install PM2:

```bash
npm install -g pm2
```

3. Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. Configure Nginx:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/nusaai
sudo ln -s /etc/nginx/sites-available/nusaai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. SSL certificates (using Certbot):

```bash
sudo certbot --nginx -d quins.dev -d api.quins.dev
```

## Project Structure

```
nusaai/
├── apps/
│   ├── api/          # Express backend
│   ├── web/          # Next.js 14 dashboard
│   └── cli/          # CLI tool
├── packages/
│   └── shared/       # Shared types and enums
├── prisma/           # Database schema
├── ecosystem.config.js
├── nginx.conf
└── README.md
```

## License

UNLICENSED
