import { Command } from 'commander';
import { generateLevelSpec } from '@ghost-engine/sample-provider';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
    .name('ghost')
    .description('Ghost Engine CLI')
    .version('0.1.0');

program.command('play')
    .description('Play a level using a provider')
    .option('--provider <name>', 'Provider to use', 'sample')
    .option('--seed <number>', 'Seed for generation', '123')
    .action(async (options) => {
        if (options.provider !== 'sample') {
            console.error(chalk.red('Only sample provider is supported in this version'));
            process.exit(1);
        }

        const seed = parseInt(options.seed, 10);
        console.log(chalk.blue(`Generating level with seed ${seed}...`));

        const spec = generateLevelSpec('CLI Play', seed);

        // Save to temp file
        const tempFile = path.resolve('level.json');
        fs.writeFileSync(tempFile, JSON.stringify(spec, null, 2));
        console.log(chalk.green(`Level saved to ${tempFile}`));

        // Locate ge-doom runtime
        // Assuming we are running from 'cli' package or root, we need to find runtimes/ge-doom
        // We can try relative paths
        const runtimePath = path.resolve(__dirname, '../../runtimes/ge-doom/dist/index.js');

        if (!fs.existsSync(runtimePath)) {
            console.error(chalk.red(`Runtime not found at ${runtimePath}. Did you build it?`));
            process.exit(1);
        }

        console.log(chalk.blue('Launching GE Doom...'));

        const child = spawn('node', [runtimePath, '--levelSpec', tempFile], { stdio: 'inherit' });

        child.on('close', (code) => {
            console.log(`Runtime exited with code ${code}`);
            // fs.unlinkSync(tempFile); // Keep it for debug?
        });
    });

program.parse();
