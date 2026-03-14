import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import PetsList from './pages/PetsList';
import PetRegistration from './pages/PetRegistration';
import Scheduling from './pages/Scheduling';
import BottomNav from './components/BottomNav';
import Profile from './pages/Profile';

const ProtectedRoute = () => {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => setSession(s)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // Loading
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

const MainLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <Router basename="/app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes without BottomNav */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pets/new" element={<PetRegistration />} />
        </Route>

        {/* Protected Routes with BottomNav */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pets" element={<PetsList />} />
            <Route path="/schedule" element={<Scheduling />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
