'use client'

import React, { useState } from 'react';

const AnalyticsView: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="flex-1 bg-black overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Function Summary</h1>
          <p className="text-zinc-400 text-sm">AWS Lambda function overview and configuration</p>
        </div>

        {/* Info Banner */}
        {showBanner && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="text-white mt-0.5 flex-shrink-0 text-sm">ℹ</div>
            <div className="flex-1">
              <span className="text-zinc-300 text-xs">
                This function belongs to an application.{' '}
                <a href="#" className="text-white hover:underline">Click here</a>
                {' '}to manage it.
              </span>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-3 py-1.5 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-900 font-medium text-xs transition">
            Test Function
          </button>
          <button className="px-3 py-1.5 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-900 font-medium text-xs flex items-center gap-2 transition">
            <span className="text-xs">📋</span>
            Copy ARN
          </button>
          <button className="px-3 py-1.5 bg-white text-black rounded-lg hover:bg-zinc-200 font-medium text-xs flex items-center gap-2 transition">
            Actions
            <span className="text-xs">▼</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Function Overview */}
          <div className="xl:col-span-2">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="border-b border-zinc-800 p-4 bg-zinc-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-white">Function Overview</h2>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-2 py-1 border border-zinc-800 text-zinc-300 rounded text-xs font-medium hover:bg-zinc-900 transition">
                      Export
                    </button>
                    <button className="px-2 py-1 border border-zinc-800 text-zinc-300 rounded text-xs font-medium flex items-center gap-2 hover:bg-zinc-900 transition">
                      Download
                      <span className="text-xs">▼</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  <button className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-medium">
                    Visual
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-700 transition">
                    Configuration
                  </button>
                </div>

                {/* Data Flow Diagram */}
                <div className="relative bg-black border border-zinc-800 rounded-lg p-6 min-h-[400px]">
                  
                  {/* Connecting Line */}
                  <div 
                    className="absolute top-[130px] right-[50%] left-[232px] h-[155px] border-b-[1.5px] border-r-[1.5px] border-zinc-600 rounded-br-3xl pointer-events-none"
                  >
                    {/* Arrow Head */}
                    <div className="absolute bottom-[-5px] left-[-6px]">
                      <svg width="8" height="10" viewBox="0 0 10 10" className="transform rotate-180">
                         <path d="M0,5 L10,0 L10,10 Z" fill="#71717a" />
                      </svg>
                    </div>
                  </div>

                  {/* First Box - Top Middle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-10 z-10">
                    <div className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden w-48 shadow-xl">
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <span className="text-black text-xs">⚡</span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-white block">PDF Processor</span>
                            <span className="text-[10px] text-zinc-400">AWS Lambda</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-black">
                        <div className="text-[10px] text-zinc-400">Process & Transform PDFs</div>
                      </div>
                    </div>
                  </div>

                  {/* Second Box - Bottom Left */}
                  <div className="absolute left-10 top-60 z-10">
                    <div className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden w-48 shadow-xl">
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
                            <span className="text-white text-xs">🗄</span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-white block">Metadata Store</span>
                            <span className="text-[10px] text-zinc-400">Amazon DynamoDB</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-black">
                        <div className="text-[10px] text-zinc-400">Store PDF Metadata</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Function Details */}
          <div className="space-y-4">
            {/* Function Info */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-xs font-medium text-white mb-2">Function Details</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Runtime</label>
                  <p className="text-xs text-zinc-300">Node.js 18.x</p>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Memory</label>
                  <p className="text-xs text-zinc-300">128 MB</p>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Timeout</label>
                  <p className="text-xs text-zinc-300">3 min 0 sec</p>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Last modified</label>
                  <p className="text-xs text-zinc-300">2 months ago</p>
                </div>
              </div>
            </div>

            {/* Function ARN */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-xs font-medium text-white mb-2">Function ARN</h3>
              <div className="flex items-start gap-2">
                <div className="flex-1 bg-black border border-zinc-800 rounded p-2 text-[10px] text-zinc-300 font-mono break-all">
                  arn:aws:lambda:us-east-1:123456789012:function:pdf-processor
                </div>
                <button className="text-zinc-400 hover:text-white p-2">
                  📋
                </button>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-xs font-medium text-white mb-2">Environment Variables</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500">NODE_ENV</span>
                  <span className="text-[10px] text-zinc-300 font-mono">production</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500">LOG_LEVEL</span>
                  <span className="text-[10px] text-zinc-300 font-mono">info</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;