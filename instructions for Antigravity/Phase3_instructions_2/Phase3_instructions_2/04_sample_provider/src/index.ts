import { Rng } from '@ghost-engine/kernel';

/**
 * Minimal LevelSpec shape (align this to protocol schemas).
 * If you already have `levelspec.v0.schema.json`, import the generated type instead.
 */
export type LevelSpecV0 = {
  version: '0';
  seed: number;
  prompt: string;
  width: number;
  height: number;
  tiles: string[]; // array of rows
  legend: Record<string, string>;
  provenance: {
    provider: 'sample';
    providerVersion: string;
    createdAt: string; // ISO
  };
};

export function generateLevelSpec(prompt: string, seed: number, opts?: { width?: number; height?: number }): LevelSpecV0 {
  const width = opts?.width ?? 21;
  const height = opts?.height ?? 13;
  const rng = new Rng(seed);

  // Build empty map with border walls
  const grid: string[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const border = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      return border ? '#' : '.';
    })
  );

  // Sprinkle deterministic walls
  const wallCount = Math.floor((width * height) / 8);
  for (let i = 0; i < wallCount; i++) {
    const x = rng.int(1, width - 2);
    const y = rng.int(1, height - 2);
    if (grid[y][x] === '.') grid[y][x] = '#';
  }

  // Place player + exit
  grid[1][1] = 'P';
  grid[height - 2][width - 2] = 'X';

  // Place a few enemies and items
  const enemies = Math.max(1, Math.floor((width * height) / 60));
  for (let i = 0; i < enemies; i++) {
    const x = rng.int(1, width - 2);
    const y = rng.int(1, height - 2);
    if (grid[y][x] === '.') grid[y][x] = 'E';
  }

  const items = Math.max(1, Math.floor((width * height) / 80));
  for (let i = 0; i < items; i++) {
    const x = rng.int(1, width - 2);
    const y = rng.int(1, height - 2);
    if (grid[y][x] === '.') grid[y][x] = 'I';
  }

  // Use prompt to slightly bias aesthetics (deterministically)
  // NOTE: keep this deterministic: only seed-based branching.
  if (prompt.toLowerCase().includes('lab')) {
    // carve a small hallway
    for (let x = 2; x < width - 2; x++) grid[2][x] = '.';
  }

  const tiles = grid.map((row) => row.join(''));

  return {
    version: '0',
    seed,
    prompt,
    width,
    height,
    tiles,
    legend: {
      '#': 'wall',
      '.': 'floor',
      'P': 'player_spawn',
      'X': 'exit',
      'E': 'enemy',
      'I': 'item',
    },
    provenance: {
      provider: 'sample',
      providerVersion: '0.1.0',
      createdAt: new Date(0).toISOString(),
    },
  };
}
