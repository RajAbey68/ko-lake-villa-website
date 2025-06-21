
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useToast } from '../../hooks/use-toast';
import { 
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  BugIcon,
  TrendingUpIcon,
  DownloadIcon,
  GitBranchIcon,
  TagIcon,
  CalendarIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
  RefreshCwIcon
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  category: 'feature' | 'bug' | 'enhancement' | 'technical-debt';
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  completedAt?: string;
  tags: string[];
}

interface Release {
  version: string;
  date: string;
  status: 'planned' | 'in-progress' | 'released';
  items: string[];
  notes?: string;
}

export default function ProjectRoadmap() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('kanban');
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with current backlog data
  useEffect(() => {
    const initialItems: RoadmapItem[] = [
      // High Priority
      {
        id: 'fix-react-warning',
        title: 'Fix React SelectItem Warning',
        description: 'Update select component implementation in gallery management',
        priority: 'high',
        status: 'todo',
        category: 'bug',
        estimatedHours: 2,
        tags: ['frontend', 'react', 'gallery']
      },
      {
        id: 'ai-upload-testing',
        title: 'Complete AI Upload Testing',
        description: 'Validate OpenAI integration functionality and test all 11 gallery categories',
        priority: 'high',
        status: 'in-progress',
        category: 'feature',
        estimatedHours: 8,
        tags: ['ai', 'testing', 'gallery']
      },
      {
        id: 'booking-enhancement',
        title: 'Booking System Enhancement',
        description: 'Real-time availability calendar integration and automated confirmation emails',
        priority: 'high',
        status: 'todo',
        category: 'feature',
        estimatedHours: 24,
        tags: ['booking', 'calendar', 'automation']
      },
      
      // Medium Priority
      {
        id: 'seo-optimization',
        title: 'SEO Optimization',
        description: 'Meta tags optimization, schema markup, and Core Web Vitals improvements',
        priority: 'medium',
        status: 'todo',
        category: 'enhancement',
        estimatedHours: 16,
        tags: ['seo', 'performance', 'marketing']
      },
      {
        id: 'cms-expansion',
        title: 'Content Management Expansion',
        description: 'Rich text editor improvements and media library organization',
        priority: 'medium',
        status: 'in-progress',
        category: 'feature',
        estimatedHours: 12,
        tags: ['cms', 'admin', 'content']
      },
      {
        id: 'analytics-enhancement',
        title: 'Analytics Enhancement',
        description: 'Custom event tracking and admin reporting dashboard',
        priority: 'medium',
        status: 'todo',
        category: 'feature',
        estimatedHours: 10,
        tags: ['analytics', 'reporting', 'admin']
      },
      
      // Low Priority
      {
        id: 'multi-language',
        title: 'Multi-language Support',
        description: 'English/Sinhala language support with dynamic translation system',
        priority: 'low',
        status: 'todo',
        category: 'feature',
        estimatedHours: 20,
        tags: ['i18n', 'localization']
      },
      {
        id: 'mobile-app-planning',
        title: 'Mobile App Planning',
        description: 'React Native evaluation and development timeline planning',
        priority: 'low',
        status: 'todo',
        category: 'feature',
        estimatedHours: 40,
        tags: ['mobile', 'planning', 'react-native']
      },
      
      // Technical Debt
      {
        id: 'gallery-consistency',
        title: 'Gallery Tag-Category Consistency',
        description: 'Ensure all existing images have consistent metadata',
        priority: 'medium',
        status: 'done',
        category: 'technical-debt',
        estimatedHours: 4,
        completedAt: '2025-05-30',
        tags: ['gallery', 'data-integrity']
      },
      {
        id: 'error-handling',
        title: 'Error Handling Improvements',
        description: 'Better validation error messages and comprehensive error logging',
        priority: 'medium',
        status: 'in-progress',
        category: 'technical-debt',
        estimatedHours: 8,
        tags: ['error-handling', 'logging', 'ux']
      },
      {
        id: 'performance-optimization',
        title: 'Performance Optimization',
        description: 'Image lazy loading, CDN optimization, and database query optimization',
        priority: 'medium',
        status: 'todo',
        category: 'technical-debt',
        estimatedHours: 16,
        tags: ['performance', 'optimization', 'database']
      }
    ];

    const initialReleases: Release[] = [
      {
        version: 'v1.0.0',
        date: '2025-05-30',
        status: 'released',
        items: ['gallery-consistency'],
        notes: 'Initial production release with enhanced CMS and gallery management'
      },
      {
        version: 'v1.1.0',
        date: '2025-06-15',
        status: 'in-progress',
        items: ['fix-react-warning', 'ai-upload-testing', 'error-handling'],
        notes: 'Bug fixes and AI integration completion'
      },
      {
        version: 'v1.2.0',
        date: '2025-07-01',
        status: 'planned',
        items: ['booking-enhancement', 'cms-expansion'],
        notes: 'Major booking system upgrade and CMS improvements'
      },
      {
        version: 'v2.0.0',
        date: '2025-08-01',
        status: 'planned',
        items: ['seo-optimization', 'analytics-enhancement', 'performance-optimization'],
        notes: 'Performance and analytics overhaul with microservices migration'
      }
    ];

    setRoadmapItems(initialItems);
    setReleases(initialReleases);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <TrendingUpIcon className="h-4 w-4" />;
      case 'bug': return <BugIcon className="h-4 w-4" />;
      case 'enhancement': return <CheckCircleIcon className="h-4 w-4" />;
      case 'technical-debt': return <AlertTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const exportToMarkdown = () => {
    setLoading(true);
    
    const markdown = `# Ko Lake Villa - Project Roadmap
Generated: ${new Date().toISOString()}

## Project Status Overview

### High Priority Items
${roadmapItems.filter(item => item.priority === 'high').map(item => 
  `- **${item.title}** (${item.status})\n  ${item.description}\n  Tags: ${item.tags.join(', ')}\n`
).join('\n')}

### Medium Priority Items
${roadmapItems.filter(item => item.priority === 'medium').map(item => 
  `- **${item.title}** (${item.status})\n  ${item.description}\n  Tags: ${item.tags.join(', ')}\n`
).join('\n')}

### Low Priority Items
${roadmapItems.filter(item => item.priority === 'low').map(item => 
  `- **${item.title}** (${item.status})\n  ${item.description}\n  Tags: ${item.tags.join(', ')}\n`
).join('\n')}

### Technical Debt
${roadmapItems.filter(item => item.category === 'technical-debt').map(item => 
  `- **${item.title}** (${item.status})\n  ${item.description}\n  Tags: ${item.tags.join(', ')}\n`
).join('\n')}

## Release Timeline

${releases.map(release => 
  `### ${release.version} - ${release.date} (${release.status})
${release.notes || 'No notes'}

**Included Items:**
${release.items.map(itemId => {
  const item = roadmapItems.find(i => i.id === itemId);
  return `- ${item?.title || itemId}`;
}).join('\n')}
`
).join('\n')}

## Progress Metrics
- Total Items: ${roadmapItems.length}
- Completed: ${roadmapItems.filter(item => item.status === 'done').length}
- In Progress: ${roadmapItems.filter(item => item.status === 'in-progress').length}
- Todo: ${roadmapItems.filter(item => item.status === 'todo').length}
- Blocked: ${roadmapItems.filter(item => item.status === 'blocked').length}

---
*This roadmap is automatically generated from the Ko Lake Villa project management system.*
`;

    // Create downloadable file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ko-lake-villa-roadmap-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setLoading(false);
    toast({
      title: "Roadmap Exported",
      description: "Markdown file has been downloaded to your device.",
    });
  };

  const getProgressPercentage = () => {
    const completed = roadmapItems.filter(item => item.status === 'done').length;
    return Math.round((completed / roadmapItems.length) * 100);
  };

  const filterItemsByStatus = (status: string) => {
    return roadmapItems.filter(item => item.status === status);
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#8B5E3C] flex items-center gap-2">
                <BarChart3Icon className="h-8 w-8" />
                Project Roadmap & Release Management
              </h1>
              <p className="text-[#8B5E3C]/70 mt-2">
                Track development progress, manage releases, and plan future features
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={exportToMarkdown}
                disabled={loading}
                className="bg-[#FF914D] hover:bg-[#e67e3d]"
              >
                {loading ? (
                  <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <DownloadIcon className="h-4 w-4 mr-2" />
                )}
                Export Markdown
              </Button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                    <p className="text-2xl font-bold text-[#8B5E3C]">{getProgressPercentage()}%</p>
                  </div>
                  <Progress value={getProgressPercentage()} className="w-16" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-[#8B5E3C]">{roadmapItems.length}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{roadmapItems.filter(item => item.status === 'done').length}</p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{roadmapItems.filter(item => item.status === 'in-progress').length}</p>
                  </div>
                  <RefreshCwIcon className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="releases">Release Management</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Todo Column */}
              <div>
                <h3 className="font-semibold text-[#8B5E3C] mb-4 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Todo ({filterItemsByStatus('todo').length})
                </h3>
                <div className="space-y-3">
                  {filterItemsByStatus('todo').map(item => (
                    <Card key={item.id} className="border-l-4 border-l-gray-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          {getCategoryIcon(item.category)}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          {item.estimatedHours && (
                            <Badge variant="outline" className="text-xs">
                              {item.estimatedHours}h
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div>
                <h3 className="font-semibold text-[#8B5E3C] mb-4 flex items-center gap-2">
                  <RefreshCwIcon className="h-5 w-5" />
                  In Progress ({filterItemsByStatus('in-progress').length})
                </h3>
                <div className="space-y-3">
                  {filterItemsByStatus('in-progress').map(item => (
                    <Card key={item.id} className="border-l-4 border-l-blue-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          {getCategoryIcon(item.category)}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          {item.estimatedHours && (
                            <Badge variant="outline" className="text-xs">
                              {item.estimatedHours}h
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Blocked Column */}
              <div>
                <h3 className="font-semibold text-[#8B5E3C] mb-4 flex items-center gap-2">
                  <AlertTriangleIcon className="h-5 w-5" />
                  Blocked ({filterItemsByStatus('blocked').length})
                </h3>
                <div className="space-y-3">
                  {filterItemsByStatus('blocked').map(item => (
                    <Card key={item.id} className="border-l-4 border-l-red-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          {getCategoryIcon(item.category)}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          {item.estimatedHours && (
                            <Badge variant="outline" className="text-xs">
                              {item.estimatedHours}h
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Done Column */}
              <div>
                <h3 className="font-semibold text-[#8B5E3C] mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Done ({filterItemsByStatus('done').length})
                </h3>
                <div className="space-y-3">
                  {filterItemsByStatus('done').map(item => (
                    <Card key={item.id} className="border-l-4 border-l-green-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          {getCategoryIcon(item.category)}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          {item.completedAt && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              ✓ {item.completedAt}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="releases" className="space-y-6">
            <div className="grid gap-6">
              {releases.map(release => (
                <Card key={release.version}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TagIcon className="h-6 w-6 text-[#FF914D]" />
                        <div>
                          <CardTitle className="text-xl">{release.version}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {release.date}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          release.status === 'released' ? 'bg-green-100 text-green-800 border-green-200' :
                          release.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }
                      >
                        {release.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {release.notes && (
                      <p className="text-gray-600 mb-4">{release.notes}</p>
                    )}
                    <h4 className="font-medium mb-2">Included Items:</h4>
                    <div className="grid gap-2">
                      {release.items.map(itemId => {
                        const item = roadmapItems.find(i => i.id === itemId);
                        if (!item) return null;
                        return (
                          <div key={itemId} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            {getCategoryIcon(item.category)}
                            <span className="font-medium">{item.title}</span>
                            <Badge variant="outline" className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-4">
              {releases.map((release, index) => (
                <div key={release.version} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      release.status === 'released' ? 'bg-green-500' :
                      release.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`} />
                    {index < releases.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[#8B5E3C]">{release.version}</h3>
                        <span className="text-sm text-gray-500">{release.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{release.notes}</p>
                      <div className="flex flex-wrap gap-1">
                        {release.items.map(itemId => {
                          const item = roadmapItems.find(i => i.id === itemId);
                          return item ? (
                            <Badge key={itemId} variant="secondary" className="text-xs">
                              {item.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
