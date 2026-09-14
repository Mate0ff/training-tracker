import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import renderer from 'vite-plugin-electron-renderer';
import path from 'node:path';

const __dirname = import.meta.dirname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Main process entry file of the Electron app.
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              output: {
                // Force CommonJS with a .cjs extension (package.json has
                // "type": "module", so a plain .js output here would be
                // ESM). CJS is required, not just preferred: Electron's
                // preload loader failed with "Unable to load preload
                // script" / "require is not defined in ES module scope"
                // when this was an .mjs build — the ESM loader can't read
                // through the asar virtual filesystem the way Electron's
                // patched CJS `require` can, so contextBridge silently
                // never ran and window.trackerApi stayed undefined in
                // every packaged build (fine in dev, where there's no
                // asar). See electron-builder.yml's asarUnpack comment —
                // that alone didn't fix it, since the runtime path Electron
                // resolves still points inside the asar either way.
                format: 'cjs',
                entryFileNames: 'preload.cjs',
              },
            },
          },
        },
      },
      // Polyfill Electron and Node.js API for Renderer process.
      renderer: {},
    }),
    renderer(),
  ],
});
