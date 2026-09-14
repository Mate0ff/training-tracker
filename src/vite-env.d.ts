/// <reference types="vite/client" />

import type { WorkoutTrackerApi } from './lib/data/api';

declare global {
  interface Window {
    /**
     * Bridged from the Electron main process via contextBridge in
     * electron/preload.ts. Undefined when running outside Electron
     * (e.g. plain `vite` in a browser) — see getApi() in lib/data/api.ts
     * for the fallback to mockApi in that case.
     */
    trackerApi?: WorkoutTrackerApi;
  }
}

export {};
