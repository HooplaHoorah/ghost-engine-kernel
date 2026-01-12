import { Rng } from './rng.js';
import type { InputEvent, KernelEvent, TickResult, WorldEntity, WorldState } from './world.js';

/**
 * Deterministic tick reducer.
 *
 * Rules:
 * - No Date.now(), Math.random(), or non-deterministic IO.
 * - Only mutate via copy-on-write.
 */
export function tick(prev: WorldState, input: InputEvent | null, rng: Rng): TickResult {
  let state: WorldState = {
    ...prev,
    tick: prev.tick + 1,
    entities: prev.entities.map((e) => ({ ...e, pos: { ...e.pos } })),
  };

  const events: KernelEvent[] = [];

  if (input) {
    switch (input.type) {
      case 'MOVE': {
        const ent = state.entities.find((e) => e.id === input.entityId);
        if (ent) {
          ent.pos.x += input.dx;
          ent.pos.y += input.dy;
          events.push({ type: 'MOVED', entityId: ent.id, pos: { ...ent.pos } });
        }
        break;
      }
      case 'DAMAGE': {
        const ent = state.entities.find((e) => e.id === input.entityId);
        if (ent) {
          const hp = typeof ent.hp === 'number' ? ent.hp : 0;
          ent.hp = Math.max(0, hp - input.amount);
          events.push({ type: 'DAMAGED', entityId: ent.id, hp: ent.hp });
        }
        break;
      }
      case 'SPAWN_ENEMY': {
        const id = `enemy-${state.tick}-${rng.int(1000, 9999)}`;
        const enemy: WorldEntity = { id, kind: 'enemy', pos: { ...input.at }, hp: 25 };
        state.entities.push(enemy);
        events.push({ type: 'SPAWNED', entityId: id });
        break;
      }
    }
  }

  return { state, events };
}
