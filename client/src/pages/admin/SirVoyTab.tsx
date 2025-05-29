import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function SirVoyTab() {
  const { toast } = useToast();
  const [icalUrls, setIcalUrls] = useState({
    deluxeFamilySuite: 'https://secured.sirvoy.com/ical/ba9904a2-aa48-4afb-a3c4-26d65bf93790',
    room002: '',
    room003: '',
    room004: ''
  });
  const [testResults, setTestResults] = useState<any>(null);

  // Test iCal connection
  const testConnection = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('GET', `/api/sirvoy/bookings?icalUrl=${encodeURIComponent(url)}`);
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(data);
      toast({
        title: "Connection Successful",
        description: `Found ${data.count} bookings from SirVoy`,
      });
    },
    onError: (error: any) => {
      setTestResults({ error: error.message });
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect to SirVoy iCal feed",
        variant: "destructive",
      });
    }
  });

  const handleTestUrl = (url: string) => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter an iCal URL to test",
        variant: "destructive",
      });
      return;
    }
    testConnection.mutate(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SirVoy iCal Integration</CardTitle>
          <CardDescription>
            Connect your Ko Lake Villa rooms with SirVoy booking data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deluxeSuite">Deluxe Family Suite (Room 001)</Label>
              <div className="flex gap-2">
                <Input
                  id="deluxeSuite"
                  placeholder="https://secured.sirvoy.com/ical/..."
                  value={icalUrls.deluxeFamilySuite}
                  onChange={(e) => setIcalUrls(prev => ({ ...prev, deluxeFamilySuite: e.target.value }))}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleTestUrl(icalUrls.deluxeFamilySuite)}
                  disabled={testConnection.isPending}
                  variant="outline"
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room002">Room 002</Label>
              <div className="flex gap-2">
                <Input
                  id="room002"
                  placeholder="https://secured.sirvoy.com/ical/..."
                  value={icalUrls.room002}
                  onChange={(e) => setIcalUrls(prev => ({ ...prev, room002: e.target.value }))}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleTestUrl(icalUrls.room002)}
                  disabled={testConnection.isPending || !icalUrls.room002}
                  variant="outline"
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room003">Room 003</Label>
              <div className="flex gap-2">
                <Input
                  id="room003"
                  placeholder="https://secured.sirvoy.com/ical/..."
                  value={icalUrls.room003}
                  onChange={(e) => setIcalUrls(prev => ({ ...prev, room003: e.target.value }))}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleTestUrl(icalUrls.room003)}
                  disabled={testConnection.isPending || !icalUrls.room003}
                  variant="outline"
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room004">Room 004</Label>
              <div className="flex gap-2">
                <Input
                  id="room004"
                  placeholder="https://secured.sirvoy.com/ical/..."
                  value={icalUrls.room004}
                  onChange={(e) => setIcalUrls(prev => ({ ...prev, room004: e.target.value }))}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleTestUrl(icalUrls.room004)}
                  disabled={testConnection.isPending || !icalUrls.room004}
                  variant="outline"
                >
                  Test
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {testResults.error}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-green-600">
                  <strong>Success:</strong> Found {testResults.count} bookings
                </div>
                {testResults.bookings && testResults.bookings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Recent Bookings:</h4>
                    <div className="space-y-2">
                      {testResults.bookings.slice(0, 3).map((booking: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <strong>{booking.guestName}</strong> - {booking.checkIn} to {booking.checkOut}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How to Get Your iCal URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to your SirVoy dashboard</li>
            <li>Navigate to Channels section (as shown in your screenshot)</li>
            <li>Find the iCal integration</li>
            <li>Click "Edit" to view your iCal URLs</li>
            <li>Copy each room's iCal URL and paste above</li>
            <li>Click "Test" to verify the connection works</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-4">
            Note: If the test fails, the iCal URL might need to be made public in your SirVoy settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}