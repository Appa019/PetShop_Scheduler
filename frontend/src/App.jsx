import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import PetsList from './pages/PetsList';
import PetRegistration from './pages/PetRegistration';
import Scheduling from './pages/Scheduling';
import BottomNav from './components/BottomNav';
import Profile from './pages/Profile';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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
