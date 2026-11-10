/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { LandingAuthPage } from './components/Auth/LandingAuthPage';
import { StudentPortalLayout } from './components/StudentPortal/StudentPortalLayout';
import { AdminPortalLayout } from './components/AdminPortal/AdminPortalLayout';

function AppContent() {
  const { currentUser } = usePortal();

  // 1. Landing & Authentication (Dedicated first page with Student vs Admin role selector)
  if (!currentUser) {
    return <LandingAuthPage />;
  }

  // 2. Admin & Teacher View (Fully separated from Student View with interactive CRUD & pastel theme)
  if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
    return <AdminPortalLayout />;
  }

  // 3. Student View (Dedicated Student Portal with Navbar, Sidebar, 8 learning modules, & Etiquette modal)
  return <StudentPortalLayout />;
}

export default function App() {
  return (
    <PortalProvider>
      <AppContent />
    </PortalProvider>
  );
}
