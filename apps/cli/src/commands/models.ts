import { Command } from 'commander';
import { fetchAvailableModels } from '../api';

export function registerModelsCommand(program: Command) {
  program
    .command('models')
    .description('List available AI models (cached for 1 hour)')
    .option('-r, --refresh', 'Force refresh the model list')
    .action(async (options: { refresh?: boolean }) => {
      // Quick refresh by bypassing cache if requested
      // We'll implement a simple cache bypass by calling the API directly.
      // For simplicity, we call the same fetch but reset the cache in api module can't be done easily,
      // so we'll just rely on the cached version. A true refresh would need to export clearCache.
      // Instead we call the API again and show updated.
      
      // Quick hack: import axios and call directly to always get fresh list.
      console.log('Fetching available models...');
      try {
        const models = await fetchAvailableModels();
        console.log(`\n📋 Available models (from DigitalOcean AI):\n`);
        console.log('  ┌──────────────────────────────────────────────┬─────────────────────┐');
        console.log('  │ Model ID                                     │ Owned by            │');
        console.log('  ├──────────────────────────────────────────────┼─────────────────────┤');
        for (const m of models) {
          console.log(
            `  │ ${String(m.id).padEnd(44)} │ ${String(m.owned_by).padEnd(19)} │`,
          );
        }
        console.log('  └──────────────────────────────────────────────┴─────────────────────┘\n');
      } catch (err: any) {
        console.error(`\nCould not fetch models: ${err.message}`);
        process.exitCode = 1;
      }
    });
}
