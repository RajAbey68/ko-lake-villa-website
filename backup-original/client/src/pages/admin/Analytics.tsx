import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Target, 
  Globe, 
  Smartphone,
  RefreshCw,
  Download,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    pageViews: number;
    avgSession: string;
    conversionRate: number;
    visitorChange: number;
    pageViewChange: number;
    sessionChange: number;
    conversionChange: number;
  };
  popularPages: Array<{
    page: string;
    views: number;
    path: string;
  }>;
  demographics: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  realTime: {
    activeUsers: number;
    topPages: string[];
  };
}

interface MetaAnalytics {
  facebook: {
    pageFollowers: number;
    postReach: number;
    engagement: number;
    pageViews: number;
  };
  instagram: {
    followers: number;
    impressions: number;
    reach: number;
    engagement: number;
  };
  ads: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
  };
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [metaData, setMetaData] = useState<MetaAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Check if Google Analytics is properly configured
      if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
        toast({
          title: "Google Analytics not configured",
          description: "Please add your Google Analytics Measurement ID to view data",
          variant: "destructive",
        });
        return;
      }

      // Sample data structure - replace with actual Google Analytics API calls
      const sampleData: AnalyticsData = {
        overview: {
          totalVisitors: 1984,
          pageViews: 7452,
          avgSession: "2:46",
          conversionRate: 4.8,
          visitorChange: 12.4,
          pageViewChange: 8.7,
          sessionChange: 3.2,
          conversionChange: 1.1
        },
        popularPages: [
          { page: "Home", views: 325, path: "/" },
          { page: "Accommodation", views: 218, path: "/accommodation" },
          { page: "Gallery", views: 176, path: "/gallery" },
          { page: "Contact", views: 142, path: "/contact" },
          { page: "Booking", views: 135, path: "/booking" }
        ],
        demographics: [
          { country: "United Kingdom", visitors: 452, percentage: 22.8 },
          { country: "United States", visitors: 286, percentage: 14.4 },
          { country: "Germany", visitors: 178, percentage: 9.0 },
          { country: "Australia", visitors: 124, percentage: 6.3 },
          { country: "Canada", visitors: 102, percentage: 5.1 }
        ],
        trafficSources: [
          { source: "Organic Search", visitors: 856, percentage: 43.1 },
          { source: "Direct", visitors: 432, percentage: 21.8 },
          { source: "Social Media", visitors: 298, percentage: 15.0 },
          { source: "Referral", visitors: 234, percentage: 11.8 },
          { source: "Email", visitors: 164, percentage: 8.3 }
        ],
        realTime: {
          activeUsers: 23,
          topPages: ["/", "/accommodation", "/gallery"]
        }
      };

      const sampleMetaData: MetaAnalytics = {
        facebook: {
          pageFollowers: 2450,
          postReach: 8650,
          engagement: 324,
          pageViews: 1250
        },
        instagram: {
          followers: 3200,
          impressions: 15400,
          reach: 12300,
          engagement: 480
        },
        ads: {
          spend: 150,
          impressions: 45000,
          clicks: 890,
          conversions: 12
        }
      };

      setAnalyticsData(sampleData);
      setMetaData(sampleMetaData);
      setLastUpdated(new Date());
      
    } catch (error) {
      toast({
        title: "Failed to load analytics",
        description: "Please check your analytics configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAnalyticsData();
    toast({
      title: "Analytics refreshed",
      description: "Data updated successfully",
    });
  };

  const exportData = () => {
    if (!analyticsData) return;
    
    const dataToExport = {
      exportDate: new Date().toISOString(),
      overview: analyticsData.overview,
      popularPages: analyticsData.popularPages,
      demographics: analyticsData.demographics,
      trafficSources: analyticsData.trafficSources
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ko-lake-villa-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Statistics</h1>
          <p className="text-muted-foreground">Monitor your website performance and visitor statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="google" className="space-y-6">
        <TabsList>
          <TabsTrigger value="google">Google Analytics</TabsTrigger>
          <TabsTrigger value="meta">Meta Analytics</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="space-y-6">
          {analyticsData && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.totalVisitors.toLocaleString()}</p>
                        <p className="text-xs text-green-600">
                          ↑ {analyticsData.overview.visitorChange}% from last month
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.pageViews.toLocaleString()}</p>
                        <p className="text-xs text-green-600">
                          ↑ {analyticsData.overview.pageViewChange}% from last month
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.avgSession}</p>
                        <p className="text-xs text-green-600">
                          ↑ {analyticsData.overview.sessionChange}% from last month
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
                        <p className="text-xs text-green-600">
                          ↑ {analyticsData.overview.conversionChange}% from last month
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Popular Pages
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Most visited pages this month</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.popularPages.map((page, index) => (
                        <div key={page.path} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            <span className="font-medium">{page.page}</span>
                          </div>
                          <Badge variant="secondary">{page.views} views</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Visitor Demographics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Visitor Demographics
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Top countries of origin</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.demographics.map((demo, index) => (
                        <div key={demo.country} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            <span className="font-medium">{demo.country}</span>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{demo.visitors} visitors</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    Real-Time Data
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold text-green-600">
                        {analyticsData.realTime.activeUsers}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Top Active Pages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analyticsData.realTime.topPages.map(page => (
                          <Badge key={page} variant="outline">{page}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="meta" className="space-y-6">
          {metaData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Facebook Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Page Followers</p>
                        <p className="text-2xl font-bold">{metaData.facebook.pageFollowers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Post Reach</p>
                        <p className="text-2xl font-bold">{metaData.facebook.postReach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="text-2xl font-bold">{metaData.facebook.engagement}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Page Views</p>
                        <p className="text-2xl font-bold">{metaData.facebook.pageViews.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Instagram Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-pink-600">Instagram Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="text-2xl font-bold">{metaData.instagram.followers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Impressions</p>
                        <p className="text-2xl font-bold">{metaData.instagram.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reach</p>
                        <p className="text-2xl font-bold">{metaData.instagram.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="text-2xl font-bold">{metaData.instagram.engagement}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ad Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Ad Performance</CardTitle>
                  <p className="text-sm text-muted-foreground">Facebook & Instagram advertising metrics</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spend</p>
                      <p className="text-2xl font-bold">${metaData.ads.spend}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Impressions</p>
                      <p className="text-2xl font-bold">{metaData.ads.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clicks</p>
                      <p className="text-2xl font-bold">{metaData.ads.clicks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold">{metaData.ads.conversions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare performance across Google Analytics and Meta platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Website Traffic</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analyticsData?.overview.totalVisitors.toLocaleString()}
                  </p>
                  <p className="text-xs">Google Analytics</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Social Reach</p>
                  <p className="text-2xl font-bold text-green-600">
                    {metaData ? (metaData.facebook.postReach + metaData.instagram.reach).toLocaleString() : 0}
                  </p>
                  <p className="text-xs">Meta Platforms</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {metaData ? (metaData.facebook.pageFollowers + metaData.instagram.followers).toLocaleString() : 0}
                  </p>
                  <p className="text-xs">Combined Social</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}