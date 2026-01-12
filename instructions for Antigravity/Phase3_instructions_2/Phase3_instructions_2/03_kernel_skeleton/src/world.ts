export type Vec2 = { x: number; y: number };

export type EntityId = string;

export type WorldEntity = {
  id: EntityId;
  kind: 'player' | 'enemy' | 'pickup' | 'prop';
  pos: Vec2;
  hp?: number;
};

export type WorldState = {
  /** Version of the kernel state shape (not the protocol version) */
  version: '0.1.0';
  tick: number;
  /** seed used to initialize RNG; stored for provenance */
  seed: number;
  entities: WorldEntity[];
};

export type InputEvent =
  | { type: 'MOVE'; entityId: EntityId; dx: number; dy: number }
  | { type: 'DAMAGE'; entityId: EntityId; amount: number }
  | { type: 'SPAWN_ENEMY'; at: Vec2 };

export type KernelEvent =
  | { type: 'MOVED'; entityId: EntityId; pos: Vec2 }
  | { type: 'DAMAGED'; entityId: EntityId; hp: number }
  | { type: 'SPAWNED'; entityId: EntityId };

export type TickResult = {
  state: WorldState;
  events: KernelEvent[];
};

export function createInitialWorld(seed: number): WorldState {
  return {
    version: '0.1.0',
    tick: 0,
    seed,
    entities: [
      { id: 'player-1', kind: 'player', pos: { x: 1, y: 1 }, hp: 100 },
    ],
  };
}
