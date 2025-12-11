/**
 * Export Service - Generates CSV and XLSX files for data export
 */

// CSV Generation
export function generateCSV(data: Record<string, any>[], columns: { key: string; header: string }[]): string {
  if (data.length === 0) return '';

  // Header row
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  // Data rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      if (value === null || value === undefined) return '""';
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      if (value instanceof Date) return `"${value.toISOString()}"`;
      return `"${value}"`;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}

// Export Users
export function exportUsersToCSV(users: any[]): string {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rol' },
    { key: 'fwiScore', header: 'FWI Score' },
    { key: 'treePoints', header: 'TreePoints' },
    { key: 'level', header: 'Nivel' },
    { key: 'departmentId', header: 'Departamento ID' },
    { key: 'monthlyIncome', header: 'Ingreso Mensual' },
    { key: 'createdAt', header: 'Fecha Registro' },
    { key: 'lastSignedIn', header: 'Último Acceso' },
  ];
  
  const formattedData = users.map(u => ({
    ...u,
    monthlyIncome: u.monthlyIncome ? (u.monthlyIncome / 100).toFixed(2) : '0',
    createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-MX') : '',
    lastSignedIn: u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleDateString('es-MX') : '',
  }));
  
  return generateCSV(formattedData, columns);
}

// Export Transactions
export function exportTransactionsToCSV(transactions: any[]): string {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Usuario ID' },
    { key: 'amount', header: 'Monto' },
    { key: 'category', header: 'Categoría' },
    { key: 'merchant', header: 'Comercio' },
    { key: 'description', header: 'Descripción' },
    { key: 'transactionDate', header: 'Fecha' },
    { key: 'createdAt', header: 'Fecha Registro' },
  ];
  
  const formattedData = transactions.map(t => ({
    ...t,
    amount: (t.amount / 100).toFixed(2),
    transactionDate: t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('es-MX') : '',
    createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString('es-MX') : '',
  }));
  
  return generateCSV(formattedData, columns);
}

// Export EWA Requests
export function exportEwaRequestsToCSV(requests: any[]): string {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Usuario ID' },
    { key: 'amount', header: 'Monto' },
    { key: 'fee', header: 'Comisión' },
    { key: 'status', header: 'Estado' },
    { key: 'rejectionReason', header: 'Razón Rechazo' },
    { key: 'approvedBy', header: 'Aprobado Por' },
    { key: 'createdAt', header: 'Fecha Solicitud' },
    { key: 'disbursedAt', header: 'Fecha Desembolso' },
  ];
  
  const formattedData = requests.map(r => ({
    ...r,
    amount: (r.amount / 100).toFixed(2),
    fee: (r.fee / 100).toFixed(2),
    createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-MX') : '',
    disbursedAt: r.disbursedAt ? new Date(r.disbursedAt).toLocaleDateString('es-MX') : '',
  }));
  
  return generateCSV(formattedData, columns);
}

// Export TreePoints Transactions
export function exportTreePointsToCSV(transactions: any[]): string {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Usuario ID' },
    { key: 'userName', header: 'Usuario' },
    { key: 'amount', header: 'Puntos' },
    { key: 'type', header: 'Tipo' },
    { key: 'reason', header: 'Razón' },
    { key: 'createdAt', header: 'Fecha' },
  ];
  
  const formattedData = transactions.map(t => ({
    ...t,
    createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString('es-MX') : '',
  }));
  
  return generateCSV(formattedData, columns);
}

// Export Department Metrics
export function exportDepartmentMetricsToCSV(departments: any[]): string {
  const columns = [
    { key: 'name', header: 'Departamento' },
    { key: 'employeeCount', header: 'Empleados' },
    { key: 'avgFwiScore', header: 'FWI Promedio' },
    { key: 'totalTreePoints', header: 'TreePoints Total' },
    { key: 'ewaRequestCount', header: 'Solicitudes EWA' },
    { key: 'riskLevel', header: 'Nivel de Riesgo' },
  ];
  
  return generateCSV(departments, columns);
}

// Export Financial Goals
export function exportGoalsToCSV(goals: any[]): string {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Usuario ID' },
    { key: 'name', header: 'Meta' },
    { key: 'targetAmount', header: 'Objetivo' },
    { key: 'currentAmount', header: 'Actual' },
    { key: 'progress', header: 'Progreso %' },
    { key: 'deadline', header: 'Fecha Límite' },
    { key: 'isCompleted', header: 'Completada' },
    { key: 'createdAt', header: 'Fecha Creación' },
  ];
  
  const formattedData = goals.map(g => ({
    ...g,
    targetAmount: (g.targetAmount / 100).toFixed(2),
    currentAmount: (g.currentAmount / 100).toFixed(2),
    progress: g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(1) : '0',
    deadline: g.deadline ? new Date(g.deadline).toLocaleDateString('es-MX') : '',
    isCompleted: g.isCompleted ? 'Sí' : 'No',
    createdAt: g.createdAt ? new Date(g.createdAt).toLocaleDateString('es-MX') : '',
  }));
  
  return generateCSV(formattedData, columns);
}

// Export Notifications Summary
export function exportNotificationsSummaryToCSV(data: any[]): string {
  const columns = [
    { key: 'type', header: 'Tipo' },
    { key: 'count', header: 'Cantidad' },
    { key: 'readCount', header: 'Leídas' },
    { key: 'unreadCount', header: 'No Leídas' },
  ];
  
  return generateCSV(data, columns);
}
