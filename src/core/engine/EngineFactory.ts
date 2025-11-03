/**
 * Factory for creating browser engine instances
 * Allows switching between different engines (WebKit, Servo, custom, etc.)
 */

import type { BrowserEngine } from './types';
import { WebKitEngine } from './WebKitEngine';
import { ServoEngine } from './ServoEngine';

export type EngineType = 'webkit' | 'servo' | 'custom';

export class EngineFactory {
  static createEngine(type: EngineType = 'webkit'): BrowserEngine {
    switch (type) {
      case 'webkit':
        return new WebKitEngine();
      case 'servo':
        return new ServoEngine();
      case 'custom':
        // Placeholder for custom engine implementation
        throw new Error('Custom engine not yet implemented');
      default:
        return new WebKitEngine();
    }
  }

  static async createAndInitialize(type: EngineType = 'webkit'): Promise<BrowserEngine> {
    const engine = this.createEngine(type);
    await engine.initialize();
    return engine;
  }
}

