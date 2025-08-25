import React, { useState, useRef, useEffect } from 'react';
import { User, Sparkles, Copy, RefreshCw, Save, ArrowRight, ArrowLeft, Heart, Star, TrendingUp, Users, Target, CheckCircle, BarChart3, MessageCircle, Share2, Download, HelpCircle, X, Check } from 'lucide-react';
import { storageService } from '../utils/storage';
import OpenAI from 'openai';

const WhyMeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMotivationForm, setShowMotivationForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState(null);
  const [popupContent, setPopupContent] = useState('');
  const [newEvent, setNewEvent] = useState({
    year: new Date().getFullYear(),
    emotionLevel: 3,
    description: '',
    type: 'happy'
  });
  const [formData, setFormData] = useState({
    // Step 1: Will
    motivationEvents: () => {
      return storageService.getMotivationPoints();
    },
    motivationEvents: [],
    selectedYear: null,
    selectedLevel: null,
    description: '',
    timeSpentOther: '',
    timeActivities: [],
    idealSociety: '',
    happinessTarget: '',
    
    // Step 2: Can
    experiences: [],
    praisedQualities: [],
    strengthAreas: {},
    
    // Step 3: Need
    sharedProblems: [],
    trendInsights: '',
    mvpTarget: '',
    
    // Step 4: Generated
    generatedWhyMe: '',
    satisfactionScore: 0,
    excitementScore: 0
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Save experiences to localStorage whenever they change
  useEffect(() => {
    // This effect runs when experiences change, but we handle saving in individual functions
  }, [formData.motivationEvents]);

  const steps = [
    { id: 0, title: 'ガイダンス', subtitle: 'Why Meの重要性', color: 'blue' },
    { id: 1, title: 'Will', subtitle: 'やりたいことを言語化', color: 'red' },
    { id: 2, title: 'Can', subtitle: '得意・強みを発見', color: 'green' },
    { id: 3, title: 'Need', subtitle: '求められる価値を把握', color: 'yellow' },
    { id: 4, title: 'Why Me', subtitle: '自分らしさの言語化', color: 'purple' }
  ];


  const timeActivities = [
    '読書・学習', 'プログラミング', '企画・戦略立案', '人との対話', 
    'デザイン・創作', 'データ分析', '問題解決', '教える・指導する',
    '新しい技術の調査', 'チームビルディング', 'プレゼンテーション', 'その他'
  ];

  const experienceCategories = [
    { key: 'work', label: '職歴・業務経験', icon: '💼' },
    { key: 'project', label: 'プロジェクト・活動', icon: '🚀' },
    { key: 'skill', label: 'スキル・資格', icon: '🎯' },
    { key: 'achievement', label: '実績・成果', icon: '🏆' }
  ];

  const praisedOptions = [
    '論理的思考力', '実行力・推進力', 'コミュニケーション力', 'リーダーシップ',
    '創造性・発想力', '分析力', '協調性', '責任感', '学習意欲', '課題発見力'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateWhyMe = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation based on collected data
    setTimeout(() => {
      const generated = `私は、${formData.timeActivities.slice(0, 2).join('や')}に時間を忘れて取り組む中で、${formData.idealSociety}という想いを強く持つようになりました。これまで${formData.praisedQualities.slice(0, 2).join('や')}を評価され、${formData.experiences.length > 0 ? formData.experiences[0].title : '様々な経験'}を通じて実績を積んできました。今、${formData.happinessTarget}のために、${formData.mvpTarget}に向けた事業を立ち上げたいと考えています。`;
      
      setFormData(prev => ({ ...prev, generatedWhyMe: generated }));
      setIsGenerating(false);
    }, 2000);
  };

  const generateWhyMeText = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      // Create prompt based on user's motivation events
      const motivationEvents = formData.motivationEvents || [];
      const eventsText = motivationEvents.map(event => 
        `${event.year}年: ${event.description} (モチベーション: ${event.level}/5)`
      ).join('\n');

      const prompt = `以下の経験・体験をもとに、「なぜ私がこの事業をやるべきなのか」を説得力のある文章で作成してください。

【私の経験・体験】
${eventsText}

【要求事項】
- 投資家や協業パートナーに向けた説得力のある内容
- 個人の原体験と事業への情熱を結びつける
- 具体的なエピソードを活用する
- 400-600文字程度
- 日本語で作成

「Why Me」の文章:`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたは新規事業創出の専門家です。起業家の経験を基に説得力のある「Why Me」文章を作成してください。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const generated = completion.choices[0]?.message?.content || '';
      setGeneratedText(generated);
      
      // Save generated text to storage
      const userData = storageService.getUserData() || storageService.initializeUser();
      userData.whyMeText = generated;
      storageService.saveUserData(userData);
      
    } catch (error) {
      console.error('Error generating Why Me text:', error);
      alert('文章生成中にエラーが発生しました。APIキーを確認してください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    setShowApiKeyModal(false);
  };

  // Load API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // Load generated text
    const userData = storageService.getUserData();
    if (userData?.whyMeText) {
      setGeneratedText(userData.whyMeText);
    }
  }, []);

  const addMotivationEvent = (type, description) => {
    const event = {
      id: Date.now(),
      type, // 'happy' or 'frustrated'
      description,
      year: new Date().getFullYear() - Math.floor(Math.random() * 10),
      emotionLevel: Math.floor(Math.random() * 3) + 3 // 3-5 for demo
    };
    setFormData(prev => ({
      ...prev,
      motivationEvents: [...prev.motivationEvents, event]
    }));
  };

  const addMotivationEventFromForm = () => {
    if (newEvent.description.trim()) {
      const success = storageService.saveMotivationPoint({
        year: newEvent.year,
        level: newEvent.emotionLevel, // Convert 0-4 to 1-5 for storage
        type: newEvent.type,
        description: newEvent.description.trim()
      });
      
      if (success) {
        // Reload experiences from storage
        setFormData(prev => ({
          ...prev,
          motivationEvents: storageService.getMotivationPoints()
        }));
        setNewEvent({
          year: new Date().getFullYear(),
          emotionLevel: 3,
          description: '',
          type: 'happy'
        });
        setShowMotivationForm(false);
      } else {
        alert('体験の保存に失敗しました。もう一度お試しください。');
      }
    }
  };

  const removeMotivationEvent = (id) => {
    const success = storageService.deleteMotivationPoint(id);
    if (success) {
      setFormData(prev => ({
        ...prev,
        motivationEvents: storageService.getMotivationPoints()
      }));
    } else {
      alert('体験の削除に失敗しました。もう一度お試しください。');
    }
  };

  const addExperience = (category, title, description) => {
    const newExp = {
      id: Date.now(),
      category,
      title,
      description,
      year: new Date().getFullYear() - Math.floor(Math.random() * 5)
    };
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const toggleTimeActivity = (activity) => {
    setFormData(prev => ({
      ...prev,
      timeActivities: prev.timeActivities.includes(activity)
        ? prev.timeActivities.filter(a => a !== activity)
        : [...prev.timeActivities, activity]
    }));
  };

  const togglePraisedQuality = (quality) => {
    setFormData(prev => ({
      ...prev,
      praisedQualities: prev.praisedQualities.includes(quality)
        ? prev.praisedQualities.filter(q => q !== quality)
        : [...prev.praisedQualities, quality]
    }));
  };

  const handleYearClick = (year) => {
    // Handle year click functionality
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                なぜWhy Meが必要なのか？
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                行動のブレない軸を持つための自己理解
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Venn Diagram with Flag */}
              <div className="md:col-span-3 flex justify-center">
                <div className="relative w-[500px] h-[400px]">
                  <svg className="w-full h-full" viewBox="0 0 500 400">
                    <defs>
                      {/* Gradients for modern look */}
                      <radialGradient id="redGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
                        <stop offset="70%" stopColor="rgba(239, 68, 68, 0.4)" />
                        <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
                      </radialGradient>
                      
                      <radialGradient id="greenGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.8)" />
                        <stop offset="70%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
                      </radialGradient>
                      
                      <radialGradient id="blueGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                        <stop offset="70%" stopColor="rgba(59, 130, 246, 0.4)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                      </radialGradient>
                      
                      <radialGradient id="purpleGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.9)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
                      </radialGradient>
                      
                      {/* Enhanced glow effect */}
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      
                      {/* Drop shadow */}
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.2)"/>
                      </filter>
                    </defs>
                    
                    {/* Main circles */}
                    <g filter="url(#shadow)">
                      {/* Blue circle (Need) - Bottom */}
                      <circle
                        cx="250"
                        cy="280"
                        r="120"
                        fill="url(#blueGradient)"
                        stroke="#3B82F6"
                        strokeWidth="4"
                        filter="url(#glow)"
                        className="transition-all duration-500 hover:stroke-width-6"
                      />
                      
                      {/* Red circle (Will) - Top Left */}
                      <circle
                        cx="180"
                        cy="200"
                        r="120"
                        fill="url(#redGradient)"
                        stroke="#EF4444"
                        strokeWidth="4"
                        filter="url(#glow)"
                        className="transition-all duration-500 hover:stroke-width-6"
                      />
                      
                      {/* Green circle (Can) - Top Right */}
                      <circle
                        cx="320"
                        cy="200"
                        r="120"
                        fill="url(#greenGradient)"
                        stroke="#10B981"
                        strokeWidth="4"
                        filter="url(#glow)"
                        className="transition-all duration-500 hover:stroke-width-6"
                      />
                    </g>
                    
                    {/* Center circle (Why Me) */}
                    <circle
                      cx="250"
                      cy="240"
                      r="50"
                      fill="url(#purpleGradient)"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      filter="url(#glow)"
                      className="animate-pulse"
                    />
                    
                    {/* Flag pole and flag */}
                    <g className="animate-bounce" style={{animationDuration: '3s'}}>
                      <line
                        x1="250"
                        y1="240"
                        x2="250"
                        y2="180"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <polygon
                        points="250,180 290,190 290,210 250,200"
                        fill="white"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="1"
                      />
                    </g>
                    
                    {/* Labels */}
                    <text
                      x="180"
                      y="140"
                      textAnchor="middle"
                      className="fill-white font-bold text-lg drop-shadow-lg"
                    >
                      Will
                    </text>
                    <text
                      x="180"
                      y="160"
                      textAnchor="middle"
                      className="fill-white/90 text-sm"
                    >
                      やりたい
                    </text>
                    
                    <text
                      x="320"
                      y="140"
                      textAnchor="middle"
                      className="fill-white font-bold text-lg drop-shadow-lg"
                    >
                      Can
                    </text>
                    <text
                      x="320"
                      y="160"
                      textAnchor="middle"
                      className="fill-white/90 text-sm"
                    >
                      得意
                    </text>
                    
                    <text
                      x="250"
                      y="330"
                      textAnchor="middle"
                      className="fill-white font-bold text-lg drop-shadow-lg"
                    >
                      Need
                    </text>
                    <text
                      x="250"
                      y="350"
                      textAnchor="middle"
                      className="fill-white/90 text-sm"
                    >
                      求められる
                    </text>
                    
                    {/* Center label */}
                    <text
                      x="250"
                      y="245"
                      textAnchor="middle"
                      className="fill-white font-bold text-base drop-shadow-lg"
                    >
                      Why Me
                    </text>
                    
                    {/* Decorative sparkles */}
                    <g opacity="0.6">
                      <circle cx="100" cy="100" r="3" fill="white" className="animate-ping" />
                      <circle cx="400" cy="120" r="2" fill="white" className="animate-ping" style={{animationDelay: '1s'}} />
                      <circle cx="420" cy="350" r="3" fill="white" className="animate-ping" style={{animationDelay: '2s'}} />
                      <circle cx="80" cy="320" r="2" fill="white" className="animate-ping" style={{animationDelay: '0.5s'}} />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* 解説ボタン */}
            <div className="text-center mt-8">
              <button
                onClick={() => setShowExplanation(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                詳しい解説を見る
              </button>
            </div>

          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Will：やりたいことを言語化
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                あなたの内なる動機と情熱を探ります
              </p>
            </div>

            {/* モチベーショングラフ */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                モチベーショングラフ
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                人生の中で嬉しかった・悔しかった体験をプロットしてください
              </p>
              
              {/* モチベーショングラフ本体 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-4">
                {/* Y軸ラベル */}
                <div className="flex">
                  <div className="w-16 flex flex-col justify-between h-64 text-sm text-gray-500 dark:text-gray-400 mr-4">
                    <span>高い</span>
                    <span>普通</span>
                    <span>低い</span>
                  </div>
                  
                  {/* グラフエリア */}
                  <div className="flex-1 relative">
                    {/* グリッドライン */}
                    <div className="absolute inset-0">
                      {[0, 1, 2, 3, 4].map((line) => (
                        <div
                          key={line}
                          className="absolute w-full border-t border-gray-200 dark:border-gray-600"
                          style={{ top: `${line * 25}%` }}
                        />
                      ))}
                    </div>
                    
                    {/* 年軸 */}
                    <div className="relative h-64 overflow-x-auto">
                      <div className="flex items-end h-full min-w-full" style={{ width: '800px' }}>
                        {Array.from({ length: 11 }, (_, i) => {
                          const year = 2015 + i;
                          const yearEvents = formData.motivationEvents.filter(event => event.year === year);
                          
                          return (
                            <div 
                              key={year} 
                              className="flex-1 relative h-full flex flex-col justify-end group cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-all duration-200"
                              onClick={() => handleYearClick(year)}
                            >
                              {/* イベントプロット */}
                              {yearEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-125 ${
                                    event.type === 'happy' 
                                      ? 'bg-green-500 border-2 border-green-600' 
                                      : 'bg-red-500 border-2 border-red-600'
                                  }`}
                                  style={{
                                    bottom: `${(event.emotionLevel - 1) * 25}%`,
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                  title={event.description}
                                  onClick={() => removeMotivationEvent(event.id)}
                                />
                              ))}
                              
                              {/* 年ラベル */}
                              <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center py-2 bg-white dark:bg-gray-800 transition-colors duration-200 relative">
                                {year}
                              </div>
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 凡例と追加ボタン */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">嬉しかった体験</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">悔しかった体験</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowMotivationForm(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span className="text-lg mr-2">+</span>
                  追加
                </button>
              </div>

              {/* 体験リスト */}
              {formData.motivationEvents.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.motivationEvents.map((event) => (
                    <div key={event.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      event.type === 'happy' 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-center space-x-3">
                        {event.type === 'happy' ? (
                          <Heart className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {event.year}年
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            {event.description}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMotivationEvent(event.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 時間の使い方 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                時間を忘れて取り組むこと
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                気づいたら時間を忘れていたことを選択してください（複数選択可）
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeActivities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleTimeActivity(activity)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      formData.timeActivities.includes(activity)
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-red-300 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* 理想の社会 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                実現したい未来
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    どんな社会を実現したいですか？
                  </label>
                  <textarea
                    value={formData.idealSociety}
                    onChange={(e) => setFormData(prev => ({ ...prev, idealSociety: e.target.value }))}
                    placeholder="例：誰もが自分らしく働ける社会..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    誰を幸せにしたいですか？
                  </label>
                  <textarea
                    value={formData.happinessTarget}
                    onChange={(e) => setFormData(prev => ({ ...prev, happinessTarget: e.target.value }))}
                    placeholder="例：やりたいことがあるけど形にできない人..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Star className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Can：得意・強みを発見
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                あなたの経験とスキルを棚卸しします
              </p>
            </div>

            {/* 経験棚卸し */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                経験の棚卸し
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experienceCategories.map((category) => (
                  <div key={category.key} className="space-y-3">
                    <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </h5>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="タイトル"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            addExperience(category.key, e.target.value, '');
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {formData.experiences.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                    登録された経験
                  </h5>
                  <div className="space-y-2">
                    {formData.experiences.map((exp) => (
                      <div key={exp.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-lg">
                          {experienceCategories.find(c => c.key === exp.category)?.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {exp.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {exp.year}年 • {experienceCategories.find(c => c.key === exp.category)?.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 人から褒められたこと */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                人から褒められたこと
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                周囲が評価したあなたらしさを選択してください（複数選択可）
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {praisedOptions.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => togglePraisedQuality(quality)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      formData.praisedQualities.includes(quality)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Need：求められる価値を把握
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                世の中のニーズとあなたの価値の接点を見つけます
              </p>
            </div>

            {/* 共感される課題 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                共感される課題
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                あなたが過去に困ったことで、他の人も共感しそうなものを書き出してください
              </p>
              
              <textarea
                placeholder="例：副業を始めたいけど何から手をつけていいかわからない..."
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                onBlur={(e) => {
                  if (e.target.value && !formData.sharedProblems.includes(e.target.value)) {
                    setFormData(prev => ({
                      ...prev,
                      sharedProblems: [...prev.sharedProblems, e.target.value]
                    }));
                    e.target.value = '';
                  }
                }}
              />

              {formData.sharedProblems.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.sharedProblems.map((problem, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <MessageCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {problem}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* トレンド調査 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                世の中のトレンド
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                あなたの関心領域で注目されているトレンドや市場動向を記録してください
              </p>
              
              <textarea
                value={formData.trendInsights}
                onChange={(e) => setFormData(prev => ({ ...prev, trendInsights: e.target.value }))}
                placeholder="例：リモートワークの普及により、オンライン学習市場が急成長..."
                className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* MVP検討 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                MVP検討
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                仮説アイデアが誰のためのものかを明確にしてください
              </p>
              
              <textarea
                value={formData.mvpTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, mvpTarget: e.target.value }))}
                placeholder="例：30代のビジネスパーソンで副業を始めたいが時間がない人向けの..."
                className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                    <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Why Me文章生成
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  あなたの体験をもとに、AIが説得力のある「Why Me」文章を生成します
                </p>
                
                <button
                  onClick={generateWhyMeText}
                  disabled={isGenerating || !formData.motivationEvents || formData.motivationEvents.length === 0}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium inline-flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Why Me文を生成する
                    </>
                  )}
                </button>
              </div>
              
              {generatedText && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    生成されたWhy Me文章
                  </h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {generatedText}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedText)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      コピー
                    </button>
                    <button
                      onClick={generateWhyMeText}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      再生成
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 生成結果 */}
            {formData.generatedWhyMe && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    生成されたWhy Me文
                  </h4>
                  
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4">
                    <p className="text-gray-900 dark:text-white leading-relaxed text-lg">
                      {formData.generatedWhyMe}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(formData.generatedWhyMe)}
                      className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      コピー
                    </button>
                    
                    <button
                      onClick={generateWhyMe}
                      className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      再生成
                    </button>
                    
                    <button className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors">
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </button>
                  </div>
                </div>

                {/* フィードバック */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    自己評価
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        納得度：この文章はあなたらしさを表現していますか？
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => setFormData(prev => ({ ...prev, satisfactionScore: score }))}
                            className={`w-12 h-12 rounded-full border-2 transition-colors ${
                              formData.satisfactionScore >= score
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-blue-300'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        ワクワク度：この事業に取り組むことにワクワクしますか？
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => setFormData(prev => ({ ...prev, excitementScore: score }))}
                            className={`w-12 h-12 rounded-full border-2 transition-colors ${
                              formData.excitementScore >= score
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-orange-300'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Meカード */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Why Meカード
                  </h4>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white mb-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">あなたの名前</div>
                        <div className="text-sm opacity-90">新規事業創出者</div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed opacity-95">
                      {formData.generatedWhyMe}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                      <Share2 className="h-4 w-4 mr-2" />
                      シェア
                    </button>
                    
                    <button className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      PDF出力
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Why Me ジェネレーター
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} / {steps.length}
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= currentStep
                    ? `bg-${step.color}-500 text-white`
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-colors ${
                    index < currentStep ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {steps[currentStep].subtitle}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          前へ
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          次へ
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* 解説モーダル */}
      {showExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Why Meの3つの輪 - 詳細解説
              </h3>
              <button
                onClick={() => setShowExplanation(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 space-y-8">
              {/* 3つの組み合わせパターン */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Will × Can パターン */}
                <div className="bg-gradient-to-br from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-4">
                    <div className="relative w-32 h-24 mx-auto mb-4">
                      <svg viewBox="0 0 120 80" className="w-full h-full">
                        {/* Will Circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="25"
                          fill="rgba(239, 68, 68, 0.6)"
                          stroke="rgb(239, 68, 68)"
                          strokeWidth="2"
                        />
                        {/* Can Circle */}
                        <circle
                          cx="80"
                          cy="40"
                          r="25"
                          fill="rgba(34, 197, 94, 0.6)"
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="2"
                        />
                        {/* Labels */}
                        <text x="30" y="25" textAnchor="middle" className="fill-red-600 dark:fill-red-400 text-xs font-semibold">
                          Will
                        </text>
                        <text x="90" y="25" textAnchor="middle" className="fill-green-600 dark:fill-green-400 text-xs font-semibold">
                          Can
                        </text>
                        {/* Missing Need indicator */}
                        <text x="60" y="70" textAnchor="middle" className="fill-gray-400 text-xs">
                          Need?
                        </text>
                      </svg>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium mb-2">
                      自己満足
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Will × Can
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    やりたい × 得意
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    自分がやりたくて得意なことをやっていても、社会や顧客から求められていなければ価値として認められず、持続性がない。
                  </p>
                </div>

                {/* Will × Need パターン */}
                <div className="bg-gradient-to-br from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-4">
                    <div className="relative w-32 h-24 mx-auto mb-4">
                      <svg viewBox="0 0 120 80" className="w-full h-full">
                        {/* Will Circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="25"
                          fill="rgba(239, 68, 68, 0.6)"
                          stroke="rgb(239, 68, 68)"
                          strokeWidth="2"
                        />
                        {/* Need Circle */}
                        <circle
                          cx="80"
                          cy="40"
                          r="25"
                          fill="rgba(234, 179, 8, 0.6)"
                          stroke="rgb(234, 179, 8)"
                          strokeWidth="2"
                        />
                        {/* Labels */}
                        <text x="30" y="25" textAnchor="middle" className="fill-red-600 dark:fill-red-400 text-xs font-semibold">
                          Will
                        </text>
                        <text x="90" y="25" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400 text-xs font-semibold">
                          Need
                        </text>
                        {/* Missing Can indicator */}
                        <text x="60" y="70" textAnchor="middle" className="fill-gray-400 text-xs">
                          Can?
                        </text>
                      </svg>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-sm font-medium mb-2">
                      下手の横好き
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Will × Need
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    やりたい × 求められる
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    やりたいことだし人からも求められているが、スキルや強みが足りないため成果が出ず、信頼や継続性に欠ける。
                  </p>
                </div>

                {/* Can × Need パターン */}
                <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-4">
                    <div className="relative w-32 h-24 mx-auto mb-4">
                      <svg viewBox="0 0 120 80" className="w-full h-full">
                        {/* Can Circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r="25"
                          fill="rgba(34, 197, 94, 0.6)"
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="2"
                        />
                        {/* Need Circle */}
                        <circle
                          cx="80"
                          cy="40"
                          r="25"
                          fill="rgba(234, 179, 8, 0.6)"
                          stroke="rgb(234, 179, 8)"
                          strokeWidth="2"
                        />
                        {/* Labels */}
                        <text x="30" y="25" textAnchor="middle" className="fill-green-600 dark:fill-green-400 text-xs font-semibold">
                          Can
                        </text>
                        <text x="90" y="25" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400 text-xs font-semibold">
                          Need
                        </text>
                        {/* Missing Will indicator */}
                        <text x="60" y="70" textAnchor="middle" className="fill-gray-400 text-xs">
                          Will?
                        </text>
                      </svg>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-2">
                      自己犠牲
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Can × Need
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    得意 × 求められる
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    得意で人からも求められるけれど、自分が心からやりたいと思っていないため、燃え尽きやストレスにつながる。
                  </p>
                </div>
              </div>

              {/* 理想的な状態 */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-700">
                <div className="text-center">
                  <div className="relative w-48 h-36 mx-auto mb-6">
                    <svg viewBox="0 0 200 140" className="w-full h-full">
                      {/* Will Circle (Red) */}
                      <circle
                        cx="70"
                        cy="60"
                        r="35"
                        fill="rgba(239, 68, 68, 0.4)"
                        stroke="rgb(239, 68, 68)"
                        strokeWidth="2"
                      />
                      
                      {/* Can Circle (Green) */}
                      <circle
                        cx="130"
                        cy="60"
                        r="35"
                        fill="rgba(34, 197, 94, 0.4)"
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="2"
                      />
                      
                      {/* Need Circle (Yellow) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="35"
                        fill="rgba(234, 179, 8, 0.4)"
                        stroke="rgb(234, 179, 8)"
                        strokeWidth="2"
                      />
                      
                      {/* Flag Pole */}
                      <line
                        x1="100"
                        y1="75"
                        x2="100"
                        y2="35"
                        stroke="rgb(75, 85, 99)"
                        strokeWidth="3"
                        className="dark:stroke-gray-300"
                      />
                      
                      {/* Flag */}
                      <polygon
                        points="100,35 130,42 130,55 100,48"
                        fill="rgb(147, 51, 234)"
                        className="animate-pulse"
                      />
                      
                      {/* Labels */}
                      <text x="50" y="40" textAnchor="middle" className="fill-red-600 dark:fill-red-400 font-semibold text-sm">
                        Will
                      </text>
                      <text x="150" y="40" textAnchor="middle" className="fill-green-600 dark:fill-green-400 font-semibold text-sm">
                        Can
                      </text>
                      <text x="100" y="130" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400 font-semibold text-sm">
                        Need
                      </text>
                      
                      {/* Center Label */}
                      <text x="100" y="70" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400 font-bold text-sm">
                        Why Me
                      </text>
                    </svg>
                  </div>
                  
                  <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-lg font-bold mb-4">
                    🚩 理想的な状態
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Will × Can × Need
                  </h4>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    3つの輪が揃って重なったところに、<br />
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      「自分にしかできない・やりたい・社会からも必要とされる旗」
                    </span><br />
                    を立てることが重要です。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">情熱を持って取り組める</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <Star className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">得意分野で成果を出せる</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <Users className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">社会から価値を認められる</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="text-center">
                <button
                  onClick={() => setShowExplanation(false)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                >
                  理解しました！Why Meを作成する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                OpenAI API キー設定
              </h3>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ChatGPT APIを使用してWhy Me文章を生成するには、OpenAI APIキーが必要です。
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  APIキー
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      saveApiKey(e.target.value);
                    }
                  }}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="password"]');
                    if (input.value) {
                      saveApiKey(input.value);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  キャンセル
                </button>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>APIキーは安全にローカルストレージに保存されます。</p>
                <p>
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    OpenAI APIキーを取得する
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* モチベーション追加フォーム */}
      {showMotivationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                体験を追加
              </h3>
              <button
                onClick={() => setShowMotivationForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    年
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2030"
                    value={newEvent.year}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    感情レベル
                  </label>
                  <select
                    value={newEvent.emotionLevel}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, emotionLevel: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  体験内容
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="どんな出来事でしたか？"
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  タイプ
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      value="happy"
                      checked={newEvent.type === 'happy'}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">嬉しかった</span>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      value="frustrated"
                      checked={newEvent.type === 'frustrated'}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">悔しかった</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMotivationForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={addMotivationEventFromForm}
                disabled={!newEvent.description.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyMeGenerator;