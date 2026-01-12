/*
 * AUTO-GENERATED FILES.
 * Do not edit by hand.
 * Source: protocol/schemas/*.json
 */

export interface LevelspecV0 {
  version: '0';
  seed: number;
  units: 'tile';
  tiles: {
    size: number;
    [k: string]: unknown;
  };
  /**
   * @minItems 1
   */
  rooms: [
    {
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      theme?: string;
      [k: string]: unknown;
    },
    ...{
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      theme?: string;
      [k: string]: unknown;
    }[]
  ];
  connections: {
    from: string;
    to: string;
    type: string;
    locked?: boolean;
    keyId?: string;
    [k: string]: unknown;
  }[];
  entities: {
    id: string;
    type: string;
    subtype?: string;
    roomId: string;
    x: number;
    y: number;
    [k: string]: unknown;
  }[];
  spawn: {
    roomId: string;
    x: number;
    y: number;
    [k: string]: unknown;
  };
  exit: {
    roomId: string;
    x: number;
    y: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
