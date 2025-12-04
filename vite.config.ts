
  import { defineConfig, Plugin } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';
  import fs from 'fs';

  /**
   * Recursive copy function
   */
  function copyRecursive(src: string, dest: string): void {
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

  /**
   * Custom plugin to copy content files to build directory
   * Replaces vite-plugin-static-copy to avoid ES module issues
   */
  function copyContentPlugin(): Plugin {
    return {
      name: 'copy-content',
      writeBundle() {
        const srcDir = path.join(process.cwd(), 'src', 'content');
        const destDir = path.join(process.cwd(), 'build', 'content');

        console.log('📦 Copying content files...');
        console.log(`   Source: ${srcDir}`);
        console.log(`   Destination: ${destDir}`);

        if (!fs.existsSync(srcDir)) {
          console.warn('⚠️ Content source directory not found:', srcDir);
          return;
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

  /**
   * Custom plugin to copy assets/images to build directory
   */
  function copyAssetsPlugin(): Plugin {
    return {
      name: 'copy-assets',
      writeBundle() {
        const srcDir = path.join(process.cwd(), 'src', 'assets', 'images');
        const destDir = path.join(process.cwd(), 'build', 'assets', 'images');

        console.log('📦 Copying image assets...');
        console.log(`   Source: ${srcDir}`);
        console.log(`   Destination: ${destDir}`);

        if (!fs.existsSync(srcDir)) {
          console.warn('⚠️ Assets source directory not found:', srcDir);
          return;
        }

        try {
          copyRecursive(srcDir, destDir);
          console.log('✅ Copied image assets to build/assets/images/');
        } catch (error) {
          console.error('❌ Error copying assets:', error);
        }
      },
    };
  }

  /**
   * Custom plugin to serve assets/images in development mode
   */
  function serveAssetsPlugin(): Plugin {
    return {
      name: 'serve-assets',
      configureServer(server) {
        // Handle /assets/images/* paths
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          
          // Handle /assets/images/* or /FeatureDocsite/assets/images/*
          if (url.startsWith('/assets/images/') || url.startsWith('/FeatureDocsite/assets/images/')) {
            // Remove /FeatureDocsite prefix if present
            const cleanUrl = url.startsWith('/FeatureDocsite') 
              ? url.substring('/FeatureDocsite'.length)
              : url;
            
            // Map /assets/images/* to src/assets/images/*
            const imagePath = path.join(process.cwd(), 'src', cleanUrl.substring(1)); // Remove leading /
            
            if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
              const ext = path.extname(imagePath).toLowerCase();
              const contentType = 
                ext === '.png' ? 'image/png' :
                ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                ext === '.gif' ? 'image/gif' :
                ext === '.svg' ? 'image/svg+xml' :
                'application/octet-stream';
              
              res.setHeader('Content-Type', contentType);
              res.setHeader('Cache-Control', 'public, max-age=31536000');
              const fileStream = fs.createReadStream(imagePath);
              fileStream.pipe(res);
              return;
            }
          }
          next();
        });
      },
    };
  }

  export default defineConfig({
    // Base path for GitHub Pages deployment
    base: '/FeatureDocsite/',
    
    plugins: [
      react(),
      copyContentPlugin(),
      copyAssetsPlugin(),
      serveAssetsPlugin(),
    ],
    
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mdx'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });