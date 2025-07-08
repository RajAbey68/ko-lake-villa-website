
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  PlayCircleIcon,
  GitBranchIcon,
  TrendingUpIcon,
  CalendarIcon,
  UsersIcon,
  CodeIcon,
  ZapIcon,
  BugIcon,
  RocketIcon
} from 'lucide-react';

interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'dev' | 'testing' | 'feature' | 'marketing' | 'admin' | 'data' | 'i18n' | 'future' | 'technical-debt';
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  estimatedDays?: number;
  assignee?: string;
  dependencies?: string[];
  githubIssue?: string;
}

const ROADMAP_DATA: BacklogItem[] = [
  // High Priority
  {
    id: 'fix-react-warning',
    title: 'Fix React SelectItem Warning',
    description: 'Update select component implementation in gallery management and test across browsers for compatibility',
    priority: 'high',
    category: 'dev',
    status: 'not-started',
    progress: 0,
    estimatedDays: 1,
    assignee: 'Dev Team'
  },
  {
    id: 'ai-upload-testing',
    title: 'Complete AI Upload Testing',
    description: 'Validate OpenAI integration functionality, test all 11 gallery categories with AI categorization, performance optimization for image analysis',
    priority: 'high',
    category: 'testing',
    status: 'in-progress',
    progress: 65,
    estimatedDays: 3,
    assignee: 'QA Team'
  },
  {
    id: 'booking-enhancement',
    title: 'Booking System Enhancement',
    description: 'Real-time availability calendar integration, automated confirmation emails, payment processing activation (Stripe configured but not active)',
    priority: 'high',
    category: 'feature',
    status: 'not-started',
    progress: 0,
    estimatedDays: 7,
    assignee: 'Backend Team'
  },
  
  // Medium Priority
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'Meta tags optimization across all pages, schema markup implementation, site speed improvements and Core Web Vitals',
    priority: 'medium',
    category: 'marketing',
    status: 'not-started',
    progress: 0,
    estimatedDays: 4,
    assignee: 'Marketing Team'
  },
  {
    id: 'cms-expansion',
    title: 'Content Management Expansion',
    description: 'Rich text editor improvements, media library organization enhancements, version control for content changes',
    priority: 'medium',
    category: 'admin',
    status: 'not-started',
    progress: 0,
    estimatedDays: 5,
    assignee: 'Frontend Team'
  },
  {
    id: 'analytics-enhancement',
    title: 'Analytics Enhancement',
    description: 'Custom event tracking beyond basic Google Analytics, conversion funnels setup, admin reporting dashboard with detailed insights',
    priority: 'medium',
    category: 'data',
    status: 'not-started',
    progress: 0,
    estimatedDays: 6,
    assignee: 'Data Team'
  },
  
  // Low Priority
  {
    id: 'multi-language',
    title: 'Multi-language Support',
    description: 'English/Sinhala language support, dynamic content translation system, language switcher UI implementation',
    priority: 'low',
    category: 'i18n',
    status: 'not-started',
    progress: 0,
    estimatedDays: 10,
    assignee: 'I18n Team'
  },
  {
    id: 'mobile-app-planning',
    title: 'Mobile App Planning',
    description: 'React Native evaluation for mobile app, feature set definition for mobile experience, development timeline and resource planning',
    priority: 'low',
    category: 'future',
    status: 'not-started',
    progress: 0,
    estimatedDays: 15,
    assignee: 'Mobile Team'
  },
  
  // Technical Debt
  {
    id: 'gallery-validation',
    title: 'Gallery Tag-Category Consistency',
    description: 'Recently implemented but needs ongoing validation, ensure all existing images have consistent metadata',
    priority: 'medium',
    category: 'technical-debt',
    status: 'in-progress',
    progress: 80,
    estimatedDays: 2,
    assignee: 'Dev Team'
  },
  {
    id: 'error-handling',
    title: 'Error Handling Improvements',
    description: 'Better validation error messages, comprehensive error logging system, user-friendly error displays',
    priority: 'medium',
    category: 'technical-debt',
    status: 'not-started',
    progress: 0,
    estimatedDays: 3,
    assignee: 'Backend Team'
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Image lazy loading optimization, CDN optimization for Firebase Storage, database query optimization',
    priority: 'low',
    category: 'technical-debt',
    status: 'not-started',
    progress: 0,
    estimatedDays: 5,
    assignee: 'DevOps Team'
  }
];

