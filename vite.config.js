import { defineConfig } from 'vite';

export default defineConfig({
  // Other Vite configuration options...

  resolve: {
    alias: {
      // Add your import aliases here.
      '@src': '/src', // This maps @src to the 'src' directory in your project.
      '@sprites': '/assests/sprites', // This maps @components to the 'src/components' directory.
      '@game': '/gameSetting',
      '@gameObjects': '/src/classes/gameObjects',
     // '@utils': '/src/utils', // This maps @utils to the 'src/utils' directory.
    },
  },
});
