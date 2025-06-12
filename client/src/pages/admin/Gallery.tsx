
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GalleryManager from '@/components/GalleryManager';

export default function AdminGallery() {
  return (
    <div className="space-y-6 min-h-screen overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <ErrorBoundary>
        <GalleryManager />
      </ErrorBoundary>
    </div>
  );
}
