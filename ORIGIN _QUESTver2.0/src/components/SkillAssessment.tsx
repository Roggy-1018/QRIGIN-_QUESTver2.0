import React, { useState } from 'react';
import { TrendingUp, Star, BarChart3, Target, ChevronDown, ChevronUp, Info, X, HelpCircle } from 'lucide-react';
import { storageService } from '../utils/storage';

const SkillAssessment = () => {
  const [scores, setScores] = useState(() => {
    return storageService.getSkillScores();
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showScoreGuide, setShowScoreGuide] = useState(false);
  const [hoveredScore, setHoveredScore] = useState(null);

  const skillCategories = [
    {
      id: 'vision',
      title: 'ビジョン・戦略策定力',
      description: '事業の方向性を定め、戦略的思考で価値を創造する能力',
      color: 'blue',
      skills: [
        {
          id: 'Q1',
          ability: '事業機会の洞察',
          question: 'マクロ経済や業界動向を定期的に分析し、新たなビジネス機会を発見している。',
          category: 'vision'
        },
        {
          id: 'Q2',
          ability: '価値仮説設計',
          question: 'TAM/SAM/SOMを自ら試算し、事業の市場規模を根拠をもって提示できる。',
          category: 'vision'
        },
        {
          id: 'Q3',
          ability: '価値仮説設計',
          question: 'Lean Canvasを用いて、仮説→検証のフレームワークを自立的に作成できる。',
          category: 'vision'
        },
        {
          id: 'Q4',
          ability: '価値仮説設計',
          question: '他社との差別化ポイントを明確化し、文書化してステークホルダに説明できる。',
          category: 'vision'
        }
      ]
    },
    {
      id: 'discovery',
      title: '顧客発見・検証力',
      description: '顧客の真のニーズを発見し、仮説を検証する能力',
      color: 'green',
      skills: [
        {
          id: 'Q5',
          ability: '顧客インタビュー',
          question: 'ソリューションを未提示のまま、顧客課題を深掘りする対話ができる。',
          category: 'discovery'
        },
        {
          id: 'Q6',
          ability: '顧客インタビュー',
          question: '顧客の課題深刻度を0-10スケールで定量化し、その結果を報告に活用している。',
          category: 'discovery'
        },
        {
          id: 'Q7',
          ability: '仮説検証の実行',
          question: 'ペーパープロトタイプやNo-Codeツールを使ったMVPを短期間で構築した経験がある。',
          category: 'discovery'
        },
        {
          id: 'Q8',
          ability: '仮説検証の実行',
          question: 'MVPを用いて顧客テストを実施し、得られた学びを次の設計に反映している。',
          category: 'discovery'
        }
      ]
    },
    {
      id: 'agility',
      title: '実験・学習アジリティ',
      description: '高速でPDCAを回し、データに基づいて意思決定する能力',
      color: 'purple',
      skills: [
        {
          id: 'Q9',
          ability: '高速PDCA運用',
          question: '1〜2週サイクルで仮説→検証→改善を繰り返す仕組みを自律的に回せている。',
          category: 'agility'
        },
        {
          id: 'Q10',
          ability: '高速PDCA運用',
          question: 'DevinなどのAIツールを用いて検証フェーズの工数を大幅に削減できている。',
          category: 'agility'
        },
        {
          id: 'Q11',
          ability: 'データ駆動意思決定',
          question: 'KPIダッシュボードを設計・運用し、意思決定に生データを活用している。',
          category: 'agility'
        },
        {
          id: 'Q12',
          ability: 'データ駆動意思決定',
          question: '因果分析やA/Bテストを企画・実行し、仮説の検証精度を高めたことがある。',
          category: 'agility'
        }
      ]
    },
    {
      id: 'team',
      title: 'チーム組成・連携力',
      description: '多様なメンバーと協働し、チームの力を最大化する能力',
      color: 'red',
      skills: [
        {
          id: 'Q13',
          ability: '多様性マネジメント',
          question: 'スキル・バックグラウンドの異なるメンバーを意図的に編成できる。',
          category: 'team'
        },
        {
          id: 'Q14',
          ability: '多様性マネジメント',
          question: 'チーム内の文化的ギャップを調整し、メンバーが安心して発言できる環境を整えた経験がある。',
          category: 'team'
        },
        {
          id: 'Q15',
          ability: 'コラボレーション',
          question: 'Shared Leadershipを実践し、メンバーがリーダーシップを分担できる場を作った。',
          category: 'team'
        },
        {
          id: 'Q16',
          ability: 'コラボレーション',
          question: 'クロスファンクショナルなプロジェクトで円滑に情報共有・同期を行った経験がある。',
          category: 'team'
        }
      ]
    },
    {
      id: 'technical',
      title: '技術・プロダクト開発力',
      description: 'プロトタイプ作成から技術実装まで、プロダクト開発を推進する能力',
      color: 'indigo',
      skills: [
        {
          id: 'Q17',
          ability: 'プロトタイピング',
          question: 'UX/UI設計ツールを使い、迅速にワイヤーフレームを作成したことがある。',
          category: 'technical'
        },
        {
          id: 'Q18',
          ability: 'プロトタイピング',
          question: 'コード/ノーコードでMVPを1週間以内にテスト可能な形で構築したことがある。',
          category: 'technical'
        },
        {
          id: 'Q19',
          ability: '技術実装・自動化',
          question: 'フルスタック開発スキルを活かし、プロトタイプを自律的にデプロイした経験がある。',
          category: 'technical'
        },
        {
          id: 'Q20',
          ability: '技術実装・自動化',
          question: 'DevinなどのAIエージェント連携を通じて、開発ワークフローを自動化したことがある。',
          category: 'technical'
        }
      ]
    },
    {
      id: 'resource',
      title: 'リソースマネジメント力',
      description: '資金調達から人材配置まで、限られたリソースを最適化する能力',
      color: 'orange',
      skills: [
        {
          id: 'Q21',
          ability: '資金調達・予算管理',
          question: '投資家との交渉経験があり、シード〜シリーズラウンドをサポートできる。',
          category: 'resource'
        },
        {
          id: 'Q22',
          ability: '資金調達・予算管理',
          question: 'プロジェクト予算を立案・管理し、コスト超過を未然に防いだ実績がある。',
          category: 'resource'
        },
        {
          id: 'Q23',
          ability: '人材配置最適化',
          question: 'タレントアセスメント結果を基に、最適チーム編成を行ったことがある。',
          category: 'resource'
        },
        {
          id: 'Q24',
          ability: '人材配置最適化',
          question: 'GAアルゴリズム等を用いて人員配置を再構成し、チームパフォーマンスを向上させた。',
          category: 'resource'
        }
      ]
    },
    {
      id: 'growth',
      title: '成長・拡張マネジメント力',
      description: 'Go-to-Market戦略から組織スケールまで、事業成長を牽引する能力',
      color: 'pink',
      skills: [
        {
          id: 'Q25',
          ability: 'Go-to-Market戦略',
          question: 'ターゲットチャネルを選定し、営業/マーケティングロードマップを策定した経験がある。',
          category: 'growth'
        },
        {
          id: 'Q26',
          ability: 'Go-to-Market戦略',
          question: '効果測定のためのKPIを定義し、チャネルごとのROIを分析したことがある。',
          category: 'growth'
        },
        {
          id: 'Q27',
          ability: '組織化・スケール',
          question: 'KPIツリーを設計し、組織の各階層に目標をブレイクダウンしたことがある。',
          category: 'growth'
        },
        {
          id: 'Q28',
          ability: '組織化・スケール',
          question: 'SRE体制やガバナンスモデルを構築し、サービス品質をスケールした経験がある。',
          category: 'growth'
        }
      ]
    }
  ];

  const scoreGuide = [
    { score: 0, label: '全くできない', description: 'その行動を一度もやったことがない', color: 'gray' },
    { score: 1, label: '聞いたことがある', description: '重要性は理解しているが、まだ行動できていない', color: 'red' },
    { score: 2, label: '少し試したことがある', description: '一度やってみたことはあるが、習慣化できていない', color: 'red' },
    { score: 3, label: '指示があればできる', description: '周囲のサポートや指示があれば行動できる', color: 'orange' },
    { score: 4, label: '時々できる', description: '自分から取り組むこともあるが、継続性はない', color: 'orange' },
    { score: 5, label: '標準レベル', description: '一定の頻度で実行できるが、まだ不安定', color: 'yellow' },
    { score: 6, label: '安定してできる', description: 'ほとんどの状況で自分から実行できる', color: 'yellow' },
    { score: 7, label: '周囲に頼られ実践できる', description: '自分だけでなく周囲の人からも「得意」と認識される', color: 'green' },
    { score: 8, label: '高い成果を出せる', description: '実行した結果が社内外で認められており、再現性がある', color: 'green' },
    { score: 9, label: '他者を指導できる', description: '自分だけでなく他者に教えたり導いたりできる', color: 'blue' },
    { score: 10, label: '専門家／ロールモデル', description: 'その分野で社内外から一目置かれ、模範として扱われている', color: 'purple' }
  ];

  const handleScoreChange = (questionId, score) => {
    const success = storageService.saveSkillScore(questionId, score);
    if (success) {
      setScores(prev => ({ ...prev, [questionId]: score }));
    } else {
      alert('スコアの保存に失敗しました。もう一度お試しください。');
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getCategoryScore = (categoryId) => {
    const categorySkills = skillCategories.find(cat => cat.id === categoryId)?.skills || [];
    const categoryScores = categorySkills.map(skill => scores[skill.id] || 0);
    const total = categoryScores.reduce((sum, score) => sum + score, 0);
    return categoryScores.length > 0 ? (total / categoryScores.length).toFixed(1) : '0.0';
  };

  const getTotalScore = () => {
    const allScores = Object.values(scores);
    return allScores.length > 0 ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '0.0';
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-purple-600 dark:text-purple-400';
    if (score >= 8) return 'text-blue-600 dark:text-blue-400';
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 3) return 'text-orange-600 dark:text-orange-400';
    if (score >= 1) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getScoreColorClass = (score) => {
    const guide = scoreGuide.find(g => g.score === score);
    return guide ? guide.color : 'gray';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          事業創出スキルアセスメント
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          7つのカテゴリ・28項目で事業創出に必要なスキルを詳細評価
        </p>
        
        {/* Score Guide Toggle */}
        <button
          onClick={() => setShowScoreGuide(!showScoreGuide)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          回答選択肢について
        </button>
      </div>

      {/* Score Guide Modal */}
      {showScoreGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">評価基準（0-10段階）</h3>
                <button
                  onClick={() => setShowScoreGuide(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                各項目について、以下の基準で自己評価してください
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {scoreGuide.map((guide) => (
                  <div key={guide.score} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-${guide.color}-500 flex-shrink-0`}>
                      {guide.score}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {guide.label}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {guide.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {getTotalScore()}/10.0
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">総合スコア</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Target className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.values(scores).filter(score => score >= 8).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">優秀以上スキル</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.keys(scores).length}/28
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">評価完了項目</div>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="space-y-4">
        {skillCategories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/20`}>
                  <TrendingUp className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`text-lg font-bold ${getScoreColor(parseFloat(getCategoryScore(category.id)))}`}>
                  {getCategoryScore(category.id)}/5.0
                </div>
                {expandedCategories[category.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Category Skills */}
            {expandedCategories[category.id] && (
              <div className="px-6 pb-6 space-y-6">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="border-l-4 border-gray-200 dark:border-gray-600 pl-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {skill.id}
                          </span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {skill.ability}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium mb-2">
                          {skill.question}
                        </p>
                      </div>
                      <div className={`ml-4 text-lg font-semibold ${getScoreColor(scores[skill.id] || 0)}`}>
                        {scores[skill.id] || 0}/10
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Score Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                          const guide = scoreGuide.find(g => g.score === score);
                          const isSelected = scores[skill.id] === score;
                          const isHovered = hoveredScore === `${skill.id}-${score}`;
                          
                          return (
                            <button
                              key={score}
                              onClick={() => handleScoreChange(skill.id, score)}
                              onMouseEnter={() => setHoveredScore(`${skill.id}-${score}`)}
                              onMouseLeave={() => setHoveredScore(null)}
                              className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 font-bold text-sm ${
                                isSelected
                                  ? `bg-${guide.color}-500 border-${guide.color}-500 text-white shadow-lg transform scale-110`
                                  : `border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-${guide.color}-400 hover:text-${guide.color}-500 hover:bg-${guide.color}-50 dark:hover:bg-${guide.color}-900/20`
                              }`}
                            >
                              {score}
                              {(isSelected || isHovered) && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                                  {guide.label}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Quick Selection Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => handleScoreChange(skill.id, 0)}
                          className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          未経験
                        </button>
                        <button
                          onClick={() => handleScoreChange(skill.id, 3)}
                          className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                        >
                          初心者
                        </button>
                        <button
                          onClick={() => handleScoreChange(skill.id, 5)}
                          className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
                        >
                          標準
                        </button>
                        <button
                          onClick={() => handleScoreChange(skill.id, 7)}
                          className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                        >
                          得意
                        </button>
                        <button
                          onClick={() => handleScoreChange(skill.id, 10)}
                          className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          専門家
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          カテゴリ別スコア概要
        </h3>
        <div className="space-y-4">
          {skillCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-4">
              <div className="w-32 text-sm text-gray-600 dark:text-gray-400">
                {category.title}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 bg-${category.color}-500`}
                  style={{ width: `${(parseFloat(getCategoryScore(category.id)) / 10) * 100}%` }}
                />
              </div>
              <div className={`text-sm font-medium ${getScoreColor(parseFloat(getCategoryScore(category.id)))}`}>
                {getCategoryScore(category.id)}/10.0
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;