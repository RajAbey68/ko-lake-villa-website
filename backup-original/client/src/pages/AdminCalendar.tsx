import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface PricingData {
  rooms: {
    [roomId: string]: {
      basePrice: number;
      directPrice: number;
    };
  };
  lastUpdated: string;
}

export default function AdminCalendar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  // Fetch current pricing data
  const { data: pricing, isLoading } = useQuery<PricingData>({
    queryKey: ['/api/admin/pricing'],
  });

  // Handle saving custom price
  const handleSavePrice = (roomId: string, autoDirectRate: number) => {
    const customPrice = parseFloat(editPrice);
    if (!customPrice || customPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than $0.",
        variant: "destructive",
      });
      return;
    }

    // Store locally for now (in production this would go to your database)
    const currentOverrides = pricing?.overrides || {};
    const newOverrides = {
      ...currentOverrides,
      [roomId]: {
        customPrice: customPrice,
        setDate: new Date().toISOString(),
        autoPrice: autoDirectRate
      }
    };

    // Update the query cache with new override
    queryClient.setQueryData(['/api/admin/pricing'], (oldData: PricingData | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        overrides: newOverrides
      };
    });

    setEditingRoom(null);
    setEditPrice('');
    
    toast({
      title: "Price Updated",
      description: `Custom price set for ${roomId.toUpperCase()}: $${customPrice}. Will revert to pre-agreed rate ($${autoDirectRate}) next Sunday.`,
    });
  };

  // Refresh pricing mutation
  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/refresh-pricing'),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing'] });
      
      if (data?.autoReverted) {
        toast({
          title: "Sunday Auto-Revert",
          description: "All custom prices have been reset to pre-agreed rates as scheduled.",
        });
      } else {
        toast({
          title: "Pricing Refreshed",
          description: `Next auto-revert: ${data?.nextRevertDate || 'Next Sunday'}`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Could not update pricing. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    document.title = "Pricing Calendar - Ko Lake Villa Admin";
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#1E4E5F] text-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/admin">
                <button className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Dashboard
                </button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold mb-2">📅 Ko Lake Villa – Airbnb Price Calendar</h1>
            <p className="text-blue-100">Monitor and update your baseline pricing strategy</p>
          </div>

          <div className="p-6">
            {/* Refresh Button */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Last updated: {pricing ? new Date(pricing.updated).toLocaleString() : 'Never'}
                </p>
              </div>
              <button
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
                className="bg-[#E8B87D] text-white px-6 py-2 rounded hover:bg-[#1E4E5F] transition-colors font-medium disabled:opacity-50"
              >
                {refreshMutation.isPending ? '⏳ Refreshing...' : '🔁 Refresh Airbnb Pricing'}
              </button>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Room</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Base Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Discount</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Direct Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Edit Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing?.rooms && Object.entries(pricing.rooms).map(([roomId, roomData]) => {
                    const basePrice = roomData.basePrice;
                    const directPrice = roomData.directPrice;
                    const discountPercent = Math.round(((basePrice - directPrice) / basePrice) * 100);
                    
                    return (
                      <tr key={roomId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {roomId.toUpperCase()}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${basePrice}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          -{discountPercent}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${directPrice}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {editingRoom === roomId ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-20 px-2 py-1 border rounded text-center"
                                placeholder={directPrice.toString()}
                                min="1"
                                max={basePrice}
                              />
                              <button
                                onClick={() => handleSavePrice(roomId, directPrice)}
                                className="bg-green-600 text-white hover:bg-green-800 px-3 py-1 rounded text-sm font-bold"
                                title="Save"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRoom(null);
                                  setEditPrice('');
                                }}
                                className="bg-red-600 text-white hover:bg-red-800 px-3 py-1 rounded text-sm font-bold"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold text-green-600">
                                ${directPrice}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {editingRoom === roomId ? null : (
                            <button
                              onClick={() => {
                                setEditingRoom(roomId);
                                setEditPrice(displayRate.toString());
                              }}
                              className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                              title="Edit price"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Strategy Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Pricing Strategy</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Uses Sunday-Tuesday rates as baseline (most stable pricing)</li>
                <li>• Direct booking rate = 10% below Airbnb average</li>
                <li>• Last-minute bookings (≤3 days) get 15% discount</li>
                <li>• Updates can be refreshed manually or scheduled weekly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
