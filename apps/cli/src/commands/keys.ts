import { Command } from 'commander';
import { callApi } from '../api';
import { getApiKey } from '../config';

interface ApiKeyInfo {
  id: string;
  key: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export function registerKeysCommand(program: Command) {
  const keysCmd = program
    .command('keys')
    .description('Manage your API keys');

  keysCmd
    .command('list')
    .description('List all API keys')
    .action(async () => {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.log('No API key configured. Use "nusaai config set-key <key>" first.');
        return;
      }

      try {
        const keys: ApiKeyInfo[] = await callApi('GET', '/admin/keys');
        if (keys.length === 0) {
          console.log('You have no API keys yet. Create one with "nusaai keys create <name>".');
          return;
        }

        console.log('\n🔑 Your API keys:\n');
        console.log('  ┌──────────────────────────┬──────────────────────────────────┬────────┬─────────┐');
        console.log('  │ Name                     │ Key                              │ Active │ Created  │');
        console.log('  ├──────────────────────────┼──────────────────────────────────┼────────┼─────────┤');
        for (const k of keys) {
          const shortKey = k.key ? k.key.slice(0, 16) + '…' : '';
          const active = k.active ? '✔' : '✖';
          const created = new Date(k.createdAt).toLocaleDateString();
          console.log(
            `  │ ${String(k.name).padEnd(24)} │ ${shortKey.padEnd(32)} │ ${active.padEnd(6)} │ ${created.padEnd(7)} │`,
          );
        }
        console.log('  └──────────────────────────┴──────────────────────────────────┴────────┴─────────┘\n');
      } catch (err: any) {
        console.error(`\nFailed to list keys: ${err.message}`);
        process.exitCode = 1;
      }
    });

  keysCmd
    .command('create <name>')
    .description('Create a new API key')
    .action(async (name: string) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.log('No API key configured. Use "nusaai config set-key <key>" first.');
        return;
      }

      try {
        const created: ApiKeyInfo = await callApi('POST', '/admin/keys', { name });
        console.log('\n✅ New API key created:');
        console.log(`   Name:   ${created.name}`);
        console.log(`   Key:    ${created.key}`);
        console.log(`   Active: ${created.active ? 'yes' : 'no'}\n`);
      } catch (err: any) {
        console.error(`\nFailed to create key: ${err.message}`);
        process.exitCode = 1;
      }
    });

  keysCmd
    .command('delete <keyId>')
    .description('Delete an API key by ID')
    .action(async (keyId: string) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.log('No API key configured. Use "nusaai config set-key <key>" first.');
        return;
      }

      try {
        await callApi('DELETE', `/admin/keys/${keyId}`);
        console.log(`\n✅ API key "${keyId}" deleted.\n`);
      } catch (err: any) {
        console.error(`\nFailed to delete key: ${err.message}`);
        process.exitCode = 1;
      }
    });
}
