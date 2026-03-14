import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const manualChunks = (id: string) => {
  if (!id.includes('node_modules')) {
    if (id.includes('/src/nodes/')) {
      return 'app-nodes';
    }

    if (id.includes('/src/AudioEngine.ts')) {
      return 'app-audio-engine';
    }

    return undefined;
  }

  if (id.includes('/reactflow/')) {
    return 'vendor-reactflow';
  }

  if (id.includes('/react-dom/') || id.includes('/react/')) {
    return 'vendor-react';
  }

  if (id.includes('/lucide-react/')) {
    return 'vendor-icons';
  }

  return 'vendor-misc';
};

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 350,
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
