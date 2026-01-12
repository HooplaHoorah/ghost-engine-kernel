import crypto from 'node:crypto';

/**
 * Stable hash for determinism checks.
 *
 * IMPORTANT: JSON.stringify is not guaranteed stable if object key order differs.
 * We therefore canonicalize by sorting keys recursively.
 */
export function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        const keys = Object.keys(obj).sort();
        const out: Record<string, unknown> = {};
        for (const k of keys) out[k] = canonicalize(obj[k]);
        return out;
    }
    return value;
}

export function sha256Json(value: unknown): string {
    const canon = canonicalize(value);
    const json = JSON.stringify(canon);
    return crypto.createHash('sha256').update(json).digest('hex');
}
