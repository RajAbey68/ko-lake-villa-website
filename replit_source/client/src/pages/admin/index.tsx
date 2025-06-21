import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  useEffect(() => {
    document.title = "Admin Dashboard - Ko Lake Villa";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ko Lake Villa Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Gallery Management</h3>
            <p className="text-gray-600 mb-4">Manage property images and videos</p>
            <Link href="/admin/gallery" className="btn-palm">Manage Gallery</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage reservations</p>
            <Link href="/admin/bookings" className="btn-palm">View Bookings</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">Performance and visitor insights</p>
            <Link href="/admin/analytics" className="btn-palm">View Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}