import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SirVoyStatus {
  status: string;
  configured: boolean;
  message: string;
}

interface SirVoyBooking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: string;
}

export default function SirVoyConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [icalUrls, setIcalUrls] = useState({
    klv: '',
    klv1: '',
    klv3: '',
    klv6: ''
  });
  const [testUrl, setTestUrl] = useState('');

  // Get SirVoy connection status
  const { data: status } = useQuery<SirVoyStatus>({
    queryKey: ['/api/sirvoy/status'],
    refetchInterval: 30000 // Check status every 30 seconds
  });

  // Test iCal connection
  const testConnection = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('GET', `/api/sirvoy/bookings?icalUrl=${encodeURIComponent(url)}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Successful",
        description: `Found ${data.count} bookings from SirVoy`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect to SirVoy iCal feed",
        variant: "destructive",
      });
    }
  });

  // Save iCal URLs to environment or storage
  const saveUrls = useMutation({
    mutationFn: async (urls: typeof icalUrls) => {
      // For now, we'll store these in localStorage
      // In production, you'd want to store these securely
      localStorage.setItem('sirvoy_ical_urls', JSON.stringify(urls));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "URLs Saved",
        description: "Your SirVoy iCal URLs have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sirvoy/status'] });
    }
  });

  // Load saved URLs on component mount
  useEffect(() => {
    const saved = localStorage.getItem('sirvoy_ical_urls');
    if (saved) {
      try {
        setIcalUrls(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved iCal URLs:', error);
      }
    }
  }, []);

  const handleTestConnection = () => {
    if (!testUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter an iCal URL to test",
        variant: "destructive",
      });
      return;
    }
    testConnection.mutate(testUrl);
  };

  const handleSaveUrls = () => {
    saveUrls.mutate(icalUrls);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SirVoy Integration Status</CardTitle>
          <CardDescription>
            Connect your Ko Lake Villa booking system with SirVoy using iCal feeds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant={status?.configured ? "default" : "secondary"}>
              {status?.configured ? "Connected" : "Not Connected"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {status?.message || "Loading..."}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test iCal Connection</CardTitle>
          <CardDescription>
            Test a single iCal URL to verify it's working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testUrl">iCal URL</Label>
            <Input
              id="testUrl"
              placeholder="https://app.sirvoy.com/ical/your-calendar-id"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleTestConnection}
            disabled={testConnection.isPending || !testUrl.trim()}
          >
            {testConnection.isPending ? "Testing..." : "Test Connection"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configure Room iCal URLs</CardTitle>
          <CardDescription>
            Add your SirVoy iCal URLs for each room type. You can find these in your SirVoy dashboard under Integrations → iCal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="klv">Entire Villa (KLV)</Label>
              <Input
                id="klv"
                placeholder="iCal URL for entire villa"
                value={icalUrls.klv}
                onChange={(e) => setIcalUrls(prev => ({ ...prev, klv: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="klv1">Master Family Suite (KLV1)</Label>
              <Input
                id="klv1"
                placeholder="iCal URL for master suite"
                value={icalUrls.klv1}
                onChange={(e) => setIcalUrls(prev => ({ ...prev, klv1: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="klv3">Triple/Twin Rooms (KLV3)</Label>
              <Input
                id="klv3"
                placeholder="iCal URL for triple rooms"
                value={icalUrls.klv3}
                onChange={(e) => setIcalUrls(prev => ({ ...prev, klv3: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="klv6">Group Room (KLV6)</Label>
              <Input
                id="klv6"
                placeholder="iCal URL for group room"
                value={icalUrls.klv6}
                onChange={(e) => setIcalUrls(prev => ({ ...prev, klv6: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSaveUrls}
            disabled={saveUrls.isPending}
            className="w-full"
          >
            {saveUrls.isPending ? "Saving..." : "Save iCal URLs"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Get Your iCal URLs</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Log into your SirVoy dashboard</li>
            <li>Go to <strong>Settings</strong> or <strong>Integrations</strong></li>
            <li>Look for <strong>iCal</strong> or <strong>Calendar Export</strong></li>
            <li>Click <strong>Edit</strong> next to the iCal option</li>
            <li>Copy the iCal URLs for each of your room types</li>
            <li>Paste them in the fields above and click Save</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-4">
            Once connected, your website will automatically show real availability and booking data from SirVoy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}