const PRIORITY_CONFIG = {
  high: { color: 'bg-red-500', icon: AlertTriangleIcon, label: '🔥 High Priority' },
  medium: { color: 'bg-yellow-500', icon: ClockIcon, label: '⚠️ Medium Priority' },
  low: { color: 'bg-blue-500', icon: PlayCircleIcon, label: '💤 Low Priority' }
};

const STATUS_CONFIG = {
  'not-started': { color: 'bg-gray-500', icon: ClockIcon, label: 'Not Started' },
  'in-progress': { color: 'bg-blue-500', icon: PlayCircleIcon, label: 'In Progress' },
  'completed': { color: 'bg-green-500', icon: CheckCircleIcon, label: 'Completed' },
  'blocked': { color: 'bg-red-500', icon: AlertTriangleIcon, label: 'Blocked' }
};

const CATEGORY_CONFIG = {
  dev: { icon: CodeIcon, label: 'Development', color: 'bg-purple-100 text-purple-800' },
  testing: { icon: BugIcon, label: 'Testing', color: 'bg-orange-100 text-orange-800' },
  feature: { icon: RocketIcon, label: 'Feature', color: 'bg-green-100 text-green-800' },
  marketing: { icon: TrendingUpIcon, label: 'Marketing', color: 'bg-pink-100 text-pink-800' },
  admin: { icon: UsersIcon, label: 'Admin', color: 'bg-indigo-100 text-indigo-800' },
  data: { icon: ZapIcon, label: 'Data', color: 'bg-yellow-100 text-yellow-800' },
  i18n: { icon: GitBranchIcon, label: 'I18n', color: 'bg-cyan-100 text-cyan-800' },
  future: { icon: CalendarIcon, label: 'Future', color: 'bg-gray-100 text-gray-800' },
  'technical-debt': { icon: AlertTriangleIcon, label: 'Tech Debt', color: 'bg-red-100 text-red-800' }
};

