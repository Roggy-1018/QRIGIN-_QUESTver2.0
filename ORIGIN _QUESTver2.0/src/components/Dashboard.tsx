import React from 'react';
import { TrendingUp, Users, Target, Clock, CheckCircle, AlertCircle, BarChart3, ArrowUpRight } from 'lucide-react';
import { storageService } from '../utils/storage';

const Dashboard = () => {
  // Get data from storage for dashboard stats
  const motivationPoints = storageService.getMotivationPoints();
  const skillScores = storageService.getSkillScores();
  const businessPlan = storageService.getBusinessPlan();
  
  // Calculate dynamic stats
  const completedTasks = motivationPoints.length + Object.keys(skillScores).length + (businessPlan ? 1 : 0);
  const totalTasks = 18; // This could be made dynamic based on actual requirements
  
  const averageSkillScore = Object.keys(skillScores).length > 0 
    ? Math.round(Object.values(skillScores).reduce((sum, score) => sum + score, 0) / Object.keys(skillScores).length * 10) / 10
    : 0;

  const stats = [
    {
      title: '現在のフェーズ',
      value: 'G1',
      subtitle: 'アイデア検証',
      icon: Target,
      color: 'blue',
      change: '+1',
      changeType: 'positive'
    },
    {
      title: '完了タスク',
      value: completedTasks.toString(),
      subtitle: `/ ${totalTasks} タスク`,
      icon: CheckCircle,
      color: 'green',
      change: `+${Math.min(completedTasks, 3)}`,
      changeType: 'positive'
    },
    {
      title: '実行スコア',
      value: averageSkillScore.toString(),
      subtitle: '/ 100 点',
      icon: TrendingUp,
      color: 'purple',
      change: averageSkillScore > 0 ? `+${Math.round(averageSkillScore/10)}` : '0',
      changeType: 'positive'
    },
    {
      title: '経過日数',
      value: (() => {
        const userData = storageService.getUserData();
        if (!userData) return '0';
        const createdAt = new Date(userData.profile.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays.toString();
      })(),
      subtitle: '日',
      icon: Clock,
      color: 'orange',
      change: '+1',
      changeType: 'neutral'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'task', title: `モチベーショングラフ作成 (${motivationPoints.length}件)`, time: '最近', status: motivationPoints.length > 0 ? 'completed' : 'pending' },
    { id: 2, type: 'assessment', title: `スキルアセスメント (${Object.keys(skillScores).length}/28項目)`, time: '最近', status: Object.keys(skillScores).length > 0 ? 'completed' : 'pending' },
    { id: 3, type: 'planning', title: '収益モデル作成中', time: '1日前', status: 'in_progress' },
    { id: 4, type: 'research', title: '競合分析レポート作成', time: '2日前', status: 'pending' }
  ];

  const upcomingTasks = [
    { id: 1, title: 'MVPプロトタイプ設計', deadline: '2024年2月15日', priority: 'high' },
    { id: 2, title: 'ユーザーインタビュー実施', deadline: '2024年2月18日', priority: 'medium' },
    { id: 3, title: '財務モデル精緻化', deadline: '2024年2月20日', priority: 'high' },
    { id: 4, title: 'リーガルチェック', deadline: '2024年2月25日', priority: 'low' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.changeType === 'positive' && <ArrowUpRight className="h-4 w-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            最近のアクティビティ
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-green-400' :
                  activity.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            今後のタスク
          </h3>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    期限: {task.deadline}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          プロジェクト進捗
        </h3>
        <div className="space-y-4">
          {['G0: 課題発見', 'G1: アイデア検証', 'G2: MVP開発', 'G3: 市場投入', 'G4: スケール'].map((phase, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                {phase}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === 0 ? 'bg-green-500 w-full' :
                    index === 1 ? 'bg-blue-500 w-2/3' :
                    'bg-gray-300 w-0'
                  }`}
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {index === 0 ? '100%' : index === 1 ? '67%' : '0%'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;