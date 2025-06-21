import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Phone, AlertTriangle } from 'lucide-react';

export default function StaffProtectionRules() {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Shield className="w-5 h-5" />
          Staff Protection Policy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="staff-rules" data-staff-rules className="space-y-4">
          {/* This content will be populated by global-fixes.js */}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Zero Tolerance</p>
              <p className="text-sm text-red-700">Harassment results in immediate removal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Emergency Contact</p>
              <p className="text-sm text-blue-700">+94 77 123 4567</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}