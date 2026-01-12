import { describe, expect, it } from 'vitest';
import { generateLevelSpec } from '../src/index.js';

describe('sample provider', () => {
    it('generates deterministic protocol-compliant spec', () => {
        const spec1 = generateLevelSpec('test', 123);
        const spec2 = generateLevelSpec('test', 123);

        expect(spec1).toEqual(spec2);
        expect(spec1.version).toBe('0');
        expect(spec1.rooms.length).toBeGreaterThan(0);
        expect(spec1.spawn).toBeDefined();
        expect(spec1.exit).toBeDefined();
    });
});
