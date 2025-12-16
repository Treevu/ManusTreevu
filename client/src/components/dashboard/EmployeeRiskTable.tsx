import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { AlertCircle, TrendingDown, TrendingUp, Zap } from 'lucide-react';

interface EmployeeRiskTableProps {
  metrics: any;
}

export default function EmployeeRiskTable({ metrics }: EmployeeRiskTableProps) {
  // Mock data - in production this would come from the API
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      fwiScore: 28,
      churnRisk: 0.82,
      riskLevel: 'critical',
      lastActivity: '2 days ago',
      interventions: 1,
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@company.com',
      fwiScore: 35,
      churnRisk: 0.75,
      riskLevel: 'high',
      lastActivity: '5 hours ago',
      interventions: 2,
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@company.com',
      fwiScore: 42,
      churnRisk: 0.68,
      riskLevel: 'high',
      lastActivity: '1 day ago',
      interventions: 0,
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.w@company.com',
      fwiScore: 38,
      churnRisk: 0.71,
      riskLevel: 'high',
      lastActivity: '3 hours ago',
      interventions: 1,
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@company.com',
      fwiScore: 32,
      churnRisk: 0.79,
      riskLevel: 'critical',
      lastActivity: '4 days ago',
      interventions: 3,
    },
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 0.75) return 'bg-red-100 text-red-800';
    if (risk >= 0.6) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getFwiColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">Employee</TableHead>
              <TableHead className="text-center font-semibold">FWI Score</TableHead>
              <TableHead className="text-center font-semibold">Churn Risk</TableHead>
              <TableHead className="text-center font-semibold">Risk Level</TableHead>
              <TableHead className="text-center font-semibold">Interventions</TableHead>
              <TableHead className="text-center font-semibold">Last Activity</TableHead>
              <TableHead className="text-center font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-slate-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">{employee.name}</p>
                    <p className="text-xs text-slate-600">{employee.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`font-bold ${getFwiColor(employee.fwiScore)}`}>
                    {employee.fwiScore}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold">{(employee.churnRisk * 100).toFixed(0)}%</span>
                    {employee.churnRisk > 0.7 ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getRiskColor(employee.churnRisk)}>
                    {employee.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium text-slate-900">{employee.interventions}</span>
                </TableCell>
                <TableCell className="text-center text-sm text-slate-600">
                  {employee.lastActivity}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Intervene
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="font-medium text-red-900">Critical Risk</p>
          </div>
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-xs text-red-700 mt-1">Require immediate action</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <p className="font-medium text-orange-900">High Risk</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">3</p>
          <p className="text-xs text-orange-700 mt-1">Monitoring closely</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <p className="font-medium text-blue-900">Active Interventions</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">7</p>
          <p className="text-xs text-blue-700 mt-1">Currently in progress</p>
        </div>
      </div>
    </div>
  );
}
