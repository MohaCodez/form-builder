import { Bell, Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={toggleDarkMode}
          >
            <span className="sr-only">Toggle dark mode</span>
            {darkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-2">
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || '')}`}
                alt={user?.displayName || 'User avatar'}
              />
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.displayName || user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              icon={<LogOut className="h-4 w-4" />}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}