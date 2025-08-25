import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, FileText, Users, TrendingUp, Target, Rocket } from 'lucide-react';

const ProcessTimeline = () => {
  const [selectedGate, setSelectedGate] = useState(null);

  const gates = [
    {
      id: 'G0',
      title: '課題発見',
      subtitle: 'Problem Discovery',
      status: 'completed',
      icon: Target,
      color: 'green',
      description: '市場の課題や個人の原体験から事業機会を発見するフェーズ',
      criteria: ['明確な課題設定', '対象ユーザーの特定', 'なぜ自分がやるのかの言語化'],
      tasks: [
        { id: 1, title: 'Why Me ジェネレーター完了', completed: true },
        { id: 2, title: '課題ヒアリング（5名以上）', completed: true },
        { id: 3, title: 'ペルソナ設定', completed: true }
      ]
    },
    {
      id: 'G1',
      title: 'アイデア検証',
      subtitle: 'Idea Validation',
      status: 'current',
      icon: FileText,
      color: 'blue',
      description: 'アイデアの市場性と実現可能性を検証するフェーズ',
      criteria: ['競合分析完了', 'バリュープロポジション確立', '初期MVPコンセプト'],
      tasks: [
        { id: 1, title: '競合分析レポート作成', completed: true },
        { id: 2, title: 'バリュープロポジションキャンバス', completed: true },
        { id: 3, title: 'ユーザーインタビュー（10名）', completed: false },
        { id: 4, title: 'MVPコンセプト設計', completed: false }
      ]
    },
    {
      id: 'G2',
      title: 'MVP開発',
      subtitle: 'MVP Development',
      status: 'pending',
      icon: Users,
      color: 'purple',
      description: '最小限の機能でプロダクトを開発し、初期ユーザーでテストするフェーズ',
      criteria: ['MVP完成', 'ユーザーテスト実施', 'PMF仮説検証'],
      tasks: [
        { id: 1, title: 'プロトタイプ開発', completed: false },
        { id: 2, title: 'ユーザーテスト（50名）', completed: false },
        { id: 3, title: 'フィードバック分析', completed: false }
      ]
    },
    {
      id: 'G3',
      title: '市場投入',
      subtitle: 'Market Entry',
      status: 'pending',
      icon: TrendingUp,
      color: 'orange',
      description: 'プロダクトを市場に投入し、初期トラクションを獲得するフェーズ',
      criteria: ['ローンチ完了', 'トラクション獲得', '事業計画精緻化'],
      tasks: [
        { id: 1, title: 'Go-to-Market戦略策定', completed: false },
        { id: 2, title: 'マーケティング施策実行', completed: false },
        { id: 3, title: 'KPI管理体制構築', completed: false }
      ]
    },
    {
      id: 'G4',
      title: 'スケール',
      subtitle: 'Scale Up',
      status: 'pending',
      icon: Rocket,
      color: 'red',
      description: '事業を拡大し、持続可能な成長を実現するフェーズ',
      criteria: ['安定収益確保', 'チーム拡大', '次ラウンド調達準備'],
      tasks: [
        { id: 1, title: '組織体制強化', completed: false },
        { id: 2, title: '資金調達準備', completed: false },
        { id: 3, title: 'スケール戦略策定', completed: false }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'current':
        return <div className="h-8 w-8 rounded-full bg-blue-500 border-4 border-blue-200 animate-pulse" />;
      default:
        return <Circle className="h-8 w-8 text-gray-300" />;
    }
  };

  const generatePrompt = (gate) => {
    const prompts = {
      G0: `# 課題発見フェーズのタスク支援プロンプト

あなたは新規事業創出の専門アドバイザーです。以下の観点で${gate.title}フェーズのタスク実行をサポートしてください：

## 現在のフェーズ: ${gate.title}
${gate.description}

## 次に実行すべきタスク:
${gate.tasks.filter(t => !t.completed).map(t => `- ${t.title}`).join('\n')}

具体的なアクションプランと実行手順を提示してください。`,
      G1: `# アイデア検証フェーズのタスク支援プロンプト

あなたは新規事業創出の専門アドバイザーです。以下の観点で${gate.title}フェーズのタスク実行をサポートしてください：

## 現在のフェーズ: ${gate.title}
${gate.description}

## 次に実行すべきタスク:
${gate.tasks.filter(t => !t.completed).map(t => `- ${t.title}`).join('\n')}

市場検証の手法と具体的な実行プランを提示してください。`
    };
    
    return prompts[gate.id] || `${gate.title}フェーズのタスク実行をサポートするプロンプトを生成しました。`;
  };

  return (
    <div className="space-y-8">
      {/* Timeline Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          事業創出プロセス
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          G0からG4まで、5つのGateを通じて新規事業を段階的に創出
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
        
        <div className="space-y-8">
          {gates.map((gate, index) => {
            const Icon = gate.icon;
            return (
              <div key={gate.id} className="relative flex items-start space-x-6">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {getStatusIcon(gate.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div 
                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                      selectedGate === gate.id 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedGate(selectedGate === gate.id ? null : gate.id)}
                  >
                    {/* Gate Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${gate.color}-100 dark:bg-${gate.color}-900/20`}>
                          <Icon className={`h-5 w-5 text-${gate.color}-600 dark:text-${gate.color}-400`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {gate.id}: {gate.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {gate.subtitle}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          gate.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          gate.status === 'current' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {gate.status === 'completed' ? '完了' : gate.status === 'current' ? '進行中' : '未開始'}
                        </span>
                        
                        {gate.status === 'current' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(generatePrompt(gate));
                              // Show toast notification
                              const toast = document.createElement('div');
                              toast.textContent = 'プロンプトをコピーしました';
                              toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
                              document.body.appendChild(toast);
                              setTimeout(() => document.body.removeChild(toast), 2000);
                            }}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            AIプロンプト
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {gate.description}
                    </p>
                    
                    {/* Progress */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-${gate.color}-500 transition-all duration-300`}
                          style={{
                            width: `${(gate.tasks.filter(t => t.completed).length / gate.tasks.length) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {gate.tasks.filter(t => t.completed).length}/{gate.tasks.length}
                      </span>
                    </div>
                    
                    {/* Expanded Content */}
                    {selectedGate === gate.id && (
                      <div className="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        {/* Criteria */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            クリア条件
                          </h4>
                          <ul className="space-y-1">
                            {gate.criteria.map((criterion, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Tasks */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            タスク一覧
                          </h4>
                          <div className="space-y-2">
                            {gate.tasks.map((task) => (
                              <div key={task.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {task.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={`text-sm ${
                                  task.completed 
                                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessTimeline;