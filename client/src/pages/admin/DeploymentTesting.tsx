import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Copy,
  RefreshCw,
  AlertTriangle,
  Globe,
  Server,
  Smartphone
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TestResult {
  name: string;
  status: 'pending' | 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: string;
  details?: string;
  response?: any;
}

interface TestSuite {
  name: string;
  description: string;
  tests: TestResult[];
  startTime?: string;
  endTime?: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

export default function DeploymentTesting() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<Record<string, TestSuite>>({});
  const [selectedSuite, setSelectedSuite] = useState<string>('routing');
  const [debugLog, setDebugLog] = useState<string>('');

  const initializeTestSuites = () => {
    const suites: Record<string, TestSuite> = {
      routing: {
        name: 'Page Routing Tests',
        description: 'Verify all website pages load correctly',
        tests: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      admin: {
        name: 'Admin Dashboard Tests',
        description: 'Test admin panel functionality and access',
        tests: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      api: {
        name: 'API Endpoint Tests',
        description: 'Validate all API endpoints respond correctly',
        tests: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      content: {
        name: 'Content Management Tests',
        description: 'Test CMS functionality and content loading',
        tests: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      mobile: {
        name: 'Mobile & Performance Tests',
        description: 'Test responsive design and loading performance',
        tests: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      }
    };
    setTestSuites(suites);
  };

  useEffect(() => {
    initializeTestSuites();
  }, []);

  const logDebugMessage = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '[INFO]',
      error: '[ERROR]',
      success: '[SUCCESS]',
      warning: '[WARNING]'
    }[type];
    
    const logEntry = `${timestamp} ${prefix} ${message}\n`;
    setDebugLog(prev => prev + logEntry);
  };

  const updateTestResult = (suiteKey: string, testName: string, status: TestResult['status'], message: string, details?: string, response?: any) => {
    const timestamp = new Date().toISOString();
    const testResult: TestResult = {
      name: testName,
      status,
      message,
      timestamp,
      details,
      response
    };

    setTestSuites(prev => {
      const suite = prev[suiteKey];
      const existingTestIndex = suite.tests.findIndex(t => t.name === testName);
      
      let updatedTests;
      if (existingTestIndex >= 0) {
        updatedTests = [...suite.tests];
        updatedTests[existingTestIndex] = testResult;
      } else {
        updatedTests = [...suite.tests, testResult];
      }

      const passedTests = updatedTests.filter(t => t.status === 'pass').length;
      const failedTests = updatedTests.filter(t => t.status === 'fail').length;

      return {
        ...prev,
        [suiteKey]: {
          ...suite,
          tests: updatedTests,
          totalTests: updatedTests.length,
          passedTests,
          failedTests
        }
      };
    });

    logDebugMessage(`${suiteKey.toUpperCase()} - ${testName}: ${status.toUpperCase()} - ${message}`, 
      status === 'pass' ? 'success' : status === 'fail' ? 'error' : 'info');
  };

  const testRoute = async (path: string, expectedStatus: number = 200, description: string = '') => {
    try {
      const response = await fetch(path);
      const success = response.status === expectedStatus;
      const message = success 
        ? `${response.status} - Page loaded successfully`
        : `Expected ${expectedStatus}, got ${response.status}`;
      
      updateTestResult('routing', description || path, success ? 'pass' : 'fail', message, 
        `URL: ${path}, Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
      
      return success;
    } catch (error) {
      updateTestResult('routing', description || path, 'fail', `Network error: ${error.message}`, 
        `URL: ${path}, Error: ${error}`);
      return false;
    }
  };

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const success = response.ok;
      const data = response.headers.get('content-type')?.includes('application/json') 
        ? await response.json() 
        : await response.text();

      updateTestResult('api', `${method} ${endpoint}`, success ? 'pass' : 'fail',
        success ? `${response.status} - Response received` : `${response.status} - ${response.statusText}`,
        `Endpoint: ${endpoint}, Method: ${method}, Response: ${JSON.stringify(data, null, 2)}`, data);

      return success;
    } catch (error) {
      updateTestResult('api', `${method} ${endpoint}`, 'fail', `Request failed: ${error.message}`,
        `Endpoint: ${endpoint}, Error: ${error}`);
      return false;
    }
  };

  const runRoutingTests = async () => {
    logDebugMessage('Starting routing tests...');
    
    await testRoute('/', 200, 'Homepage');
    await testRoute('/accommodation', 200, 'Accommodation Page');
    await testRoute('/dining', 200, 'Dining Page');
    await testRoute('/experiences', 200, 'Experiences Page');
    await testRoute('/gallery', 200, 'Gallery Page');
    await testRoute('/contact', 200, 'Contact Page');
    await testRoute('/booking', 200, 'Booking Page');
    await testRoute('/nonexistent', 404, '404 Error Handling');
  };

  const runAdminTests = async () => {
    logDebugMessage('Starting admin tests...');
    
    await testRoute('/admin', 200, 'Admin Landing');
    await testRoute('/admin/login', 200, 'Admin Login');
    await testRoute('/admin/dashboard', 200, 'Admin Dashboard');
    await testRoute('/admin/content', 200, 'Content Manager');
    await testRoute('/admin/gallery', 200, 'Gallery Manager');
    await testRoute('/admin/nonexistent', 404, 'Admin 404 Handling');
  };

  const runAPITests = async () => {
    logDebugMessage('Starting API tests...');
    
    await testAPI('/api/content');
    await testAPI('/api/gallery');
    await testAPI('/api/testimonials');
    await testAPI('/api/rooms');
    await testAPI('/api/pricing');
    await testAPI('/api/contact', 'POST', { name: 'Test', email: 'test@example.com', message: 'Test message' });
    await testAPI('/api/newsletter', 'POST', { email: 'test@example.com' });
  };

  const runContentTests = async () => {
    logDebugMessage('Starting content management tests...');
    
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const content = await response.json();
        const pages = ['home', 'accommodation', 'dining', 'experiences', 'gallery', 'contact'];
        
        for (const page of pages) {
          const pageContent = content.filter((item: any) => item.page === page);
          updateTestResult('content', `${page} page content`, 
            pageContent.length > 0 ? 'pass' : 'fail',
            pageContent.length > 0 ? `${pageContent.length} sections found` : 'No content found',
            `Page: ${page}, Content sections: ${JSON.stringify(pageContent, null, 2)}`);
        }
      } else {
        updateTestResult('content', 'Content API', 'fail', `API returned ${response.status}`, 
          `Response: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      updateTestResult('content', 'Content API', 'fail', `API request failed: ${error.message}`,
        `Error: ${error}`);
    }
  };

  const runMobileTests = async () => {
    logDebugMessage('Starting mobile and performance tests...');
    
    // Test mobile viewport
    try {
      const startTime = performance.now();
      const response = await fetch('/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
        }
      });
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      updateTestResult('mobile', 'Mobile User Agent', response.ok ? 'pass' : 'fail',
        response.ok ? `Page loads on mobile (${loadTime.toFixed(0)}ms)` : 'Mobile loading failed',
        `User Agent: iPhone, Load time: ${loadTime}ms, Status: ${response.status}`);
      
      updateTestResult('mobile', 'Page Load Performance', 
        loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
        `Load time: ${loadTime.toFixed(0)}ms`,
        `Performance threshold: <3s good, <5s acceptable, >5s poor`);
      
    } catch (error) {
      updateTestResult('mobile', 'Mobile Test', 'fail', `Mobile test failed: ${error.message}`,
        `Error: ${error}`);
    }
  };

  const runAllTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setDebugLog('');
    initializeTestSuites();
    
    logDebugMessage('🚀 Starting comprehensive deployment tests...');
    
    const startTime = new Date().toISOString();
    
    try {
      await runRoutingTests();
      await runAdminTests();
      await runAPITests();
      await runContentTests();
      await runMobileTests();
      
      const endTime = new Date().toISOString();
      logDebugMessage(`✅ All tests completed. Started: ${startTime}, Ended: ${endTime}`);
      
      toast({
        title: "Tests Completed",
        description: "All deployment tests have finished running. Check the results below.",
        duration: 5000,
      });
      
    } catch (error) {
      logDebugMessage(`❌ Test execution error: ${error.message}`, 'error');
      toast({
        title: "Test Execution Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleSuite = async (suiteKey: string) => {
    if (isRunning) return;
    
    setIsRunning(true);
    logDebugMessage(`Starting ${testSuites[suiteKey].name}...`);
    
    try {
      switch (suiteKey) {
        case 'routing':
          await runRoutingTests();
          break;
        case 'admin':
          await runAdminTests();
          break;
        case 'api':
          await runAPITests();
          break;
        case 'content':
          await runContentTests();
          break;
        case 'mobile':
          await runMobileTests();
          break;
      }
      
      toast({
        title: "Test Suite Completed",
        description: `${testSuites[suiteKey].name} has finished running.`,
      });
      
    } catch (error) {
      logDebugMessage(`❌ ${suiteKey} test error: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const copyDebugLog = () => {
    navigator.clipboard.writeText(debugLog);
    toast({
      title: "Debug Log Copied",
      description: "Debug log has been copied to clipboard for sharing with support.",
    });
  };

  const downloadTestResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      testSuites,
      debugLog,
      summary: {
        totalSuites: Object.keys(testSuites).length,
        totalTests: Object.values(testSuites).reduce((sum, suite) => sum + suite.totalTests, 0),
        totalPassed: Object.values(testSuites).reduce((sum, suite) => sum + suite.passedTests, 0),
        totalFailed: Object.values(testSuites).reduce((sum, suite) => sum + suite.failedTests, 0)
      }
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuiteStatusColor = (suite: TestSuite) => {
    if (suite.totalTests === 0) return 'text-gray-500';
    if (suite.failedTests > 0) return 'text-red-600';
    if (suite.passedTests === suite.totalTests) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#8B5E3C] flex items-center gap-2">
              <TestTube className="w-8 h-8 text-[#FF914D]" />
              Deployment Testing
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive testing suite for deployment validation</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-[#FF914D] hover:bg-[#e67e3d]"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Test Suites Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {Object.entries(testSuites).map(([key, suite]) => (
            <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setSelectedSuite(key)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{suite.name}</h3>
                  <div className={`text-xs font-bold ${getSuiteStatusColor(suite)}`}>
                    {suite.totalTests > 0 ? `${suite.passedTests}/${suite.totalTests}` : '0'}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Pass: {suite.passedTests}</span>
                  <span>Fail: {suite.failedTests}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    runSingleSuite(key);
                  }}
                  disabled={isRunning}
                >
                  {isRunning ? 'Running...' : 'Test Suite'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                {testSuites[selectedSuite]?.name || 'Test Results'}
              </CardTitle>
              <CardDescription>
                {testSuites[selectedSuite]?.description || 'Select a test suite to view results'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testSuites[selectedSuite]?.tests.map((test, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(test.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{test.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(test.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                      {test.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer">Show Details</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {test.details}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-8">
                    <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tests run yet. Click "Run All Tests" or select a test suite.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Debug Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Debug Log
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyDebugLog}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Log
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadTestResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Detailed execution log for troubleshooting failed tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={debugLog}
                readOnly
                placeholder="Debug information will appear here when tests are run..."
                className="h-96 font-mono text-xs"
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">💡 Pro Tip:</p>
                <p className="text-xs text-blue-600 mt-1">
                  Copy the debug log and paste it when reporting issues to support. 
                  Include test results for faster troubleshooting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* A/B Testing Matrix */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              A/B Testing Matrix
            </CardTitle>
            <CardDescription>
              Compare test results across different environments and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Test Category</th>
                    <th className="text-center p-2">Development</th>
                    <th className="text-center p-2">Staging</th>
                    <th className="text-center p-2">Production</th>
                    <th className="text-center p-2">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(testSuites).map(([key, suite]) => (
                    <tr key={key} className="border-b">
                      <td className="p-2 font-medium">{suite.name}</td>
                      <td className="text-center p-2">
                        <span className={getSuiteStatusColor(suite)}>
                          {suite.totalTests > 0 ? `${suite.passedTests}/${suite.totalTests}` : '-'}
                        </span>
                      </td>
                      <td className="text-center p-2 text-gray-400">-</td>
                      <td className="text-center p-2 text-gray-400">-</td>
                      <td className="text-center p-2">
                        {key === 'mobile' && suite.totalTests > 0 ? (
                          <span className={getSuiteStatusColor(suite)}>
                            {suite.passedTests}/{suite.totalTests}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>• Development: Current testing environment</p>
              <p>• Staging: Pre-production testing (configure URL to enable)</p>
              <p>• Production: Live website testing (configure URL to enable)</p>
              <p>• Mobile: Mobile-specific test results</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}