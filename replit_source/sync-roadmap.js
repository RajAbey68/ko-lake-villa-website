
#!/usr/bin/env node

/**
 * Ko Lake Villa - Roadmap Sync Script
 * Keeps the Git-tracked ROADMAP.md in sync with the admin dashboard
 */

const fs = require('fs');
const path = require('path');

// Default roadmap data structure
const defaultRoadmapData = {
  items: [
    {
      id: '1',
      title: 'Fix React SelectItem Warning',
      description: 'Update select component implementation in gallery management for browser compatibility',
      priority: 'high',
      category: 'bug',
      status: 'backlog',
      estimatedHours: 4,
      tags: ['react', 'gallery', 'ui'],
      releaseVersion: 'v1.1.0'
    },
    {
      id: '2',
      title: 'Complete AI Upload Testing',
      description: 'Validate OpenAI integration functionality and test all 11 gallery categories',
      priority: 'high',
      category: 'feature',
      status: 'in-progress',
      estimatedHours: 16,
      completedHours: 8,
      tags: ['ai', 'openai', 'testing'],
      releaseVersion: 'v1.1.0'
    },
    {
      id: '3',
      title: 'Booking System Enhancement',
      description: 'Real-time availability calendar integration and automated confirmation emails',
      priority: 'high',
      category: 'feature',
      status: 'backlog',
      estimatedHours: 32,
      tags: ['booking', 'calendar', 'email'],
      releaseVersion: 'v1.2.0'
    },
    {
      id: '4',
      title: 'SEO Optimization',
      description: 'Meta tags optimization, schema markup, and Core Web Vitals improvements',
      priority: 'medium',
      category: 'improvement',
      status: 'backlog',
      estimatedHours: 20,
      tags: ['seo', 'performance', 'marketing'],
      releaseVersion: 'v1.1.0'
    },
    {
      id: '5',
      title: 'Multi-language Support',
      description: 'English/Sinhala language support with dynamic content translation',
      priority: 'low',
      category: 'feature',
      status: 'backlog',
      estimatedHours: 40,
      tags: ['i18n', 'translation', 'localization'],
      releaseVersion: 'v2.0.0'
    },
    {
      id: '6',
      title: 'Performance Optimization',
      description: 'Image lazy loading, CDN optimization, and database query improvements',
      priority: 'medium',
      category: 'technical-debt',
      status: 'backlog',
      estimatedHours: 24,
      tags: ['performance', 'optimization', 'database'],
      releaseVersion: 'v1.2.0'
    }
  ],
  releases: [
    {
      version: 'v1.0.0',
      name: 'Stable Baseline',
      status: 'released',
      releaseDate: '2025-01-30',
      items: [],
      notes: 'Initial stable release with core functionality: Gallery management, Admin dashboard, AI integration baseline, Booking system foundation',
      gitCommit: 'baseline-v1.0',
      deploymentUrl: 'https://ko-lake-villa.replit.app'
    },
    {
      version: 'v1.1.0',
      name: 'Gallery & AI Enhancements',
      status: 'development',
      releaseDate: '2025-02-15',
      items: ['1', '2', '4'],
      notes: 'Focus on gallery stability, AI testing completion, and SEO improvements'
    },
    {
      version: 'v1.2.0',
      name: 'Booking System Upgrade',
      status: 'planning',
      releaseDate: '2025-03-15',
      items: ['3', '6'],
      notes: 'Enhanced booking functionality with real-time availability and performance optimizations'
    },
    {
      version: 'v2.0.0',
      name: 'Microservices Architecture',
      status: 'planning',
      releaseDate: '2025-06-01',
      items: ['5'],
      notes: 'Major architectural upgrade to microservices with multi-language support'
    }
  ]
};

/**
 * Generate markdown content from roadmap data
 */
function generateMarkdown(data) {
  const today = new Date().toISOString().split('T')[0];
  
  let markdown = `# Ko Lake Villa - Project Roadmap & Release Management

*Last Updated: ${today}*

## 🎯 Current Release Status

`;

  // Add releases
  data.releases.forEach(release => {
    markdown += `### ${release.version} - ${release.name}
- **Status**: ${release.status.toUpperCase()}
- **Target Date**: ${release.releaseDate || 'TBD'}
- **Items**: ${release.items.length} features/fixes
${release.deploymentUrl ? `- **Live URL**: ${release.deploymentUrl}\n` : ''}${release.gitCommit ? `- **Git Commit**: \`${release.gitCommit}\`\n` : ''}
${release.notes}

`;
  });

  markdown += `## 📋 Roadmap Items by Priority

`;

  // Add items by priority
  ['high', 'medium', 'low'].forEach(priority => {
    const priorityItems = data.items.filter(item => item.priority === priority);
    const priorityIcon = priority === 'high' ? '🔥' : priority === 'medium' ? '⚠️' : '💤';
    
    markdown += `### ${priorityIcon} ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority

`;
    
    priorityItems.forEach(item => {
      markdown += `- **${item.title}** (${item.status})
  - ${item.description}
  - Category: ${item.category}
  - Estimated: ${item.estimatedHours || 'TBD'}h
  - Release: ${item.releaseVersion || 'TBD'}
  - Tags: ${item.tags.join(', ')}

`;
    });
  });

  // Add progress summary
  const totalItems = data.items.length;
  const completedItems = data.items.filter(item => item.status === 'completed').length;
  const inProgressItems = data.items.filter(item => item.status === 'in-progress').length;
  const backlogItems = data.items.filter(item => item.status === 'backlog').length;

  markdown += `## 📊 Progress Summary

- **Total Items**: ${totalItems}
- **Completed**: ${completedItems}
- **In Progress**: ${inProgressItems}
- **Backlog**: ${backlogItems}

## 🔗 Repository Links

- **Live Application**: https://ko-lake-villa.replit.app
- **GitHub Repository**: https://github.com/your-username/ko-lake-villa *(Read-only for code review)*
- **Admin Dashboard**: https://ko-lake-villa.replit.app/admin

---
*Generated automatically from Ko Lake Villa Admin Console*`;

  return markdown;
}

/**
 * Update the roadmap markdown file
 */
function updateRoadmapFile() {
  try {
    // Ensure docs directory exists
    const docsDir = path.join(__dirname, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Generate and write markdown
    const markdownContent = generateMarkdown(defaultRoadmapData);
    const roadmapPath = path.join(docsDir, 'ROADMAP.md');
    
    fs.writeFileSync(roadmapPath, markdownContent, 'utf8');
    
    console.log(`✅ Roadmap updated successfully: ${roadmapPath}`);
    console.log(`📊 Summary: ${defaultRoadmapData.items.length} items, ${defaultRoadmapData.releases.length} releases`);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating roadmap:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  console.log('🚀 Ko Lake Villa - Roadmap Sync');
  console.log('====================================');
  
  const success = updateRoadmapFile();
  process.exit(success ? 0 : 1);
}

module.exports = {
  updateRoadmapFile,
  generateMarkdown,
  defaultRoadmapData
};
