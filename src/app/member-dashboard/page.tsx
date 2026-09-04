import React from 'react';
import DashboardLayout from '@/app/member-dashboard/components/DashboardLayout';
import DashboardGuard from '@/app/member-dashboard/components/DashboardGuard';

export default function MemberDashboardPage() {
  return (
    <DashboardGuard>
      <DashboardLayout />
    </DashboardGuard>
  );
}
