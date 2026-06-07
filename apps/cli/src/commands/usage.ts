import { Command } from 'commander';
import { callApi } from '../api';
import { getApiKey } from '../config';

interface UsageInfo {
  totalTokens: number;
  totalCost: number;
  logs: Array<{ model: string; tokensIn: number; tokensOut: number; createdAt: string }>;
}

export function registerUsageCommand(program: Command) {
  program
    .command('usage')
    .description('View your token usage summary (requires API key)')
    .option('-l, --limit <number>', 'Number of recent logs to show', '10')
    .action(async (options: { limit: string }) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.log('No API key configured. Use "nusaai config set-key <key>" first.');
        return;
      }

      const limit = parseInt(options.limit, 10) || 10;

      try {
        const data = await callApi<UsageInfo>('GET', `/admin/usage?limit=${limit}`);
        console.log(`\n📊 Usage summary`);
        console.log(`   Total tokens: ${data.totalTokens.toLocaleString()}`);
        console.log(`   Estimated cost: $${data.totalCost.toFixed(4)}`);
        console.log(`\n   Recent logs (last ${limit}):`);
        console.log('   ┌──────────────────────────────────────┬──────────┬──────────┐');
        console.log('   │ Model                                │ Tok-in   │ Tok-out  │');
        console.log('   ├──────────────────────────────────────┼──────────┼──────────┤');
        for (const log of data.logs) {
          console.log(
            `   │ ${String(log.model).padEnd(36)} │ ${String(log.tokensIn).padStart(8)} │ ${String(log.tokensOut).padStart(8)} │`,
          );
        }
        console.log('   └──────────────────────────────────────┴──────────┴──────────┘\n');
      } catch (err: any) {
        console.error(`\nFailed to retrieve usage: ${err.message}`);
        process.exitCode = 1;
      }
    });
}
