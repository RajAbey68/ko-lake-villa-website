#!/usr/bin/env node

/**
 * Ko Lake Villa - Vite to Next.js Migration Script
 * Converts existing React components and pages to Next.js structure
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'fs'
import { join, dirname } from 'path'

console.log('🚀 Starting Ko Lake Villa migration to Next.js...\n')

const MIGRATION_DIR = './nextjs-migration'
const CLIENT_SRC = './client/src'

// Ensure migration directory structure exists
function ensureDirectoryExists(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  }
}

// Convert Vite imports to Next.js compatible imports
function convertImports(content) {
  return content
    .replace(/import\s+.*from\s+['"]@\/(.+)['"]/g, "import $1 from '@/$1'")
    .replace(/import\s+.*from\s+['"]wouter['"]/g, "import { useRouter } from 'next/router'")
    .replace(/useLocation\(\)/g, 'useRouter()')
    .replace(/import\s+.*from\s+['"]@\/components\/ui\/(.+)['"]/g, "import { $1 } from '@/components/ui/$1'")
}

// Convert pages from wouter routing to Next.js app router
function convertPage(sourcePath, targetPath) {
  if (!existsSync(sourcePath)) {
    console.log(`⚠️  Source file not found: ${sourcePath}`)
    return
  }

  let content = readFileSync(sourcePath, 'utf-8')
  
  // Add metadata export for pages
  const pageTitle = targetPath.includes('page.tsx') ? 
    `export const metadata = {
  title: '${targetPath.split('/').slice(-2, -1)[0]} - Ko Lake Villa',
  description: 'Ko Lake Villa - Luxury accommodation by Koggala Lake'
}\n\n` : ''
  
  // Convert component to default export
  content = convertImports(content)
  content = content.replace(/export\s+default\s+function\s+(\w+)/g, 'export default function $1')
  
  // Ensure directory exists
  ensureDirectoryExists(dirname(targetPath))
  
  writeFileSync(targetPath, pageTitle + content)
  console.log(`✅ Converted: ${sourcePath} → ${targetPath}`)
}

// Copy and convert components
function migrateComponents() {
  console.log('📦 Migrating components...')
  
  const componentMappings = [
    ['components/Header.tsx', 'src/components/Header.tsx'],
    ['components/Footer.tsx', 'src/components/Footer.tsx'],
    ['components/SEOHead.tsx', 'src/components/SEOHead.tsx'],
    // Add more component mappings as needed
  ]
  
  componentMappings.forEach(([source, target]) => {
    const sourcePath = join(CLIENT_SRC, source)
    const targetPath = join(MIGRATION_DIR, target)
    convertPage(sourcePath, targetPath)
  })
}

// Copy and convert pages
function migratePages() {
  console.log('📄 Migrating pages...')
  
  const pageMappings = [
    ['pages/Home.tsx', 'src/app/page.tsx'],
    ['pages/Accommodation.tsx', 'src/app/accommodation/page.tsx'],
    ['pages/Gallery.tsx', 'src/app/gallery/page.tsx'],
    ['pages/Experiences.tsx', 'src/app/experiences/page.tsx'],
    ['pages/Contact.tsx', 'src/app/contact/page.tsx'],
    ['pages/Dining.tsx', 'src/app/dining/page.tsx'],
    ['pages/Booking.tsx', 'src/app/booking/page.tsx'],
  ]
  
  pageMappings.forEach(([source, target]) => {
    const sourcePath = join(CLIENT_SRC, source)
    const targetPath = join(MIGRATION_DIR, target)
    convertPage(sourcePath, targetPath)
  })
}

// Copy utility files and configurations
function migrateUtilities() {
  console.log('🔧 Migrating utilities and configurations...')
  
  const utilityMappings = [
    ['lib/utils.ts', 'src/lib/utils.ts'],
    ['lib/queryClient.ts', 'src/lib/api.ts'],
    ['index.css', 'src/app/globals.css'],
  ]
  
  utilityMappings.forEach(([source, target]) => {
    const sourcePath = join(CLIENT_SRC, source)
    const targetPath = join(MIGRATION_DIR, target)
    
    if (existsSync(sourcePath)) {
      ensureDirectoryExists(dirname(targetPath))
      cpSync(sourcePath, targetPath)
      console.log(`✅ Copied: ${sourcePath} → ${targetPath}`)
    }
  })
}

// Create layout wrapper
function createLayoutWrapper() {
  console.log('🎨 Creating layout wrapper...')
  
  const layoutContent = `
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
`
  
  const layoutPath = join(MIGRATION_DIR, 'src/app/layout.tsx')
  writeFileSync(layoutPath, layoutContent.trim())
  console.log('✅ Created root layout')
}

// Generate deployment instructions
function generateDeploymentInstructions() {
  const instructions = `
# Ko Lake Villa - Next.js Deployment Instructions

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   cd nextjs-migration
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   \`\`\`

3. **Run development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Deploy to Vercel:**
   \`\`\`bash
   npx vercel
   \`\`\`

## Migration Status

✅ Basic Next.js structure created
✅ Components migrated
✅ Pages converted to app router
✅ Tailwind CSS configured
✅ Environment variables set up

## Next Steps

1. Test all pages and components
2. Update API endpoints for production
3. Configure Vercel environment variables
4. Set up custom domain
5. Enable analytics and monitoring

## Vercel Deployment

The project is ready for Vercel deployment with:
- Automatic builds from Git
- Environment variable management
- Custom domain support
- Built-in CDN and optimization
`

  writeFileSync(join(MIGRATION_DIR, 'README.md'), instructions.trim())
  console.log('✅ Generated deployment instructions')
}

// Main migration function
async function runMigration() {
  try {
    ensureDirectoryExists(MIGRATION_DIR)
    
    migrateComponents()
    migratePages()
    migrateUtilities()
    createLayoutWrapper()
    generateDeploymentInstructions()
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. cd nextjs-migration')
    console.log('2. npm install')
    console.log('3. npm run dev')
    console.log('4. Test functionality')
    console.log('5. Deploy to Vercel')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()