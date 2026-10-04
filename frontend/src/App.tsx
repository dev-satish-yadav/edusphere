import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { TenantLogin } from './pages/auth/TenantLogin';
import { CreateSuperAdmin } from './pages/auth/CreateSuperAdmin';
import { SuperAdminLayout } from './components/layouts/SuperAdminLayout';
import { TenantLayout } from './components/layouts/TenantLayout';
import { TenantDashboard } from './pages/tenant/Dashboard';
import { TenantTeachers } from './pages/tenant/TenantTeachers';
import { TenantStudents } from './pages/tenant/TenantStudents';
import { AdminList } from './pages/superadmin/AdminList';
import { CreateAdmin } from './pages/superadmin/CreateAdmin';
import { InstitutionList } from './pages/superadmin/InstitutionList';
import { CreateInstitution } from './pages/superadmin/CreateInstitution';
import { InstitutionDetail } from './pages/superadmin/InstitutionDetail';
import { useAuthStore } from './store/auth.store';
import { getTenantSlug } from './utils/tenant';

const queryClient = new QueryClient();

function App() {
  const { user } = useAuthStore();
  const tenantSlug = getTenantSlug();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {tenantSlug ? (
            // === SUBDOMAIN (TENANT) ROUTING ===
            <>
              <Route path="/login" element={<TenantLogin />} />
              <Route path="/unauthorized" element={<div className="p-12 text-center text-red-600 font-bold">Unauthorized Access</div>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={
                <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']}>
                  <TenantLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<TenantDashboard />} />
                <Route path="teachers" element={<TenantTeachers />} />
                <Route path="students" element={<TenantStudents />} />
                <Route path="classes" element={<div className="p-8">Classes Module Coming Soon</div>} />
                <Route path="exams" element={<div className="p-8">Exams Module Coming Soon</div>} />
                <Route path="settings" element={<div className="p-8">Settings Module Coming Soon</div>} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            // === MAIN DOMAIN (SUPER ADMIN) ROUTING ===
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/create-super-admin" element={<CreateSuperAdmin />} />
              <Route path="/unauthorized" element={<div className="p-12 text-center text-red-600 font-bold">Unauthorized Access</div>} />
              <Route element={<ProtectedRoute />}>
                {user?.role === 'superadmin' ? (
                  <Route path="/" element={<SuperAdminLayout />}>
                    <Route index element={<Navigate to="/institutions" replace />} />
                    <Route path="institutions" element={<InstitutionList />} />
                    <Route path="institutions/create" element={<CreateInstitution />} />
                    <Route path="institutions/:id" element={<InstitutionDetail />} />
                    <Route path="admins" element={<AdminList />} />
                    <Route path="admins/create" element={<CreateAdmin />} />
                  </Route>
                ) : (
                  <Route path="/" element={<Navigate to="/login" replace />} />
                )}
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
