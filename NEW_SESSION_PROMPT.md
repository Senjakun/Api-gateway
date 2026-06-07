# Prompt untuk Session Claude Baru — NusaAI Gateway

Copy paste ini sebagai pesan pertama ke Claude di session baru.

---

## CONTEXT PROMPT

Saya sedang build project **NusaAI Gateway** — platform AI API gateway yang menjual akses ke 60+ model AI (via DigitalOcean Gradient API) dengan sistem billing saldo dollar.

**Repo:** https://github.com/Senjakun/Api-gateway

**Yang sudah selesai:**
- Backend Express + TypeScript (jalan di port 4000)
- Web Next.js 14 dashboard (jalan di port 3000)
- CLI tool (Node.js)
- Database PostgreSQL + Prisma (sudah migrate)
- SSL + Nginx (quins.dev + api.quins.dev)
- Auth sistem (register/login JWT)
- Multi model routing (deepseek-4-flash untuk ringan, deepseek-v4-pro untuk berat)
- DO API key rotation (multi akun)
- Billing sistem saldo dollar (markup 40% dari harga DO)

**Yang perlu dikerjakan:**
1. UI/UX redesign total — saat ini masih jelek, perlu redesign modern seperti AI platform profesional
2. Landing page yang menarik (pricing, fitur, CTA)
3. Chat UI yang smooth (mirip ChatGPT tapi branded NusaAI)
4. Dashboard yang informatif (usage chart, balance, model stats)
5. Fix beberapa endpoint 404 di dashboard
6. Setup PM2 ecosystem untuk production
7. Token efficiency: context compression middleware

**Tech Stack:**
- Backend: Node.js + Express + TypeScript
- Web: Next.js 14 App Router
- CLI: Node.js npm package
- DB: PostgreSQL + Prisma
- Deploy: Ubuntu VPS + Nginx + PM2
- Upstream: https://inference.do-ai.run/v1 (DigitalOcean Gradient)
- Model ringan: deepseek-4-flash ($0.14/1M token)
- Model berat: deepseek-v4-pro ($1.74/1M token)

**Domain:** quins.dev (web) | api.quins.dev (backend)

**Billing model:**
- User punya saldo dalam dollar
- Tiap request potong saldo sesuai actual cost DO × 1.4 (markup 40%)
- Plan: FREE ($0.10), LITE ($1.80/Rp25rb), PRO ($6.00/Rp75rb), ULTRA ($18.00/Rp200rb)

**VPS:** DigitalOcean Ubuntu 22.04, 2vCPU 2GB RAM, Singapore

**Aider command untuk build di VPS:**
```bash
cd ~/nusaai
aider --openai-api-base https://inference.do-ai.run/v1 \
      --openai-api-key DO_MODEL_ACCESS_KEY \
      --model openai/deepseek-v4-pro \
      --no-auto-commits \
      --cache-prompts \
      --map-tokens 1024 \
      --yes-always
```

Bantu saya lanjutkan development. Mulai dari mana yang paling penting?
