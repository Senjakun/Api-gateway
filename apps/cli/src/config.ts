import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

export interface CliConfig {
  apiKey?: string;
  apiUrl?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.nusaai');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function readConfigRaw(): CliConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw) as CliConfig;
  } catch {
    return {};
  }
}

function writeConfigRaw(config: CliConfig): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getConfig(): CliConfig {
  return readConfigRaw();
}

export function setConfigValue(key: keyof CliConfig, value: string): void {
  const current = readConfigRaw();
  if (key === 'apiKey') {
    current.apiKey = value;
  } else if (key === 'apiUrl') {
    current.apiUrl = value.endsWith('/') ? value.slice(0, -1) : value;
  }
  writeConfigRaw(current);
}

export function getApiKey(): string {
  const config = getConfig();
  return config.apiKey || process.env.NUSAAI_API_KEY || '';
}

export function getApiUrl(): string {
  const config = getConfig();
  const defaultUrl = 'http://localhost:4000/api/v1';
  return config.apiUrl || process.env.NUSAAI_API_URL || defaultUrl;
}
