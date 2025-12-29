import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function MerchantLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path 
    ? "border-b-2 border-[#7bc144] text-gray-900" 
    : "text-gray-500 hover:text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex-shrink-0 flex items-center">
                <img 
                  className="h-8 w-auto" 
                  src={logo} 
                  alt="Company Logo" 
                />
                
                <span className="ml-3 text-xl font-bold text-gray-800">ReturnWiz</span>
              </div>
                <span className="text-xl font-bold text-gray-800">ReturnWiz</span>
                
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/dashboard')}`}>
                  Oversigt
                </Link>
                <Link to="/settings" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/settings')}`}>
                  Indstillinger
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Logget ind som: <strong>{user?.name}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Log ud
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet /> {/* Her indsættes siderne (Dashboard/Settings) */}
      </main>
    </div>
  );
}