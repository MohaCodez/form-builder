import { BarChart3, Users, FileText } from 'lucide-react';

const stats = [
  { name: 'Total Forms', value: '12', icon: FileText, change: '+2.1%', changeType: 'positive' },
  { name: 'Active Users', value: '320', icon: Users, change: '+10.5%', changeType: 'positive' },
  { name: 'Form Submissions', value: '1,429', icon: BarChart3, change: '+4.75%', changeType: 'positive' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Welcome back! Here's an overview of your form management system.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
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
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Forms
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Your recent forms will appear here
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Submissions
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Your recent form submissions will appear here
          </div>
        </div>
      </div>
    </div>
  );
}