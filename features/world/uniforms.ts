import { createContext, useContext } from 'react';
import type { WindowUniforms } from './windowMaterial';

export type WorldUniforms = {
  city: WindowUniforms;
  tower: WindowUniforms;
  /** 0…1, interior lamps. */
  lamps: { value: number };
  /** Front door opening, 0…1. */
  door: { value: number };
};

export function createWorldUniforms(): WorldUniforms {
  return {
    city: { uLit: { value: 0.2 }, uGlow: { value: 1 } },
    tower: { uLit: { value: 0.3 }, uGlow: { value: 1 } },
    lamps: { value: 0 },
    door: { value: 0 },
  };
}

export const UniformsContext = createContext<WorldUniforms | null>(null);
export function useWorldUniforms() {
  const u = useContext(UniformsContext);
  if (!u) throw new Error('useWorldUniforms outside <World>');
  return u;
}
