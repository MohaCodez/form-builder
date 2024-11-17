import { Link, useLocation } from 'react-router-dom';
import { Layout, FileText, Users, Settings, X, InboxIcon, GitBranch } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Layout },
  { name: 'Forms', href: '/forms', icon: FileText },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Submissions', href: '/submissions', icon: InboxIcon },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-gray-900/80 lg:hidden',
          open ? 'block' : 'hidden'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 lg:block',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Form Builder
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-200"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col py-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold mx-2',
                      location.pathname === item.href
                        ? 'bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}