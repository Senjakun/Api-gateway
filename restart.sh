#!/usr/bin/env bash
pkill -f "tsx watch" ; cd ~/nusaai-gateway/nusaai/apps/api && pnpm dev &
pkill -f "next dev"  ; cd ~/nusaai-gateway/nusaai/apps/web && pnpm dev &
wait
