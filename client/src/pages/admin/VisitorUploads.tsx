
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AdminNavigation from '@/components/AdminNavigation';
import { 
  ImageIcon, 
  CheckIcon, 
  XIcon, 
  EyeIcon,
  SendIcon,
  ClockIcon,
  UserIcon
} from 'lucide-react';

interface VisitorUpload {
  id: number;
  imageUrl: string;
  alt: string;
  description?: string;
  tags?: string;
  category: string;
  mediaType: string;
  fileSize: number;
  uploaderName: string;
  uploaderEmail?: string;
  uploaderPhone?: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export default function VisitorUploads() {
  const [selectedUpload, setSelectedUpload] = useState<VisitorUpload | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'publish' | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: uploads = [], isLoading } = useQuery<VisitorUpload[]>({
    queryKey: ['/api/visitor-uploads'],
    queryFn: async () => {
      const response = await fetch('/api/visitor-uploads');
      if (!response.ok) throw new Error('Failed to fetch uploads');
      return response.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const response = await fetch(`/api/visitor-uploads/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (!response.ok) throw new Error('Failed to approve upload');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitor-uploads'] });
      setSelectedUpload(null);
      setModeratorNotes('');
      toast({ title: "Upload approved successfully" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const response = await fetch(`/api/visitor-uploads/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (!response.ok) throw new Error('Failed to reject upload');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitor-uploads'] });
      setSelectedUpload(null);
      setModeratorNotes('');
      toast({ title: "Upload rejected" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/visitor-uploads/${id}/publish`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to publish upload');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitor-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setSelectedUpload(null);
      toast({ title: "Upload published to gallery!" });
    },
  });

  const handleAction = (upload: VisitorUpload, action: 'approve' | 'reject' | 'publish') => {
    setSelectedUpload(upload);
    setActionType(action);
    setModeratorNotes('');
  };

  const executeAction = () => {
    if (!selectedUpload || !actionType) return;

    if (actionType === 'approve') {
      approveMutation.mutate({ id: selectedUpload.id, notes: moderatorNotes });
    } else if (actionType === 'reject') {
      rejectMutation.mutate({ id: selectedUpload.id, notes: moderatorNotes });
    } else if (actionType === 'publish') {
      publishMutation.mutate(selectedUpload.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><ClockIcon className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckIcon className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800"><XIcon className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation title="Visitor Uploads" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#8B5E3C]">Visitor Uploads</h1>
              <p className="text-gray-600 mt-2">Review and moderate user-submitted content</p>
            </div>
          </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">{uploads.filter(u => u.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{uploads.filter(u => u.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Uploads</p>
                <p className="text-2xl font-bold">{uploads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uploads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads.map((upload) => (
          <Card key={upload.id} className="overflow-hidden">
            <div className="relative aspect-square">
              {upload.mediaType === 'video' ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                >
                  <source src={upload.imageUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={upload.imageUrl}
                  alt={upload.alt}
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute top-2 left-2">
                {getStatusBadge(upload.status)}
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-[#8B5E3C] mb-2 line-clamp-2">{upload.alt}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Category:</strong> {upload.category}</p>
                <p><strong>Uploader:</strong> {upload.uploaderName}</p>
                {upload.uploaderEmail && <p><strong>Email:</strong> {upload.uploaderEmail}</p>}
                <p><strong>Size:</strong> {formatFileSize(upload.fileSize)}</p>
                <p><strong>Uploaded:</strong> {new Date(upload.createdAt).toLocaleDateString()}</p>
                
                {upload.description && (
                  <p className="line-clamp-2"><strong>Description:</strong> {upload.description}</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {upload.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction(upload, 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(upload, 'reject')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                
                {upload.status === 'approved' && (
                  <Button
                    size="sm"
                    onClick={() => handleAction(upload, 'publish')}
                    className="bg-[#FF914D] hover:bg-[#8B5E3C]"
                  >
                    <SendIcon className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                )}
              </div>

              {upload.moderatorNotes && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Notes:</strong> {upload.moderatorNotes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {uploads.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No visitor uploads yet</p>
        </div>
      )}

      {/* Action Dialog */}
      {selectedUpload && actionType && (
        <Dialog open={true} onOpenChange={() => setSelectedUpload(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' && 'Approve Upload'}
                {actionType === 'reject' && 'Reject Upload'}
                {actionType === 'publish' && 'Publish to Gallery'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <img
                  src={selectedUpload.imageUrl}
                  alt={selectedUpload.alt}
                  className="w-full h-48 object-cover rounded"
                />
              </div>

              <div>
                <p><strong>Title:</strong> {selectedUpload.alt}</p>
                <p><strong>Category:</strong> {selectedUpload.category}</p>
                <p><strong>Uploader:</strong> {selectedUpload.uploaderName}</p>
              </div>

              {(actionType === 'approve' || actionType === 'reject') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Moderator Notes {actionType === 'reject' && <span className="text-red-500">*</span>}
                  </label>
                  <Textarea
                    value={moderatorNotes}
                    onChange={(e) => setModeratorNotes(e.target.value)}
                    placeholder={
                      actionType === 'approve' 
                        ? "Optional notes for the uploader..."
                        : "Please provide a reason for rejection..."
                    }
                    rows={3}
                  />
                </div>
              )}

              {actionType === 'publish' && (
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    This will add the upload to the main gallery and make it visible to all visitors.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUpload(null)}>
                Cancel
              </Button>
              <Button 
                onClick={executeAction}
                disabled={
                  (actionType === 'reject' && !moderatorNotes.trim()) ||
                  approveMutation.isPending || 
                  rejectMutation.isPending || 
                  publishMutation.isPending
                }
                className={
                  actionType === 'approve' ? "bg-green-600 hover:bg-green-700" :
                  actionType === 'reject' ? "bg-red-600 hover:bg-red-700" :
                  "bg-[#FF914D] hover:bg-[#8B5E3C]"
                }
              >
                {actionType === 'approve' && 'Approve'}
                {actionType === 'reject' && 'Reject'}
                {actionType === 'publish' && 'Publish'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
        </div>
      </div>
    </div>
  );
}
