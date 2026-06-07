#!/usr/bin/env node

import { Command } from 'commander';
import { registerChatCommand } from './commands/chat';
import { registerConfigCommand } from './commands/config';
import { registerUsageCommand } from './commands/usage';
import { registerKeysCommand } from './commands/keys';
import { registerModelsCommand } from './commands/models';

const program = new Command();

program
  .name('nusaai')
  .description('NusaAI CLI – AI Gateway toolchain')
  .version('0.1.0');

registerChatCommand(program);
registerConfigCommand(program);
registerUsageCommand(program);
registerKeysCommand(program);
registerModelsCommand(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(`\n[Error] ${err.message}`);
  process.exit(1);
});
