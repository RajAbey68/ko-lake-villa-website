
#!/usr/bin/env node

/**
 * Ko Lake Villa - Frontend Export Script
 * Exports frontend code and dependencies for external development
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🎨 Ko Lake Villa - Frontend Export');
console.log('=====================================');

try {
  // Create export directory
  const exportDir = 'frontend-export';
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  fs.mkdirSync(exportDir, { recursive: true });

  console.log('1. Copying frontend source files...');
  
  // Copy client directory (main frontend)
  if (fs.existsSync('client')) {
    fs.cpSync('client', path.join(exportDir, 'client'), { recursive: true });
    console.log('   ✅ Client directory copied');
  }

  // Copy components directory
  if (fs.existsSync('components')) {
    fs.cpSync('components', path.join(exportDir, 'components'), { recursive: true });
    console.log('   ✅ Components directory copied');
  }

  // Copy shared types and schemas
  if (fs.existsSync('shared')) {
    fs.cpSync('shared', path.join(exportDir, 'shared'), { recursive: true });
    console.log('   ✅ Shared directory copied');
  }

  console.log('2. Copying configuration files...');
  
  // Essential config files
  const configFiles = [
    'components.json',
    'tailwind.config.ts',
    'tsconfig.json',
    '.eslintrc.json',
    '.prettierrc.json'
  ];

  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(exportDir, file));
      console.log(`   ✅ ${file} copied`);
    }
  });

  // Copy package.json but create a frontend-focused version
  console.log('3. Creating frontend package.json...');
  
  if (fs.existsSync('package.json')) {
    const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const frontendPackage = {
      name: "ko-lake-villa-frontend",
      version: originalPackage.version || "1.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "type-check": "tsc --noEmit"
      },
      dependencies: {
        // React core
        "react": originalPackage.dependencies?.react || "^18.2.0",
        "react-dom": originalPackage.dependencies?.["react-dom"] || "^18.2.0",
        
        // Routing
        "react-router-dom": originalPackage.dependencies?.["react-router-dom"] || "^6.26.2",
        
        // State management
        "@tanstack/react-query": originalPackage.dependencies?.["@tanstack/react-query"] || "^5.60.5",
        
        // UI Components (Shadcn/UI)
        "@radix-ui/react-accordion": originalPackage.dependencies?.["@radix-ui/react-accordion"] || "^1.2.1",
        "@radix-ui/react-alert-dialog": originalPackage.dependencies?.["@radix-ui/react-alert-dialog"] || "^1.1.2",
        "@radix-ui/react-dialog": originalPackage.dependencies?.["@radix-ui/react-dialog"] || "^1.1.2",
        "@radix-ui/react-dropdown-menu": originalPackage.dependencies?.["@radix-ui/react-dropdown-menu"] || "^2.1.2",
        "@radix-ui/react-label": originalPackage.dependencies?.["@radix-ui/react-label"] || "^2.1.0",
        "@radix-ui/react-slot": originalPackage.dependencies?.["@radix-ui/react-slot"] || "^1.1.0",
        "@radix-ui/react-toast": originalPackage.dependencies?.["@radix-ui/react-toast"] || "^1.2.2",
        "@radix-ui/react-tooltip": originalPackage.dependencies?.["@radix-ui/react-tooltip"] || "^1.1.3",
        
        // Form handling
        "react-hook-form": originalPackage.dependencies?.["react-hook-form"] || "^7.55.0",
        "@hookform/resolvers": originalPackage.dependencies?.["@hookform/resolvers"] || "^3.10.0",
        "zod": originalPackage.dependencies?.zod || "^3.24.2",
        
        // Styling
        "tailwindcss": originalPackage.dependencies?.tailwindcss || "^3.4.1",
        "class-variance-authority": originalPackage.dependencies?.["class-variance-authority"] || "^0.7.0",
        "clsx": originalPackage.dependencies?.clsx || "^2.1.0",
        "tailwind-merge": originalPackage.dependencies?.["tailwind-merge"] || "^2.6.0",
        
        // Icons
        "lucide-react": originalPackage.dependencies?.["lucide-react"] || "^0.445.0",
        
        // Authentication
        "firebase": originalPackage.dependencies?.firebase || "^10.14.1",
        
        // Date handling
        "date-fns": originalPackage.dependencies?.["date-fns"] || "^3.6.0",
        
        // Animations
        "framer-motion": originalPackage.dependencies?.["framer-motion"] || "^11.0.0"
      },
      devDependencies: {
        "@types/react": originalPackage.devDependencies?.["@types/react"] || "^18.3.11",
        "@types/react-dom": originalPackage.devDependencies?.["@types/react-dom"] || "^18.3.1",
        "@typescript-eslint/eslint-plugin": originalPackage.devDependencies?.["@typescript-eslint/eslint-plugin"] || "^8.8.1",
        "@typescript-eslint/parser": originalPackage.devDependencies?.["@typescript-eslint/parser"] || "^8.8.1",
        "@vitejs/plugin-react": originalPackage.devDependencies?.["@vitejs/plugin-react"] || "^4.3.2",
        "autoprefixer": originalPackage.devDependencies?.autoprefixer || "^10.4.20",
        "eslint": originalPackage.devDependencies?.eslint || "^9.12.0",
        "eslint-plugin-react-hooks": originalPackage.devDependencies?.["eslint-plugin-react-hooks"] || "^5.0.0",
        "eslint-plugin-react-refresh": originalPackage.devDependencies?.["eslint-plugin-react-refresh"] || "^0.4.12",
        "postcss": originalPackage.devDependencies?.postcss || "^8.4.47",
        "typescript": originalPackage.devDependencies?.typescript || "^5.6.3",
        "vite": originalPackage.devDependencies?.vite || "^5.4.8"
      }
    };
    
    fs.writeFileSync(
      path.join(exportDir, 'package.json'), 
      JSON.stringify(frontendPackage, null, 2)
    );
    console.log('   ✅ Frontend package.json created');
  }

  // Create Vite config for standalone frontend
  console.log('4. Creating Vite configuration...');
  
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@/components": path.resolve(__dirname, "./client/src/components"),
      "@/lib": path.resolve(__dirname, "./client/src/lib"),
      "@/hooks": path.resolve(__dirname, "./client/src/hooks"),
      "@/pages": path.resolve(__dirname, "./client/src/pages"),
      "@/contexts": path.resolve(__dirname, "./client/src/contexts"),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})`;

  fs.writeFileSync(path.join(exportDir, 'vite.config.ts'), viteConfig);
  console.log('   ✅ Vite config created');

  // Create README for the frontend export
  console.log('5. Creating documentation...');
  
  const readme = `# Ko Lake Villa - Frontend Export

This is the frontend codebase for Ko Lake Villa, exported from the main Replit project.

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## 📁 Project Structure

\`\`\`
frontend-export/
├── client/                 # Main React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── contexts/     # React contexts
├── components/           # Shared components
├── shared/              # Shared types and schemas
└── package.json         # Frontend dependencies
\`\`\`

## 🎨 Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/UI** for component library
- **React Query** for state management
- **Firebase** for authentication
- **Framer Motion** for animations

## 🔧 Configuration

The project uses:
- Tailwind CSS with custom theme
- TypeScript with strict mode
- ESLint for code quality
- Prettier for formatting

## 🌐 Deployment

This frontend is designed to work with:
- Vercel (recommended)
- Netlify
- Any static hosting service

## 📝 Notes

- Backend API integration points are in \`client/src/lib/\`
- Authentication is handled via Firebase
- All UI components follow Shadcn/UI patterns
- Responsive design with mobile-first approach

## 🔗 Original Project

This frontend was exported from the complete Ko Lake Villa project on Replit.
`;

  fs.writeFileSync(path.join(exportDir, 'README.md'), readme);
  console.log('   ✅ README.md created');

  // Create .env.example
  const envExample = `# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Base URL
VITE_API_BASE_URL=http://localhost:5000

# OpenAI (for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key
`;

  fs.writeFileSync(path.join(exportDir, '.env.example'), envExample);
  console.log('   ✅ .env.example created');

  // Create .gitignore
  const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Temporary folders
tmp/
temp/
`;

  fs.writeFileSync(path.join(exportDir, '.gitignore'), gitignore);
  console.log('   ✅ .gitignore created');

  console.log('6. Creating archive...');
  
  // Create zip file
  execSync(`cd "${exportDir}" && zip -r ../ko-lake-villa-frontend.zip .`, { stdio: 'inherit' });
  console.log('   ✅ Archive created: ko-lake-villa-frontend.zip');

  console.log('\n🎉 FRONTEND EXPORT COMPLETE!');
  console.log('=====================================');
  console.log('✅ Frontend source code extracted');
  console.log('✅ Dependencies configured');
  console.log('✅ Build configuration ready');
  console.log('✅ Documentation created');
  console.log('\n📦 Files created:');
  console.log('• frontend-export/ - Complete frontend package');
  console.log('• ko-lake-villa-frontend.zip - Ready for external use');
  console.log('\n🚀 Next Steps:');
  console.log('1. Extract ko-lake-villa-frontend.zip');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run dev');
  console.log('4. Configure environment variables');
  console.log('\n💡 Recommendation:');
  console.log('Consider using Replit\'s excellent deployment features instead!');
  console.log('Replit offers seamless hosting with zero configuration needed.');

} catch (error) {
  console.error('❌ Export failed:', error.message);
  process.exit(1);
}
