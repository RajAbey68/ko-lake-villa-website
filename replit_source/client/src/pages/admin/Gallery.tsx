import { ErrorBoundary } from '@/components/ErrorBoundary';
import GalleryManager from '@/components/GalleryManager';
import AdminNavigation from '@/components/AdminNavigation';

export default function AdminGallery() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <div className="space-y-6 p-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <ErrorBoundary>
          <GalleryManager />
        </ErrorBoundary>
      </div>
    </div>
  );
}