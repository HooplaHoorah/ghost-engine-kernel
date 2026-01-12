import { Rng } from './rng.js';
import { sha256Json } from './hash.js';
import type { InputEvent, TickResult, WorldState } from './world.js';
import { tick } from './tick.js';

export type ReplayFrame = {
  input: InputEvent | null;
  stateHash: string;
};

export type ReplayLog = {
  seed: number;
  initialStateHash: string;
  frames: ReplayFrame[];
};

export function runAndRecord(initial: WorldState, inputs: (InputEvent | null)[]): ReplayLog {
  const rng = new Rng(initial.seed);
  let state = initial;
  const frames: ReplayFrame[] = [];

  const initialStateHash = sha256Json(state);

  for (const input of inputs) {
    const res: TickResult = tick(state, input, rng);
    state = res.state;
    frames.push({ input, stateHash: sha256Json(state) });
  }

  return { seed: initial.seed, initialStateHash, frames };
}

export function replay(initial: WorldState, log: ReplayLog): boolean {
  if (log.seed !== initial.seed) return false;
  if (log.initialStateHash !== sha256Json(initial)) return false;

  const rng = new Rng(initial.seed);
  let state = initial;

  for (const frame of log.frames) {
    state = tick(state, frame.input, rng).state;
    if (sha256Json(state) !== frame.stateHash) return false;
  }

  return true;
}
