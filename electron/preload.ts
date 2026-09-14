import { contextBridge, ipcRenderer } from 'electron';
import type { WorkoutTrackerApi } from '../src/lib/data/api';

// Bridges the WorkoutTrackerApi contract (src/lib/data/api.ts) from the
// main process to the renderer as window.trackerApi, via contextBridge so
// the renderer never gets direct Node/IPC access. Channel names must match
// electron/ipc/persistence.ts exactly.
const trackerApi: WorkoutTrackerApi = {
  listExercises: () => ipcRenderer.invoke('trackerApi:listExercises'),
  getExercise: (id) => ipcRenderer.invoke('trackerApi:getExercise', id),
  listLogEntriesForDate: (date) => ipcRenderer.invoke('trackerApi:listLogEntriesForDate', date),
  listLogEntriesForRange: (startDate, endDate) =>
    ipcRenderer.invoke('trackerApi:listLogEntriesForRange', startDate, endDate),
  createLogEntry: (entry) => ipcRenderer.invoke('trackerApi:createLogEntry', entry),
  updateLogEntry: (id, patch) => ipcRenderer.invoke('trackerApi:updateLogEntry', id, patch),
  deleteLogEntry: (id) => ipcRenderer.invoke('trackerApi:deleteLogEntry', id),
  getWeekSummary: (weekStartDate) => ipcRenderer.invoke('trackerApi:getWeekSummary', weekStartDate),
  getMonthSummary: (month) => ipcRenderer.invoke('trackerApi:getMonthSummary', month),
};

contextBridge.exposeInMainWorld('trackerApi', trackerApi);
