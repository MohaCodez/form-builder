import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import FormBuilder from './components/form-builder/FormBuilder';
import FormList from './components/forms/FormList';
import FormResponses from './components/forms/FormResponses';
import FormPreviewPage from './components/forms/FormPreviewPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import PublicForm from './components/forms/PublicForm';
import FormSubmissions from './components/submissions/FormSubmissions';
import SubmissionDetails from './components/submissions/SubmissionDetails';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="forms">
                <Route index element={<FormList />} />
                <Route path="new" element={<FormBuilder />} />
                <Route path=":formId">
                  <Route index element={<FormResponses />} />
                  <Route path="edit" element={<FormBuilder />} />
                  <Route path="preview" element={<FormPreviewPage />} />
                </Route>
              </Route>
              <Route path="submissions">
                <Route index element={<FormSubmissions />} />
                <Route path=":responseId" element={<SubmissionDetails />} />
              </Route>
              <Route path="users" element={<div>User Management (Coming soon)</div>} />
              <Route path="settings" element={<div>Settings (Coming soon)</div>} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="/f/:formId" element={<PublicForm />} />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;