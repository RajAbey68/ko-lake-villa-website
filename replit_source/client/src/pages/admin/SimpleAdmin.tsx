
import { useState } from 'react';
import SimpleGalleryUpload from '../../components/SimpleGalleryUpload';
import SimpleGalleryView from '../../components/SimpleGalleryView';

export default function SimpleAdmin() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-[#8B5E3C]">Ko Lake Villa - Admin</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SimpleGalleryUpload onSuccess={handleUploadSuccess} />
          </div>
          <div className="lg:col-span-2">
            <SimpleGalleryView key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
