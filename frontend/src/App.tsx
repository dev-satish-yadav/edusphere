import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { CreateSuperAdmin } from './pages/auth/CreateSuperAdmin';
import { SuperAdminLayout } from './components/layouts/SuperAdminLayout';
import { AdminList } from './pages/superadmin/AdminList';
import { InstitutionList } from './pages/superadmin/InstitutionList';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient();

function App() {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-super-admin" element={<CreateSuperAdmin />} />
          
          <Route element={<ProtectedRoute />}>
            {user?.role === 'superadmin' ? (
              <Route path="/" element={<SuperAdminLayout />}>
                <Route index element={<InstitutionList />} />
                <Route path="admins" element={<AdminList />} />
              </Route>
            ) : (
              <Route path="/" element={
                <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                  <div className="bg-white p-8 rounded shadow text-center">
                    <h1 className="text-xl font-bold mb-2">School Dashboard</h1>
                    <p className="text-gray-500">Coming soon for tenant users...</p>
                  </div>
                </div>
              } />
            )}
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
