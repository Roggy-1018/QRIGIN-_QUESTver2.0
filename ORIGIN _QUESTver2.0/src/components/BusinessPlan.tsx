import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, FileText, Download } from 'lucide-react';
import { storageService } from '../utils/storage';

const BusinessPlan = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [revenueData, setRevenueData] = useState(() => {
    const saved = storageService.getBusinessPlan();
    return saved?.revenueData || {
      year1: 5000000,
      year2: 15000000,
      year3: 45000000,
      unitPrice: 50000,
      customers: [100, 300, 900]
    };
  });

  const [costData, setCostData] = useState(() => {
    const saved = storageService.getBusinessPlan();
    return saved?.costData || {
      development: [3000000, 8000000, 15000000],
      marketing: [2000000, 5000000, 12000000],
      operations: [1000000, 3000000, 8000000],
      personnel: [4000000, 12000000, 25000000]
    };
  });

  // Save data whenever it changes
  const saveBusinessPlan = () => {
    storageService.saveBusinessPlan({
      revenueData,
      costData
    });
  };

  const updateRevenueData = (newData) => {
    setRevenueData(newData);
    // Save after state update
    setTimeout(() => {
      storageService.saveBusinessPlan({
        revenueData: newData,
        costData
      });
    }, 0);
  };

  const updateCostData = (newData) => {
    setCostData(newData);
    // Save after state update
    setTimeout(() => {
      storageService.saveBusinessPlan({
        revenueData,
        costData: newData
      });
    }, 0);
  };

  // Remove the old costData state initialization since it's now above
  // const [costData, setCostData] = useState({
  //   development: [3000000, 8000000, 15000000],
  //   marketing: [2000000, 5000000, 12000000],
  //   operations: [1000000, 3000000, 8000000],
  //   personnel: [4000000, 12000000, 25000000]
  // });

  const [revenueDataDuplicate, setRevenueDataDuplicate] = useState({
    year1: 5000000,
    year2: 15000000,
    year3: 45000000,
    unitPrice: 50000,
    customers: [100, 300, 900]
  });

  const [costDataDuplicate, setCostDataDuplicate] = useState({
    development: [3000000, 8000000, 15000000],
    marketing: [2000000, 5000000, 12000000],
    operations: [1000000, 3000000, 8000000],
    personnel: [4000000, 12000000, 25000000]
  });

  const years = ['Year 1', 'Year 2', 'Year 3'];
  const totalCosts = years.map((_, index) => 
    Object.values(costData).reduce((sum, costs) => sum + costs[index], 0)
  );
  const revenues = [revenueData.year1, revenueData.year2, revenueData.year3];
  const profits = revenues.map((revenue, index) => revenue - totalCosts[index]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          事業計画策定
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          売上予測とコストモデルを設定し、財務計画を可視化します
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'revenue'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            売上予測
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'costs'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            コストモデル
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'summary'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            財務サマリー
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                売上予測モデル
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      単価（円）
                    </label>
                    <input
                      type="number"
                      value={revenueData.unitPrice}
                      onChange={(e) => updateRevenueData({...revenueData, unitPrice: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      顧客数推移
                    </label>
                    {years.map((year, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                          {year}
                        </div>
                        <input
                          type="number"
                          value={revenueData.customers[index]}
                          onChange={(e) => {
                            const newCustomers = [...revenueData.customers];
                            newCustomers[index] = parseInt(e.target.value);
                            updateRevenueData({...revenueData, customers: newCustomers});
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        <div className="w-32 text-sm text-gray-600 dark:text-gray-400 text-right">
                          {formatCurrency(revenueData.unitPrice * revenueData.customers[index])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    売上予測グラフ
                  </h4>
                  <div className="space-y-3">
                    {years.map((year, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{year}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(revenueData.customers[index] / Math.max(...revenueData.customers)) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(revenueData.unitPrice * revenueData.customers[index])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                コストモデル
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {Object.entries(costData).map(([category, costs]) => (
                    <div key={category} className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {category === 'development' ? '開発費' :
                         category === 'marketing' ? 'マーケティング費' :
                         category === 'operations' ? '運営費' : '人件費'}
                      </label>
                      {years.map((year, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                            {year}
                          </div>
                          <input
                            type="number"
                            value={costs[index]}
                            onChange={(e) => {
                              const newData = {...costData};
                              newData[category][index] = parseInt(e.target.value);
                              updateCostData(newData);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    コスト構成
                  </h4>
                  <div className="space-y-4">
                    {years.map((year, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{year}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(totalCosts[index])}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(costData).map(([category, costs]) => (
                            <div key={category} className="flex items-center text-xs">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                category === 'development' ? 'bg-blue-500' :
                                category === 'marketing' ? 'bg-purple-500' :
                                category === 'operations' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="text-gray-600 dark:text-gray-400">
                                {formatCurrency(costs[index])}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  財務サマリー
                </h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  PDFダウンロード
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {years.map((year, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      {year}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">売上</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(revenues[index])}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">コスト</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(totalCosts[index])}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">利益</span>
                          <span className={`font-bold ${
                            profits[index] >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formatCurrency(profits[index])}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  主要指標
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(revenues[2])}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">3年目売上</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {((revenues[2] / revenues[0]) ** (1/2) - 1 * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">年間成長率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {((profits[2] / revenues[2]) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">利益率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {revenueData.customers[2]}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">3年目顧客数</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPlan;