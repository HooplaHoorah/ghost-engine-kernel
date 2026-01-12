#!/usr/bin/env node
/**
 * backend-determinism-test.js
 *
 * Generates a Doom‑bridge job with a fixed seed, replays it, and verifies that the
 * resulting LevelSpec JSON is identical (by SHA‑256 hash). If the hashes differ the
 * script exits with a non‑zero code, causing the CI job to fail.
 */
import fetch from 'node-fetch'; // fallback for older node versions; native fetch works on >=18
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is required');
    process.exit(1);
}

const FIXED_SEED = 777;
const PLUGIN = 'doom-bridge';
const MAX_RETRIES = 5;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function retry(fn, description) {
    let attempt = 0;
    let delay = 1000;
    while (attempt < MAX_RETRIES) {
        try {
            return await fn();
        } catch (e) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
                console.error(`${description} failed after ${attempt} attempts:`, e.message);
                throw e;
            }
            console.warn(`${description} error (attempt ${attempt}): ${e.message}. Retrying in ${delay}ms…`);
            await sleep(delay);
            delay *= 2; // exponential back‑off
        }
    }
}

async function postGenerate() {
    const body = { prompt: 'Determinism test', plugin: PLUGIN, seed: FIXED_SEED };
    const res = await fetch(`${API_BASE_URL}/generate-scene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`generate-scene ${res.status}`);
    const json = await res.json();
    return json.jobId;
}

async function postReplay(jobId) {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/replay`, { method: 'POST' });
    if (!res.ok) throw new Error(`replay ${res.status}`);
    const json = await res.json();
    return json.jobId;
}

async function pollDone(jobId) {
    const start = Date.now();
    const timeout = 120000; // 2 minutes
    while (Date.now() - start < timeout) {
        const res = await fetch(`${API_BASE_URL}/status/${jobId}`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        if (json.status === 'done') return json;
        if (json.status === 'failed') throw new Error(`job failed: ${JSON.stringify(json)}`);
        await sleep(1000);
    }
    throw new Error('poll timeout');
}

async function fetchLevelSpec(jobStatus) {
    // Prefer presigned URL if present, otherwise inline levelSpec
    if (jobStatus.result?.levelSpecUrl) {
        const res = await fetch(jobStatus.result.levelSpecUrl);
        if (!res.ok) throw new Error(`levelSpecUrl fetch ${res.status}`);
        return await res.json();
    }
    if (jobStatus.result?.levelSpec) {
        return jobStatus.result.levelSpec;
    }
    throw new Error('no levelSpec found in job result');
}

function canonicalize(obj) {
    if (Array.isArray(obj)) {
        return obj.map(canonicalize);
    } else if (obj && typeof obj === 'object') {
        const sorted = Object.keys(obj).sort();
        const out = {};
        for (const k of sorted) {
            out[k] = canonicalize(obj[k]);
        }
        return out;
    }
    return obj;
}

function hashJson(obj) {
    const canon = JSON.stringify(canonicalize(obj));
    return createHash('sha256').update(canon).digest('hex');
}

(async () => {
    try {
        // 1️⃣ generate original job
        const origJobId = await retry(postGenerate, 'generate-scene');
        console.log('Generated job', origJobId);
        const origStatus = await pollDone(origJobId);
        const origSpec = await fetchLevelSpec(origStatus);
        const origHash = hashJson(origSpec);
        console.log('Original LevelSpec hash:', origHash);

        // 2️⃣ replay job
        const replayJobId = await retry(() => postReplay(origJobId), 'replay');
        console.log('Replay job', replayJobId);
        const replayStatus = await pollDone(replayJobId);
        const replaySpec = await fetchLevelSpec(replayStatus);
        const replayHash = hashJson(replaySpec);
        console.log('Replay LevelSpec hash:', replayHash);

        if (origHash !== replayHash) {
            console.error('❌ Determinism check failed – hashes differ');
            console.error('Original:', origHash);
            console.error('Replay:  ', replayHash);
            process.exit(1);
        }
        console.log('✅ Determinism check passed – hashes match');
        process.exit(0);
    } catch (e) {
        console.error('Error during determinism test:', e.message);
        process.exit(1);
    }
})();
