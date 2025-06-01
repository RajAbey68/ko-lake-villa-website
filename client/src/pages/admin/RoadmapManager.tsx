
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GitBranch, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus,
  Edit,
  Eye,
  Target,
  Calendar,
  Users,
  Code,
  Zap,
  Bug,
  Star,
  GitCommit,
  Download,
  ExternalLink
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'feature' | 'bug' | 'improvement' | 'technical-debt';
  status: 'backlog' | 'in-progress' | 'testing' | 'completed';
  assignee?: string;
  estimatedHours?: number;
  completedHours?: number;
  dueDate?: string;
  tags: string[];
  releaseVersion?: string;
}

interface Release {
  version: string;
  name: string;
  status: 'planning' | 'development' | 'testing' | 'released';
  releaseDate?: string;
  items: string[];
  notes: string;
  gitCommit?: string;
  deploymentUrl?: string;
}

const RoadmapManager: React.FC = () => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingRelease, setIsAddingRelease] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [activeTab, setActiveTab] = useState('kanban');

  // Initialize with current backlog
  useEffect(() => {
    const initialItems: RoadmapItem[] = [
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
    ];

    const initialReleases: Release[] = [
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
    ];

    setRoadmapItems(initialItems);
    setReleases(initialReleases);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'testing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'backlog': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <Star className="h-4 w-4" />;
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'improvement': return <Zap className="h-4 w-4" />;
      case 'technical-debt': return <Code className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getItemsByStatus = (status: string) => {
    return roadmapItems.filter(item => item.status === status);
  };

  const calculateProgress = (item: RoadmapItem) => {
    if (!item.estimatedHours) return 0;
    const completed = item.completedHours || 0;
    return Math.min((completed / item.estimatedHours) * 100, 100);
  };

  const exportToMarkdown = () => {
    const markdown = `# Ko Lake Villa - Project Roadmap & Release Management

*Last Updated: ${new Date().toISOString().split('T')[0]}*

## 🎯 Current Release Status

${releases.map(release => `
### ${release.version} - ${release.name}
- **Status**: ${release.status.toUpperCase()}
- **Target Date**: ${release.releaseDate || 'TBD'}
- **Items**: ${release.items.length} features/fixes
${release.deploymentUrl ? `- **Live URL**: ${release.deploymentUrl}` : ''}
${release.gitCommit ? `- **Git Commit**: \`${release.gitCommit}\`` : ''}

${release.notes}
`).join('')}

## 📋 Roadmap Items by Priority

### 🔥 High Priority
${roadmapItems.filter(item => item.priority === 'high').map(item => `
- **${item.title}** (${item.status})
  - ${item.description}
  - Category: ${item.category}
  - Estimated: ${item.estimatedHours || 'TBD'}h
  - Release: ${item.releaseVersion || 'TBD'}
  - Tags: ${item.tags.join(', ')}
`).join('')}

### ⚠️ Medium Priority
${roadmapItems.filter(item => item.priority === 'medium').map(item => `
- **${item.title}** (${item.status})
  - ${item.description}
  - Category: ${item.category}
  - Estimated: ${item.estimatedHours || 'TBD'}h
  - Release: ${item.releaseVersion || 'TBD'}
  - Tags: ${item.tags.join(', ')}
`).join('')}

### 💤 Low Priority
${roadmapItems.filter(item => item.priority === 'low').map(item => `
- **${item.title}** (${item.status})
  - ${item.description}
  - Category: ${item.category}
  - Estimated: ${item.estimatedHours || 'TBD'}h
  - Release: ${item.releaseVersion || 'TBD'}
  - Tags: ${item.tags.join(', ')}
`).join('')}

## 📊 Progress Summary

- **Total Items**: ${roadmapItems.length}
- **Completed**: ${roadmapItems.filter(item => item.status === 'completed').length}
- **In Progress**: ${roadmapItems.filter(item => item.status === 'in-progress').length}
- **Backlog**: ${roadmapItems.filter(item => item.status === 'backlog').length}

## 🔗 Repository Links

- **Live Application**: https://ko-lake-villa.replit.app
- **GitHub Repository**: https://github.com/your-username/ko-lake-villa *(Read-only for code review)*
- **Admin Dashboard**: https://ko-lake-villa.replit.app/admin

---
*Generated automatically from Ko Lake Villa Admin Console*`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ROADMAP.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Roadmap & Releases</h1>
          <p className="text-gray-600 mt-2">Ko Lake Villa Development Management</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToMarkdown} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Markdown
          </Button>
          <Button 
            onClick={() => window.open('https://github.com/your-username/ko-lake-villa', '_blank')}
            variant="outline" 
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            GitHub (Read-only)
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{roadmapItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {roadmapItems.filter(item => item.status === 'completed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {roadmapItems.filter(item => item.status === 'in-progress').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <GitBranch className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Releases</p>
              <p className="text-2xl font-bold text-gray-900">{releases.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="releases">Release Management</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        {/* Kanban Board */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Development Board</h2>
            <Button onClick={() => setIsAddingItem(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['backlog', 'in-progress', 'testing', 'completed'].map((status) => (
              <div key={status} className="space-y-3">
                <h3 className="font-medium text-gray-900 capitalize flex items-center">
                  {status === 'backlog' && <AlertCircle className="h-4 w-4 mr-2" />}
                  {status === 'in-progress' && <Clock className="h-4 w-4 mr-2" />}
                  {status === 'testing' && <Eye className="h-4 w-4 mr-2" />}
                  {status === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
                  {status.replace('-', ' ')} ({getItemsByStatus(status).length})
                </h3>
                
                <div className="space-y-3">
                  {getItemsByStatus(status).map((item) => (
                    <Card 
                      key={item.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            {getCategoryIcon(item.category)}
                            <h4 className="font-medium text-sm ml-2">{item.title}</h4>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                        
                        {item.estimatedHours && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{item.completedHours || 0}h / {item.estimatedHours}h</span>
                            </div>
                            <Progress value={calculateProgress(item)} className="h-1" />
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Release Management */}
        <TabsContent value="releases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Release Pipeline</h2>
            <Button onClick={() => setIsAddingRelease(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Plan Release
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {releases.map((release) => (
              <Card key={release.version}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <GitCommit className="h-5 w-5 mr-2" />
                        {release.version}
                      </CardTitle>
                      <CardDescription>{release.name}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(release.status)}>
                      {release.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Target Date:</span>
                      <p className="font-medium">{release.releaseDate || 'TBD'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <p className="font-medium">{release.items.length} features</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{release.notes}</p>
                  
                  {release.deploymentUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(release.deploymentUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timeline View */}
        <TabsContent value="timeline" className="space-y-4">
          <h2 className="text-xl font-semibold">Development Timeline</h2>
          
          <div className="space-y-4">
            {releases.map((release, index) => (
              <div key={release.version} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-4 h-4 rounded-full ${
                    release.status === 'released' ? 'bg-green-500' : 
                    release.status === 'development' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  {index < releases.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
                </div>
                
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{release.version} - {release.name}</h3>
                      <Badge className={getStatusColor(release.status)}>
                        {release.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{release.notes}</p>
                    <div className="text-xs text-gray-500">
                      Target: {release.releaseDate || 'TBD'} • {release.items.length} items
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Item Detail Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {getCategoryIcon(selectedItem.category)}
                <span className="ml-2">{selectedItem.title}</span>
              </DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Badge className={getPriorityColor(selectedItem.priority)}>
                  {selectedItem.priority}
                </Badge>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedItem.status)}>
                  {selectedItem.status}
                </Badge>
              </div>
              <div>
                <Label>Category</Label>
                <p className="capitalize">{selectedItem.category.replace('-', ' ')}</p>
              </div>
              <div>
                <Label>Release Version</Label>
                <p>{selectedItem.releaseVersion || 'TBD'}</p>
              </div>
            </div>
            
            {selectedItem.estimatedHours && (
              <div>
                <Label>Progress</Label>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion</span>
                    <span>{selectedItem.completedHours || 0}h / {selectedItem.estimatedHours}h</span>
                  </div>
                  <Progress value={calculateProgress(selectedItem)} />
                </div>
              </div>
            )}
            
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoadmapManager;
