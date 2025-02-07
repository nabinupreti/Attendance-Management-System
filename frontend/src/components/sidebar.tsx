import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Home, Users, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Classes', href: '/classes', icon: BookOpen },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // await logout()
    // Use navigate from react-router-dom to navigate to login page
    navigate('/login/admin');
  };

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Attendance System</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <LinkIcon className="mr-3 h-5 w-5" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
      <Button onClick={handleLogout} className="mt-auto">
        <LogOut className="mr-2 h-5 w-5" />
        Logout
      </Button>
    </div>
  );
}

