import { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserForms } from '../../lib/forms';
import { Form } from '../../types/form';
import { FormCard } from '../forms/FormCard';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  activeUsers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    totalResponses: 0,
    activeUsers: 0,
  });
  const [recentForms, setRecentForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const forms = await getUserForms(user.uid);
        
        setRecentForms(forms.slice(0, 3));
        setStats({
          totalForms: forms.length,
          totalResponses: forms.reduce((acc, form) => acc + (form.responses?.length || 0), 0),
          activeUsers: 1, // Currently only showing the active user
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const stats_display = [
    { 
      name: 'Total Forms', 
      value: stats.totalForms, 
      icon: FileText,
      change: '+2.1%', 
      changeType: 'positive' as const
    },
    { 
      name: 'Form Submissions', 
      value: stats.totalResponses, 
      icon: BarChart3,
      change: '+4.75%', 
      changeType: 'positive' as const
    },
    { 
      name: 'Active Users', 
      value: stats.activeUsers, 
      icon: Users,
      change: '0%', 
      changeType: 'neutral' as const
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Welcome back! Here's an overview of your form management system.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats_display.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {stat.value.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                <div className="text-sm">
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : stat.changeType === 'negative'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400"> from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Forms
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/forms')}
            >
              View all
            </Button>
          </div>
          
          {recentForms.length === 0 ? (
            <div className="text-center py-6">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No forms</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new form
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/forms/new')}
                >
                  Create Form
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onDelete={async () => {
                    // Refresh dashboard data after deletion
                    const forms = await getUserForms(user!.uid);
                    setRecentForms(forms.slice(0, 3));
                    setStats(prev => ({
                      ...prev,
                      totalForms: forms.length
                    }));
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats.totalResponses === 0 ? (
              <div className="text-center py-6">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No recent activity
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Activity will appear here once you start receiving form submissions
                </p>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Recent form submissions will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}