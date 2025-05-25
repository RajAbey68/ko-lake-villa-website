import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PricingData {
  updated: string;
  rates: {
    [roomId: string]: {
      sun: number;
      mon: number;
      tue: number;
    };
  };
}

export default function AdminCalendar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current pricing data
  const { data: pricing, isLoading } = useQuery<PricingData>({
    queryKey: ['/api/admin/pricing'],
  });

  // Refresh pricing mutation
  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/refresh-pricing'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing'] });
      toast({
        title: "Pricing Refreshed",
        description: "Airbnb rates have been updated successfully!",
      });
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
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Sunday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Monday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Tuesday</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Your Direct Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing && Object.entries(pricing.rates).map(([roomId, days]) => {
                    const avgRate = Math.round((days.sun + days.mon + days.tue) / 3);
                    const directRate = Math.round(avgRate * 0.9); // 10% discount
                    
                    return (
                      <tr key={roomId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {roomId.toUpperCase()}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${days.sun}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${days.mon}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          ${days.tue}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-bold text-green-600">
                          ${directRate}
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