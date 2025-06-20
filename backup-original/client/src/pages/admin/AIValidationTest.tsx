
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Upload, Brain, TestTube } from 'lucide-react';

const GALLERY_CATEGORIES = [
  'entire-villa',
  'family-suite', 
  'group-room',
  'triple-room',
  'dining-area',
  'pool-deck',
  'lake-garden',
  'roof-garden',
  'front-garden',
  'koggala-lake',
  'excursions'
];

interface TestResult {
  category: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  confidence?: number;
  suggestedCategory?: string;
  responseTime?: number;
  error?: string;
}

export default function AIValidationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>(
    GALLERY_CATEGORIES.map(cat => ({ category: cat, status: 'pending' }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runAITest = async (category: string): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Create a test blob to simulate file upload
      const testImage = await createTestImage(category);
      const formData = new FormData();
      formData.append('file', testImage, `test_${category}.png`);

      const response = await fetch('/api/ai/analyze-media', {
        method: 'POST',
        body: formData
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        category,
        status: result.category === category ? 'passed' : 'failed',
        confidence: result.confidence,
        suggestedCategory: result.category,
        responseTime,
        error: result.category !== category ? `Expected ${category}, got ${result.category}` : undefined
      };
    } catch (error) {
      return {
        category,
        status: 'failed',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const createTestImage = async (category: string): Promise<Blob> => {
    // Create a simple test image with category text
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Test ${category}`, 100, 100);
    
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob!), 'image/png');
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const results: TestResult[] = [];
    
    for (let i = 0; i < GALLERY_CATEGORIES.length; i++) {
      const category = GALLERY_CATEGORIES[i];
      
      // Update status to testing
      setTestResults(prev => prev.map(r => 
        r.category === category ? { ...r, status: 'testing' } : r
      ));

      const result = await runAITest(category);
      results.push(result);
      
      // Update individual result
      setTestResults(prev => prev.map(r => 
        r.category === category ? result : r
      ));
      
      setProgress(((i + 1) / GALLERY_CATEGORIES.length) * 100);
      
      // Small delay between tests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    
    toast({
      title: "AI Testing Complete",
      description: `${passed} passed, ${failed} failed out of ${GALLERY_CATEGORIES.length} tests`,
      variant: passed === GALLERY_CATEGORIES.length ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'testing': return <TestTube className="h-5 w-5 text-blue-600 animate-pulse" />;
      default: return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const overallStats = {
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed').length,
    avgResponseTime: testResults
      .filter(r => r.responseTime)
      .reduce((acc, r) => acc + (r.responseTime || 0), 0) / 
      testResults.filter(r => r.responseTime).length || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Integration Validation</h1>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          {isRunning ? 'Testing...' : 'Run All Tests'}
        </Button>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Testing Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
            <p className="text-sm text-gray-600">Tests Passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
            <p className="text-sm text-gray-600">Tests Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {overallStats.avgResponseTime ? `${Math.round(overallStats.avgResponseTime)}ms` : 'N/A'}
            </div>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Category Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={result.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium capitalize">
                      {result.category.replace('-', ' ')}
                    </div>
                    {result.error && (
                      <div className="text-sm text-red-600">{result.error}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {result.confidence && (
                    <Badge variant="outline">
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </Badge>
                  )}
                  {result.responseTime && (
                    <Badge variant="secondary">
                      {result.responseTime}ms
                    </Badge>
                  )}
                  <Badge 
                    variant={result.status === 'passed' ? 'default' : 
                            result.status === 'failed' ? 'destructive' : 'secondary'}
                  >
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      {overallStats.avgResponseTime > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Average Response Time:</span>
                <Badge variant={overallStats.avgResponseTime > 3000 ? 'destructive' : 'default'}>
                  {Math.round(overallStats.avgResponseTime)}ms
                </Badge>
              </div>
              
              {overallStats.avgResponseTime > 3000 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Response times are above 3 seconds. Consider optimizing image sizes or implementing caching.
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p>• Optimal response time: &lt; 2 seconds</p>
                <p>• Acceptable response time: 2-3 seconds</p>
                <p>• Poor response time: &gt; 3 seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
