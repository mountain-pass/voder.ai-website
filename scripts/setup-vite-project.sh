#!/bin/bash

# Vite + TypeScript Setup Script for Voder.ai Website
# Run this script to create a new project structure

echo "🚀 Setting up Vite + TypeScript project..."

# Create new Vite project
npm create vite@latest voder-website-vite -- --template vanilla-ts
cd voder-website-vite

echo "📦 Installing dependencies..."

# Install core dependencies
npm install gsap three @types/three

# Install development dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint vite-plugin-eslint
npm install -D @axe-core/playwright playwright

echo "📁 Creating project structure..."

# Create directory structure
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/assets
mkdir -p public/fonts

echo "⚙️ Setting up configuration files..."

# Create TypeScript config
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
EOF

# Create ESLint config
cat > eslint.config.js << EOF
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules
    }
  }
];
EOF

# Create Prettier config
cat > .prettierrc.json << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

# Update package.json scripts
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="tsc && vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.lint="eslint . --ext ts,js"
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.test="playwright test"

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd voder-website-vite"
echo "2. Copy your assets from the old project"
echo "3. npm run dev"
echo ""
echo "Your new project is ready for development! 🎉"
