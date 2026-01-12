import { describe, expect, it } from 'vitest';
import { generateLevelSpec } from '../src/index.js';

describe('SampleProvider', () => {
  it('is deterministic for same prompt+seed', () => {
    const a = generateLevelSpec('test', 42);
    const b = generateLevelSpec('test', 42);
    expect(a).toEqual(b);
  });
});
