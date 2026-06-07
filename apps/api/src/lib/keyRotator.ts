import { prisma } from './prisma';

let instance: KeyRotator | null = null;

export class KeyRotator {
  private keys: string[];
  private currentIndex = 0;

  constructor(keys: string[]) {
    this.keys = keys.filter(Boolean);
  }

  getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No DO API keys configured. Set DO_API_KEYS env.');
    }
    const key = this.keys[this.currentIndex % this.keys.length];
    this.currentIndex++;
    return key;
  }

  async recordSuccess(keyToken: string): Promise<void> {
    if (!keyToken) return;
    await prisma.doKeyUsage.upsert({
      where: { keyToken },
      create: { keyToken, requestCount: 1, lastUsedAt: new Date() },
      update: { requestCount: { increment: 1 }, lastUsedAt: new Date() },
    });
  }

  async recordError(keyToken: string): Promise<void> {
    if (!keyToken) return;
    await prisma.doKeyUsage.upsert({
      where: { keyToken },
      create: { keyToken, errorCount: 1 },
      update: { errorCount: { increment: 1 } },
    });
  }
}

export function getKeyRotator(): KeyRotator {
  if (!instance) {
    const rawKeys = process.env.DO_API_KEYS || '';
    const keys = rawKeys.split(',').map((k) => k.trim());
    instance = new KeyRotator(keys);
  }
  return instance;
}
