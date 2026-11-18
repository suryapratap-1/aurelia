/**
 * Re-exports three.js unchanged, except `Clock`.
 *
 * @react-three/fiber 9.x (latest stable) still constructs `THREE.Clock`, which three r183+ marks as
 * deprecated and warns about on every page load. This drop-in keeps the identical API and timing
 * (performance.now) without the warning, until fiber moves to `THREE.Timer` (v10).
 * Wired up with `turbopack.resolveAlias` in next.config.ts; every package resolves `three` here, so
 * there is still exactly one copy of three.js in the bundle.
 */
export * from '../../node_modules/three/build/three.module.js';

export class Clock {
  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;
    this.running = false;
  }
  start() {
    this.startTime = performance.now();
    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }
  stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }
  getElapsedTime() {
    this.getDelta();
    return this.elapsedTime;
  }
  getDelta() {
    let diff = 0;
    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }
    if (this.running) {
      const now = performance.now();
      diff = (now - this.oldTime) / 1000;
      this.oldTime = now;
      this.elapsedTime += diff;
    }
    return diff;
  }
}
