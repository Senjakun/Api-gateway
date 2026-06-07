import { Command } from 'commander';
import { setConfigValue, getConfig } from '../config';

export function registerConfigCommand(program: Command) {
  const configCmd = program
    .command('config')
    .description('Manage NusaAI CLI configuration');

  configCmd
    .command('set-key <apiKey>')
    .description('Store your NusaAI API key locally')
    .action((apiKey: string) => {
      setConfigValue('apiKey', apiKey);
      console.log('✅ API key has been saved.');
    });

  configCmd
    .command('set-url <url>')
    .description('Set the NusaAI API base URL')
    .action((url: string) => {
      setConfigValue('apiUrl', url);
      console.log(`✅ API URL set to "${url}".`);
    });

  configCmd
    .command('show')
    .description('Display current CLI configuration')
    .action(() => {
      const cfg = getConfig();
      console.log('Current NusaAI CLI configuration:');
      console.log(`  API URL : ${cfg.apiUrl || '(default)'}`);
      console.log(`  API Key : ${cfg.apiKey ? cfg.apiKey.slice(0, 12) + '…' : '(not set)'}`);
    });
}
