import React, { useState } from 'react';
import { Search, Filter, Building, TrendingUp, Users, Eye } from 'lucide-react';

const MASearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedScore, setSelectedScore] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const industries = [
    'IT・ソフトウェア',
    'ヘルスケア',
    'フィンテック',
    'EC・小売',
    '教育',
    'エンターテイメント',
    '製造業',
    '不動産'
  ];

  const companies = [
    {
      id: 1,
      name: 'TechFlow Solutions',
      industry: 'IT・ソフトウェア',
      businessModel: 'SaaS',
      executionScore: 85,
      description: 'HR管理システムを提供するスタートアップ',
      revenue: '年商2億円',
      employees: 25,
      founded: 2020,
      location: '東京',
      stage: 'Series A',
      strength: '技術力、営業力',
      weakness: 'マーケティング',
      equity: '30%売却希望'
    },
    {
      id: 2,
      name: 'HealthTech Innovation',
      industry: 'ヘルスケア',
      businessModel: '医療機器',
      executionScore: 78,
      description: 'IoT医療機器の開発・販売',
      revenue: '年商1.5億円',
      employees: 18,
      founded: 2019,
      location: '大阪',
      stage: 'Seed',
      strength: 'プロダクト開発',
      weakness: '資金調達',
      equity: '40%売却希望'
    },
    {
      id: 3,
      name: 'EduPlatform',
      industry: '教育',
      businessModel: 'EdTech',
      executionScore: 92,
      description: 'オンライン学習プラットフォーム',
      revenue: '年商5億円',
      employees: 45,
      founded: 2018,
      location: '東京',
      stage: 'Series B',
      strength: 'ユーザー基盤、技術',
      weakness: '海外展開',
      equity: '25%売却希望'
    },
    {
      id: 4,
      name: 'GreenEnergy Solutions',
      industry: 'エネルギー',
      businessModel: 'クリーンテック',
      executionScore: 73,
      description: '再生可能エネルギー関連サービス',
      revenue: '年商3億円',
      employees: 35,
      founded: 2017,
      location: '福岡',
      stage: 'Series A',
      strength: '技術革新',
      weakness: '営業体制',
      equity: '35%売却希望'
    }
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesScore = !selectedScore || 
                        (selectedScore === 'high' && company.executionScore >= 80) ||
                        (selectedScore === 'medium' && company.executionScore >= 60 && company.executionScore < 80) ||
                        (selectedScore === 'low' && company.executionScore < 60);
    
    return matchesSearch && matchesIndustry && matchesScore;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <Search className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          アーンアウトM&A企業検索
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          業界・ビジネスモデル・実行スコアでフィルタリングし、M&A対象企業を効率的に探索
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="企業名・事業内容で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">全業界</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedScore}
              onChange={(e) => setSelectedScore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">全スコア</option>
              <option value="high">高スコア (80+)</option>
              <option value="medium">中スコア (60-79)</option>
              <option value="low">低スコア (~59)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              検索結果 ({filteredCompanies.length}件)
            </h3>
          </div>
          
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                  selectedCompany?.id === company.id
                    ? 'border-blue-500 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedCompany(company)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {company.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {company.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {company.industry}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {company.employees}名
                      </div>
                      <div>{company.revenue}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(company.executionScore)}`}>
                      スコア {company.executionScore}
                    </span>
                    <button className="flex items-center text-blue-600 dark:text-blue-400 text-sm hover:underline">
                      <Eye className="h-4 w-4 mr-1" />
                      詳細を見る
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      ステージ: {company.stage}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {company.location}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    {company.equity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Details */}
        <div className="lg:col-span-1">
          {selectedCompany ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                企業詳細
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {selectedCompany.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedCompany.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">業界</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCompany.industry}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">設立年</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCompany.founded}年
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">売上</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCompany.revenue}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">従業員数</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCompany.employees}名
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">実行スコア</span>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${selectedCompany.executionScore}%` }}
                      />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedCompany.executionScore}/100
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">強み</span>
                  <div className="font-medium text-green-600 dark:text-green-400">
                    {selectedCompany.strength}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">課題</span>
                  <div className="font-medium text-orange-600 dark:text-orange-400">
                    {selectedCompany.weakness}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white mb-2">
                      {selectedCompany.equity}
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      詳細資料請求
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Building className="h-12 w-12 mx-auto mb-4" />
                <p>企業を選択すると詳細情報が表示されます</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MASearch;