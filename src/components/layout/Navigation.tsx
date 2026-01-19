import { Link, useLocation } from 'react-router-dom';
import { Map, Compass, BookOpen, Settings } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Map },
  { name: 'Quests', href: '/quests', icon: Compass },
  { name: 'Discoveries', href: '/discoveries', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 z-50">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  'flex flex-col items-center py-3 px-4 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-forest-700'
                    : 'text-earth-500 hover:text-earth-700'
                )}
              >
                <Icon className="h-6 w-6 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop top navigation */}
      <nav className="hidden md:block bg-white border-b border-earth-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-serif font-bold text-forest-800">
                  Explorer's Log
                </h1>
              </div>
              <div className="ml-10 flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        'inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                        isActive
                          ? 'border-forest-600 text-forest-700'
                          : 'border-transparent text-earth-600 hover:text-earth-900 hover:border-earth-300'
                      )}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
