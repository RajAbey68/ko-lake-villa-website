import { ProtectedRoute } from '../../components/ProtectedRoute';
import AdminDashboardContent from './Dashboard';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}