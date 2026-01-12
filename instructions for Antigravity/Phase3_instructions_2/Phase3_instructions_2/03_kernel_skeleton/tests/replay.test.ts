import { describe, expect, it } from 'vitest';
import { createInitialWorld } from '../src/world.js';
import { runAndRecord, replay } from '../src/replay.js';

describe('replay validation', () => {
  it('fails if seed mismatches', () => {
    const log = runAndRecord(createInitialWorld(1), [null, null]);
    expect(replay(createInitialWorld(2), log)).toBe(false);
  });
});
