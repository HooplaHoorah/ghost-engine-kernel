import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileFromFile } from 'json-schema-to-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMAS_DIR = path.resolve(__dirname, '..', 'schemas');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'generated');

const banner = `/*
 * AUTO-GENERATED FILES.
 * Do not edit by hand.
 * Source: protocol/schemas/*.json
 */
`;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const entries = await fs.readdir(SCHEMAS_DIR, { withFileTypes: true });
  const schemaFiles = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith('.schema.json') || name.endsWith('.schema.jsonc') || name.endsWith('.json'))
    .filter((name) => !name.startsWith('.'))
    .sort();

  if (schemaFiles.length === 0) {
    console.error(`No schema files found in ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const exports = [];

  for (const filename of schemaFiles) {
    const fullpath = path.join(SCHEMAS_DIR, filename);
    const base = filename
      .replace(/\.schema\.jsonc?$/i, '')
      .replace(/\.jsonc?$/i, '');

    const typeName = base
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^[^a-zA-Z]+/, '')
      .replace(/^./, (c) => c.toUpperCase());

    const ts = await compileFromFile(fullpath, {
      bannerComment: banner,
      style: { singleQuote: true },
      enableConstEnums: false,
    });

    const outFile = path.join(OUT_DIR, `${base}.ts`);
    // Force an exported name (so downstream imports are stable)
    const rewritten = ts.replace(/export interface (\w+)/, `export interface ${typeName}`);
    await fs.writeFile(outFile, rewritten, 'utf8');

    exports.push({ base, typeName });
    console.log(`Generated ${outFile} (${typeName})`);
  }

  const indexLines = [
    banner,
    ...exports.map(({ base, typeName }) => `export type { ${typeName} } from './${base}.js';`),
    '',
  ];

  await fs.writeFile(path.join(OUT_DIR, `index.ts`), indexLines.join('\n'), 'utf8');
  console.log('Wrote src/generated/index.ts');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
