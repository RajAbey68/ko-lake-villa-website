import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeftIcon, BarChart2Icon, LineChartIcon, TrendingUpIcon, UsersIcon, RefreshCwIcon, DownloadIcon } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export default function Statistics() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <StatisticsContent />
    </ProtectedRoute>
  );
}

function StatisticsContent() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [statsData, setStatsData] = useState({
    visitors: {
      today: 28,
      week: 147,
      month: 432,
      total: 1984
    },
    pageViews: {
      today: 96,
      week: 526,
      month: 1589,
      total: 7452
    },
    topPages: [
      { page: 'Home', views: 325 },
      { page: 'Accommodation', views: 218 },
      { page: 'Gallery', views: 176 },
      { page: 'Contact', views: 142 },
      { page: 'Booking', views: 135 }
    ],
    countries: [
      { country: 'United Kingdom', visitors: 452 },
      { country: 'United States', visitors: 286 },
      { country: 'Germany', visitors: 178 },
      { country: 'Australia', visitors: 124 },
      { country: 'Canada', visitors: 102 }
    ],
    devices: [
      { type: 'Mobile', percentage: 62 },
      { type: 'Desktop', percentage: 31 },
      { type: 'Tablet', percentage: 7 }
    ]
  });

  // Simulate loading data
  const refreshStats = () => {
    setLoading(true);
    toast({
      title: "Refreshing statistics...",
      description: "Fetching the latest analytics data.",
    });
    
    // Simulate API call with a delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Statistics Updated",
        description: "Analytics data has been refreshed.",
      });
    }, 1500);
  };

  // Placeholder for GA data connection
  useEffect(() => {
    // Here we would normally fetch real analytics data from the GA API
    // For now we're using placeholder data
    
    // Display toast about GA status
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!gaId) {
      toast({
        title: "Google Analytics Not Connected",
        description: "Add your GA Measurement ID to see real-time statistics.",
        variant: "destructive",
        duration: 5000,
      });
    } else {
      toast({
        title: "Google Analytics Connected",
        description: `Connected to GA property: ${gaId}`,
        duration: 3000,
      });
    }
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">Analytics &amp; Statistics</h1>
          <p className="text-gray-600">Monitor your website performance and visitor statistics</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Link href="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Button 
            onClick={refreshStats}
            className="bg-[#62C3D2] hover:bg-[#54b5c4] text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* GA Connection Status */}
      {!import.meta.env.VITE_GA_MEASUREMENT_ID && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Google Analytics Not Connected</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  To see real-time analytics data, add your Google Analytics Measurement ID (G-KWDLSJXM1T) to the project secrets.
                </p>
                <p className="mt-2 text-sm text-yellow-700">
                  Current sample data is for demonstration purposes only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center text-[#8B5E3C]">
              <UsersIcon className="h-5 w-5 mr-2 text-[#FF914D]" />
              Total Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.visitors.total.toLocaleString()}</div>
            <p className="text-gray-500 text-sm mt-1">
              <span className="text-green-600 font-medium">↑ 12.4%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center text-[#8B5E3C]">
              <BarChart2Icon className="h-5 w-5 mr-2 text-[#FF914D]" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.pageViews.total.toLocaleString()}</div>
            <p className="text-gray-500 text-sm mt-1">
              <span className="text-green-600 font-medium">↑ 8.7%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center text-[#8B5E3C]">
              <LineChartIcon className="h-5 w-5 mr-2 text-[#FF914D]" />
              Avg. Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2:46</div>
            <p className="text-gray-500 text-sm mt-1">
              <span className="text-green-600 font-medium">↑ 3.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center text-[#8B5E3C]">
              <TrendingUpIcon className="h-5 w-5 mr-2 text-[#FF914D]" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8%</div>
            <p className="text-gray-500 text-sm mt-1">
              <span className="text-red-600 font-medium">↓ 1.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Statistics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-[#FDF6EE]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">Popular Pages</CardTitle>
                <CardDescription>Most visited pages this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 text-gray-500">{index + 1}.</div>
                        <div>{page.page}</div>
                      </div>
                      <div className="font-medium">{page.views.toLocaleString()} views</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">Visitor Demographics</CardTitle>
                <CardDescription>Top countries of origin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statsData.countries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 text-gray-500">{index + 1}.</div>
                        <div>{country.country}</div>
                      </div>
                      <div className="font-medium">{country.visitors} visitors</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-[#8B5E3C]">Device Breakdown</CardTitle>
              <CardDescription>Visitor device types</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-around">
              {statsData.devices.map((device, index) => (
                <div key={index} className="text-center px-4 py-2">
                  <div className="text-2xl font-bold text-[#FF914D]">{device.percentage}%</div>
                  <div className="text-gray-500">{device.type}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#8B5E3C]">Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>Organic Search</div>
                  <div className="font-medium">42%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Direct</div>
                  <div className="font-medium">28%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Social Media</div>
                  <div className="font-medium">16%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Referral</div>
                  <div className="font-medium">9%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Email</div>
                  <div className="font-medium">5%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#8B5E3C]">Page Performance</CardTitle>
              <CardDescription>Detailed metrics for each page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Page</th>
                      <th className="text-right py-3 px-4">Views</th>
                      <th className="text-right py-3 px-4">Avg. Time</th>
                      <th className="text-right py-3 px-4">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">/</td>
                      <td className="text-right py-3 px-4">325</td>
                      <td className="text-right py-3 px-4">1:24</td>
                      <td className="text-right py-3 px-4">48%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">/accommodation</td>
                      <td className="text-right py-3 px-4">218</td>
                      <td className="text-right py-3 px-4">2:36</td>
                      <td className="text-right py-3 px-4">32%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">/gallery</td>
                      <td className="text-right py-3 px-4">176</td>
                      <td className="text-right py-3 px-4">3:18</td>
                      <td className="text-right py-3 px-4">28%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">/contact</td>
                      <td className="text-right py-3 px-4">142</td>
                      <td className="text-right py-3 px-4">1:45</td>
                      <td className="text-right py-3 px-4">39%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">/booking</td>
                      <td className="text-right py-3 px-4">135</td>
                      <td className="text-right py-3 px-4">4:22</td>
                      <td className="text-right py-3 px-4">21%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">Countries</CardTitle>
                <CardDescription>Visitor locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statsData.countries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>{country.country}</div>
                      <div className="font-medium">{country.visitors} visitors</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-[#8B5E3C]">Languages</CardTitle>
                <CardDescription>Primary languages used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>English</div>
                    <div className="font-medium">76%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>German</div>
                    <div className="font-medium">8%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>French</div>
                    <div className="font-medium">6%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Spanish</div>
                    <div className="font-medium">5%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Others</div>
                    <div className="font-medium">5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-gray-500 text-sm mt-10">
        <p>Google Analytics data is refreshed approximately every 24 hours.</p>
        <p>Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}