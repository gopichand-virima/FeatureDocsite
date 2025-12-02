import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

/**
 * Custom plugin to copy content files to build directory
 * Replaces vite-plugin-static-copy to avoid ES module issues
 */
function copyContentPlugin(): Plugin {
  return {
    name: 'copy-content',
    writeBundle() {
      const srcDir = path.join(process.cwd(), 'content');
      const destDir = path.join(process.cwd(), 'build', 'content');

      console.log('📦 Copying content files...');
      console.log(`   Source: ${srcDir}`);
      console.log(`   Destination: ${destDir}`);

      if (!fs.existsSync(srcDir)) {
        console.warn('⚠️ Content source directory not found:', srcDir);
        return;
      }

      // Recursive copy function
      function copyRecursive(src: string, dest: string) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }

      try {
        copyRecursive(srcDir, destDir);
        
        // Count files
        let fileCount = 0;
        function countFiles(dir: string): void {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              countFiles(path.join(dir, entry.name));
            } else if (entry.name.endsWith('.mdx')) {
              fileCount++;
            }
          }
        }
        countFiles(destDir);
        
        console.log(`✅ Copied ${fileCount} MDX files to build/content/`);
      } catch (error) {
        console.error('❌ Error copying content files:', error);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/FeatureDocsite/',
  
  plugins: [
    react(),
    copyContentPlugin(),
  ],
  
  resolve: {
    // Add .mdx extension support
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mdx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/content': path.resolve(__dirname, './content'),
      '@/styles': path.resolve(__dirname, './styles'),
    },
  },
  
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mdx-vendor': ['@mdx-js/react'],
        },
      },
    },
  },
  
  server: {
    port: 3000,
    open: true,
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mdx-js/react',
    ],
  },
});
