import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AdminNavigation from '@/components/AdminNavigation';
import { 
  Shield, 
  Search, 
  Filter,
  Download,
  Clock,
  User,
  Settings,
  Eye
} from 'lucide-react';

interface AuditLog {
  id: number;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'partial';
}

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data: auditData, isLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs', page, limit, actionFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(actionFilter && { action: actionFilter }),
        ...(searchQuery && { adminEmail: searchQuery })
      });
      
      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    }
  });

  const getActionIcon = (action: string) => {
    if (action.includes('gallery')) return '🖼️';
    if (action.includes('content')) return '📝';
    if (action.includes('user')) return '👤';
    if (action.includes('settings')) return '⚙️';
    if (action.includes('login') || action.includes('logout')) return '🔐';
    return '📋';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    if (!auditData?.logs) return;
    
    const csv = [
      'Timestamp,Admin,Action,Resource,Status,IP Address',
      ...auditData.logs.map((log: AuditLog) => 
        `${log.timestamp},${log.adminEmail},${log.action},${log.resource},${log.status},${log.ipAddress}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation title="Audit Logs" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation title="Audit Logs" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#8B5E3C]">Admin Audit Logs</h1>
              <p className="text-gray-600 mt-2">Track all administrative actions and system changes</p>
            </div>
            <Button onClick={exportLogs} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Actions</p>
                    <p className="text-2xl font-bold">{auditData?.pagination?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-2xl font-bold">
                      {auditData?.logs?.filter((log: AuditLog) => 
                        new Date(log.timestamp).toDateString() === new Date().toDateString()
                      ).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Admins</p>
                    <p className="text-2xl font-bold">
                      {new Set(auditData?.logs?.map((log: AuditLog) => log.adminEmail)).size || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Settings className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Failed Actions</p>
                    <p className="text-2xl font-bold">
                      {auditData?.logs?.filter((log: AuditLog) => log.status === 'failed').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by admin email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Actions</SelectItem>
                      <SelectItem value="gallery">Gallery Actions</SelectItem>
                      <SelectItem value="content">Content Actions</SelectItem>
                      <SelectItem value="user">User Actions</SelectItem>
                      <SelectItem value="settings">Settings</SelectItem>
                      <SelectItem value="login">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-600">Timestamp</th>
                      <th className="text-left p-3 font-medium text-gray-600">Admin</th>
                      <th className="text-left p-3 font-medium text-gray-600">Action</th>
                      <th className="text-left p-3 font-medium text-gray-600">Resource</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                      <th className="text-left p-3 font-medium text-gray-600">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditData?.logs?.map((log: AuditLog) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-600">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center text-xs">
                              {log.adminEmail.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium">{log.adminEmail}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getActionIcon(log.action)}</span>
                            <span className="text-sm font-medium">{log.action}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="font-medium">{log.resource}</div>
                            {log.resourceId && (
                              <div className="text-gray-500 text-xs">ID: {log.resourceId}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {auditData?.pagination && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, auditData.pagination.total)} of {auditData.pagination.total} entries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= auditData.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}