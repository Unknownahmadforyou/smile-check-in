
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Check, User, Users } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold gradient-text">SmileCheck</h2>
          <p className="text-sm text-gray-500 mt-1">Face Recognition Attendance</p>
        </div>
        <Separator />
        <div className="flex-1 py-6">
          <nav className="px-4 space-y-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/') ? 'bg-attendance-primary' : ''}`}
              >
                <User className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant={isActive('/register') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/register') ? 'bg-attendance-primary' : ''}`}
              >
                <Users className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
            <Link to="/scan">
              <Button
                variant={isActive('/scan') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/scan') ? 'bg-attendance-primary' : ''}`}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/dashboard') ? 'bg-attendance-primary' : ''}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">© 2025 SmileCheck</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile header */}
        <div className="md:hidden bg-white p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg font-bold gradient-text">SmileCheck</h2>
          <div className="flex space-x-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className={isActive('/') ? 'bg-attendance-light text-attendance-dark' : ''}>
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" size="icon" className={isActive('/register') ? 'bg-attendance-light text-attendance-dark' : ''}>
                <Users className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/scan">
              <Button variant="ghost" size="icon" className={isActive('/scan') ? 'bg-attendance-light text-attendance-dark' : ''}>
                <Check className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className={isActive('/dashboard') ? 'bg-attendance-light text-attendance-dark' : ''}>
                <Calendar className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
