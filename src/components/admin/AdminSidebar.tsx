
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Worker Approvals',
      path: '/admin/worker-approvals',
      icon: <User className="h-5 w-5" />
    },
    {
      name: 'Notifications',
      path: '/admin/notifications',
      icon: <Bell className="h-5 w-5" />
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="h-full w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-primary">QuickFix Admin</h1>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Link
          to="/login"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