export default function Roadmap() {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredItems = ROADMAP_DATA.filter(item => {
    const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return priorityMatch && statusMatch;
  });

  const groupedByPriority = {
    high: filteredItems.filter(item => item.priority === 'high'),
    medium: filteredItems.filter(item => item.priority === 'medium'),
    low: filteredItems.filter(item => item.priority === 'low')
  };

  const groupedByStatus = {
    'not-started': filteredItems.filter(item => item.status === 'not-started'),
    'in-progress': filteredItems.filter(item => item.status === 'in-progress'),
    'completed': filteredItems.filter(item => item.status === 'completed'),
    'blocked': filteredItems.filter(item => item.status === 'blocked')
  };

  const overallProgress = Math.round(
    ROADMAP_DATA.reduce((sum, item) => sum + item.progress, 0) / ROADMAP_DATA.length
  );

  const estimatedTotalDays = ROADMAP_DATA.reduce((sum, item) => sum + (item.estimatedDays || 0), 0);

  const renderBacklogItem = (item: BacklogItem) => {
    const CategoryIcon = CATEGORY_CONFIG[item.category].icon;
    const StatusIcon = STATUS_CONFIG[item.status].icon;
    
    return (
      <Card key={item.id} className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-[#8B5E3C] mb-2">
                {item.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mb-3">
                {item.description}
              </CardDescription>
            </div>
            <Badge className={`ml-4 ${PRIORITY_CONFIG[item.priority].color} text-white`}>
              {item.priority.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className={CATEGORY_CONFIG[item.category].color}>
              <CategoryIcon className="w-3 h-3 mr-1" />
              {CATEGORY_CONFIG[item.category].label}
            </Badge>
            
            <Badge variant="outline" className={`${STATUS_CONFIG[item.status].color} text-white`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {STATUS_CONFIG[item.status].label}
            </Badge>
            
            {item.estimatedDays && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {item.estimatedDays} days
              </Badge>
            )}
            
            {item.assignee && (
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                <UsersIcon className="w-3 h-3 mr-1" />
                {item.assignee}
              </Badge>
            )}
          </div>
          
          {item.progress > 0 && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#8B5E3C] mb-4">Ko Lake Villa Project Roadmap</h1>
          
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FF914D]/10 p-2 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-[#FF914D]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#8B5E3C]">{overallProgress}%</p>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <PlayCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#8B5E3C]">
                      {ROADMAP_DATA.filter(item => item.status === 'in-progress').length}
                    </p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#8B5E3C]">
                      {ROADMAP_DATA.filter(item => item.priority === 'high').length}
                    </p>
                    <p className="text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <CalendarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#8B5E3C]">{estimatedTotalDays}</p>
                    <p className="text-sm text-gray-600">Estimated Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={selectedPriority === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedPriority('all')}
                className={selectedPriority === 'all' ? 'bg-[#FF914D] hover:bg-[#e67e3d]' : ''}
              >
                All Priorities
              </Button>
              <Button
                variant={selectedPriority === 'high' ? 'default' : 'outline'}
                onClick={() => setSelectedPriority('high')}
                className={selectedPriority === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                🔥 High
              </Button>
              <Button
                variant={selectedPriority === 'medium' ? 'default' : 'outline'}
                onClick={() => setSelectedPriority('medium')}
                className={selectedPriority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                ⚠️ Medium
              </Button>
              <Button
                variant={selectedPriority === 'low' ? 'default' : 'outline'}
                onClick={() => setSelectedPriority('low')}
                className={selectedPriority === 'low' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                💤 Low
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
                className={selectedStatus === 'all' ? 'bg-[#FF914D] hover:bg-[#e67e3d]' : ''}
              >
                All Status
              </Button>
              <Button
                variant={selectedStatus === 'in-progress' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('in-progress')}
                className={selectedStatus === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                In Progress
              </Button>
              <Button
                variant={selectedStatus === 'not-started' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('not-started')}
                className={selectedStatus === 'not-started' ? 'bg-gray-500 hover:bg-gray-600' : ''}
              >
                Not Started
              </Button>
            </div>
          </div>
        </div>

        {/* Roadmap Content */}
        <Tabs defaultValue="priority" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="priority">View by Priority</TabsTrigger>
            <TabsTrigger value="status">View by Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="priority" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* High Priority Column */}
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                  <AlertTriangleIcon className="w-5 h-5 mr-2" />
                  🔥 High Priority ({groupedByPriority.high.length})
                </h3>
                {groupedByPriority.high.map(renderBacklogItem)}
              </div>
              
              {/* Medium Priority Column */}
              <div>
                <h3 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  ⚠️ Medium Priority ({groupedByPriority.medium.length})
                </h3>
                {groupedByPriority.medium.map(renderBacklogItem)}
              </div>
              
              {/* Low Priority Column */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                  <PlayCircleIcon className="w-5 h-5 mr-2" />
                  💤 Low Priority ({groupedByPriority.low.length})
                </h3>
                {groupedByPriority.low.map(renderBacklogItem)}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="status" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Not Started Column */}
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-4 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  Not Started ({groupedByStatus['not-started'].length})
                </h3>
                {groupedByStatus['not-started'].map(renderBacklogItem)}
              </div>
              
              {/* In Progress Column */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                  <PlayCircleIcon className="w-5 h-5 mr-2" />
                  In Progress ({groupedByStatus['in-progress'].length})
                </h3>
                {groupedByStatus['in-progress'].map(renderBacklogItem)}
              </div>
              
              {/* Completed Column */}
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Completed ({groupedByStatus['completed'].length})
                </h3>
                {groupedByStatus['completed'].map(renderBacklogItem)}
              </div>
              
              {/* Blocked Column */}
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                  <AlertTriangleIcon className="w-5 h-5 mr-2" />
                  Blocked ({groupedByStatus['blocked'].length})
                </h3>
                {groupedByStatus['blocked'].map(renderBacklogItem)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
