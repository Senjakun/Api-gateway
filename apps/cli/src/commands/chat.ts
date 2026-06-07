import { Command } from 'commander';
import { callChatCompletion } from '../api';
import { getApiKey } from '../config';

export function registerChatCommand(program: Command) {
  program
    .command('chat [message...]')
    .description('Send a chat message and receive a response')
    .option('-m, --model <name>', 'Model to use (default: deepseek-v4-pro)')
    .action(async (messageParts: string[], options: { model?: string }) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.log('No API key configured. Use "nusaai config set-key <key>" first.');
        return;
      }

      let prompt = messageParts.join(' ').trim();
      if (!prompt) {
        // If no message provided, possibly could use stdin in the future.
        console.log('Please provide a message. Usage: nusaai chat "Hello!"');
        return;
      }

      const userMsg = { role: 'user', content: prompt };

      console.log(`\n🤖 NusaAI (model: ${options.model || 'auto'})`);
      console.log('──────────────────────────────');

      try {
        const result = await callChatCompletion([userMsg], options.model);
        console.log(`\n> ${result.content}\n`);
        console.log(`Model: ${result.model} | Tokens: ${result.usage.total_tokens}`);
      } catch (err: any) {
        console.error(`\nChat request failed: ${err.message}`);
        process.exitCode = 1;
      }
    });
}
