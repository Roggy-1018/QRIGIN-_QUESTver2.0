import React, { useState } from 'react';
import { Lightbulb, Users, TrendingUp, Target, Search, BarChart3, Settings, User, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProcessTimeline from './components/ProcessTimeline';
import WhyMeGenerator from './components/WhyMeGenerator';
import SkillAssessment from './components/SkillAssessment';
import BusinessPlan from './components/BusinessPlan';
import MASearch from './components/MASearch';

const menuItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: BarChart3 },
  { id: 'process', label: 'プロセス', icon: Target },
  { id: 'whyme', label: 'Why Me', icon: User },
  { id: 'skills', label: 'スキル', icon: TrendingUp },
  { id: 'business', label: '事業計画', icon: Lightbulb },
  { id: 'ma', label: 'M&A検索', icon: Search },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'process':
        return <ProcessTimeline />;
      case 'whyme':
        return <WhyMeGenerator />;
      case 'skills':
        return <SkillAssessment />;
      case 'business':
        return <BusinessPlan />;
      case 'ma':
        return <MASearch />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <h1 className="text-xl font-bold text-white">ORIGIN QUEST</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-600 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h2 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white lg:ml-0">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;