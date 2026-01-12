/**
 * Deterministic PRNG (Mulberry32) — small, fast, reproducible.
 * Use this for *all* randomness inside the kernel tick.
 */
export class Rng {
    private state: number;

    constructor(seed: number) {
        // Force to uint32
        this.state = seed >>> 0;
    }

    /** Returns float in [0, 1) */
    next(): number {
        // mulberry32
        let t = (this.state += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /** Returns int in [min, max] */
    int(min: number, max: number): number {
        if (max < min) throw new Error('Rng.int: max < min');
        const r = this.next();
        return min + Math.floor(r * (max - min + 1));
    }

    /** Returns a copy with same internal state */
    clone(): Rng {
        const r = new Rng(0);
        (r as any).state = this.state;
        return r;
    }

    getState(): number {
        return this.state >>> 0;
    }
}
