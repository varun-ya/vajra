'use client'

import React, { useState } from 'react'

// Styled SVGs to match the "Phosphor" aesthetic from your reference code
const Icons = {
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white">
      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 12.2a1 1 0 110-2 1 1 0 010 2zm1.2-3.8c0 .2 0 .4-.2.6l-.6.6c-.2.2-.2.4-.2.6v.4H6.6v-.6c0-.4.2-.6.4-.8l.6-.6c.2-.2.4-.4.4-.6 0-.2-.2-.4-.4-.4-.2 0-.4.2-.4.4H5.4c0-.6.6-1.2 1.4-1.2.8 0 1.4.6 1.4 1.4z"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="ml-1 text-white">
      <path d="M14 14H2V2h6V0H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8h-2v6zM9 0v2h3.6L6.8 7.8l1.4 1.4L14 3.6V7h2V0H9z"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  ),
  Kebab: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white hover:text-white transition-colors">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Maximize: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  ),
  Compass: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
       <circle cx="12" cy="12" r="10" />
       <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

export default function LambdaMonitorView() {
  const [timeRange, setTimeRange] = useState('3h')

  return (
    <div className="flex-1 bg-black overflow-y-auto font-sans text-white h-screen custom-scrollbar">
      
      {/* 1. Header Tabs */}
  
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* 2. Monitor Header & Controls */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Monitor <span className="text-white text-sm font-normal cursor-pointer hover:text-white">Info</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">Filter metrics by</span>
              <div className="relative">
                <select className="appearance-none bg-black border border-white hover:border-white text-white text-sm rounded-lg py-1.5 pl-3 pr-8 focus:border-white focus:outline-none transition-colors">
                  <option>Function</option>
                </select>
                <div className="absolute right-2 top-2.5 pointer-events-none text-white">
                   <Icons.ChevronDown />
                </div>
              </div>
              
              <button className="flex items-center gap-2 text-sm font-medium text-white border border-white rounded-lg px-3 py-1.5 hover:bg-black transition-colors">
                View CloudWatch logs
                <Icons.ExternalLink />
              </button>
              <div className="border-l border-white h-6 mx-1"></div>
              <button className="p-1.5 border border-white rounded-lg bg-black hover:bg-black text-white hover:text-white transition-colors">
                <Icons.ChevronDown />
              </button>
            </div>
          </div>

          {/* Time Range Toolbar */}
          <div className="flex items-center justify-between bg-black py-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative inline-block w-9 h-5 rounded-full border border-white bg-black cursor-pointer">
                   <div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                </div>
                <span className="text-sm text-white">Alarm recommendations</span>
                <span className="text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline mb-1">
                        <path d="M12 2L2 22h20L12 2zm0 3.5L18.5 19H5.5L12 5.5z"/>
                        <circle cx="12" cy="16" r="1.5" />
                    </svg>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                 <Icons.Info />
                 Investigate with AI - <span className="italic text-white">new</span>
              </span>
              
              <div className="flex border border-white rounded-lg divide-x divide-white overflow-hidden bg-black">
                {['1h', '3h', '12h', '1d', '3d', '1w'].map((range) => (
                  <button 
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm transition-colors ${timeRange === range ? 'bg-black text-white font-medium' : 'bg-black text-white hover:bg-black hover:text-white'}`}
                  >
                    {range}
                  </button>
                ))}
                <button className="px-3 py-1.5 text-sm bg-black text-white hover:bg-black hover:text-white flex items-center gap-2 transition-colors">
                  Custom
                  <Icons.Calendar />
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-white rounded-lg text-sm bg-black text-white hover:bg-black hover:text-white transition-colors">
                   UTC timezone
                   <Icons.ChevronDown />
                </button>
              </div>

              <div className="flex">
                <button className="p-2 border border-white rounded-l-lg bg-black text-white hover:text-white hover:bg-black transition-colors">
                  <Icons.Refresh />
                </button>
                <button className="p-2 border-t border-b border-r border-white rounded-r-lg bg-black text-white hover:text-white hover:bg-black transition-colors">
                  <Icons.ChevronDown />
                </button>
              </div>

              <button className="flex items-center gap-2 px-3 py-1.5 border border-white rounded-lg text-sm font-medium text-white bg-black hover:bg-black hover:text-white transition-colors">
                 <Icons.Compass />
                 Explore related
              </button>
              
              <button className="p-1.5 hover:bg-black rounded-lg text-white hover:text-white transition-colors">
                <Icons.Kebab />
              </button>
            </div>
          </div>
        </div>

        {/* 3. CloudWatch Metrics Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-2">CloudWatch metrics</h3>
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
            Lambda sends runtime metrics for your functions to Amazon CloudWatch. The metrics shown are an aggregate view of all function runtime activity. To view metrics for the unqualified or $LATEST resource, choose <span className="text-zinc-300 font-medium">Filter metrics by</span>. To view metrics for a specific function version or alias, choose <span className="text-zinc-300 font-medium">Aliases</span> or <span className="text-zinc-300 font-medium">Versions</span>, select the alias or version, and then choose <span className="text-zinc-300 font-medium">Monitor</span>.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Metric Card 1: Invocations */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 h-64 flex flex-col hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm text-zinc-200 font-medium">Invocations</h4>
                  <Icons.Info />
                </div>
                <Icons.Kebab />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between text-xs text-zinc-500 mb-8">
                   <span>Count</span>
                </div>
                
                {/* Graph Placeholder - Dark Mode */}
                <div className="flex-1 flex flex-col items-center justify-center border-b border-zinc-800 relative">
                    <div className="w-full h-full absolute inset-0 opacity-10" 
                         style={{backgroundImage: 'linear-gradient(to bottom, #71717a 1px, transparent 1px)', backgroundSize: '100% 25%'}}>
                    </div>
                    <span className="text-sm text-zinc-500">No data available.</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the dashboard time range.</span>
                </div>

                {/* X Axis */}
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>19:30</span>
                  <span>20:30</span>
                  <span>21:30</span>
                </div>
                
                {/* Legend */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-zinc-100 rounded-sm"></div>
                  <span className="text-xs text-zinc-400">Invocations [sum: --]</span>
                </div>
              </div>
            </div>

            {/* Metric Card 2: Duration */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 h-64 flex flex-col hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm text-zinc-200 font-medium">Duration</h4>
                  <Icons.Info />
                </div>
                <Icons.Kebab />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between text-xs text-zinc-500 mb-8">
                   <span>Milliseconds</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center border-b border-zinc-800 relative">
                    <div className="w-full h-full absolute inset-0 opacity-10" 
                         style={{backgroundImage: 'linear-gradient(to bottom, #71717a 1px, transparent 1px)', backgroundSize: '100% 25%'}}>
                    </div>
                    <span className="text-sm text-zinc-500">No data available.</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the dashboard time range.</span>
                </div>

                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>19:30</span>
                  <span>20:30</span>
                  <span>21:30</span>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-zinc-100 rounded-full"></div>
                    <span className="text-xs text-zinc-400">Minimum [--]</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full"></div>
                    <span className="text-xs text-zinc-400">Average [--]</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full"></div>
                    <span className="text-xs text-zinc-400">Maximum [--]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Card 3: Error count */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 h-64 flex flex-col hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm text-zinc-200 font-medium">Error count and success rate</h4>
                  <Icons.Info />
                </div>
                <Icons.Kebab />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between text-xs text-zinc-500 mb-8">
                   <span>Count</span>
                   <span>%</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center border-b border-zinc-800 relative">
                    <div className="w-full h-full absolute inset-0 opacity-10" 
                         style={{backgroundImage: 'linear-gradient(to bottom, #71717a 1px, transparent 1px)', backgroundSize: '100% 25%'}}>
                    </div>
                    <span className="text-sm text-zinc-500">No data available.</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the dashboard time range.</span>
                </div>

                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>19:30</span>
                  <span>20:30</span>
                  <span>21:30</span>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-zinc-400">Errors [max: --]</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-zinc-400">Success rate [min: --%]</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <hr className="my-8 border-zinc-800" />

        {/* 4. CloudWatch Logs Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-2">CloudWatch Logs</h3>
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
            Lambda logs all requests handled by your function and automatically stores logs generated by your code through Amazon CloudWatch Logs. To validate your code, instrument it with custom logging statements. The following tables list the most recent and most expensive function invocations across all function activity. To view logs for a specific function version or alias, visit the <span className="text-zinc-300 font-medium">Monitor</span> section at that level.
          </p>

          <div className="space-y-4">
             {/* Recent Invocations Table */}
             <div className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                    <h4 className="text-sm font-medium text-zinc-200">Recent invocations</h4>
                    <div className="flex gap-2 text-zinc-500">
                        <button className="hover:text-zinc-300"><Icons.Maximize /></button>
                        <button className="hover:text-zinc-300"><Icons.Kebab /></button>
                    </div>
                </div>
                <div className="h-40 flex flex-col items-center justify-center bg-zinc-950/30">
                    <span className="text-sm text-zinc-500">No data found.</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the dashboard time range or log query.</span>
                </div>
             </div>

             {/* Most Expensive Table */}
             <div className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                    <h4 className="text-sm font-medium text-zinc-200">Most expensive invocations in GB-seconds (memory assigned * billed duration)</h4>
                    <button className="text-zinc-500 hover:text-zinc-300"><Icons.Kebab /></button>
                </div>
                <div className="h-40 flex flex-col items-center justify-center bg-zinc-950/30">
                    <span className="text-sm text-zinc-500">No data found.</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the dashboard time range or log query.</span>
                </div>
             </div>
          </div>
        </div>

        <hr className="my-8 border-zinc-800" />

        {/* 5. AWS X-Ray Section */}
        <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-2">AWS X-Ray</h3>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                CloudWatch integrates with AWS X-Ray to provide an end-to-end view of your application. These integrated services provide a service map, which displays your service endpoints and resources as nodes and highlights the traffic, latency, and errors for each node and its connections.
            </p>

            {/* Service Map */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                    <h4 className="text-sm font-medium text-zinc-200">Service map</h4>
                    <button className="text-zinc-500 hover:text-zinc-300"><Icons.Kebab /></button>
                </div>
                <div className="h-64 flex flex-col items-center justify-center bg-zinc-950/30">
                    <span className="text-sm font-medium text-zinc-400">No services</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the time range</span>
                </div>
            </div>
        </div>

        {/* 6. Traces Section */}
        <div className="mb-12 border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden shadow-sm">
             {/* Trace Header */}
             <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                 <div>
                     <h4 className="text-sm font-medium text-zinc-200 mb-1">No node selected</h4>
                     <p className="text-xs text-zinc-500">Select a node to see its details</p>
                 </div>
                 <div className="flex gap-3">
                     <button className="px-3 py-1.5 border border-zinc-700 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition-colors">
                        View logs <Icons.ExternalLink />
                     </button>
                     <button className="px-3 py-1.5 border border-zinc-700 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition-colors">
                        View traces <Icons.ExternalLink />
                     </button>
                     <button className="px-3 py-1.5 border border-zinc-700 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition-colors">
                        Analyze traces <Icons.ExternalLink />
                     </button>
                     <button className="px-3 py-1.5 border border-zinc-700 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition-colors">
                        View dashboard <Icons.ExternalLink />
                     </button>
                 </div>
             </div>

             {/* Traces List */}
             <div className="p-4">
                 <h4 className="text-sm font-medium text-zinc-200 mb-4">Traces</h4>
                 
                 {/* Filter Bar */}
                 <div className="flex gap-2 mb-4">
                     <div className="relative">
                         <div className="flex items-center px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300">
                             Custom query: service(id(name: "lmlens-pdf-processor", type: "AW... 
                             <button className="ml-2 text-zinc-500 hover:text-zinc-300">×</button>
                         </div>
                     </div>
                 </div>

                 <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-2.5 text-zinc-500">
                           <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Start typing to filter trace list" 
                            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-zinc-600 disabled:opacity-50 hover:text-zinc-400 transition-colors">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <span className="text-sm font-medium text-white">1</span>
                        <button className="text-zinc-600 disabled:opacity-50 hover:text-zinc-400 transition-colors">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                             <Icons.Settings />
                        </button>
                    </div>
                 </div>

                 {/* Table Header */}
                 <div className="border-b border-zinc-800 pb-2 mb-4 flex text-xs font-medium text-zinc-400 uppercase tracking-wide">
                     <div className="w-32 flex items-center gap-1 cursor-pointer hover:text-zinc-200">ID <span className="text-[10px]">▼</span></div>
                     <div className="w-32 border-l border-zinc-800 pl-4 flex items-center gap-1 cursor-pointer hover:text-zinc-200">Trace status <span className="text-[10px]">▼</span></div>
                     <div className="w-40 border-l border-zinc-800 pl-4 flex items-center gap-1 cursor-pointer hover:text-zinc-200">Timestamp <span className="text-[10px]">▼</span></div>
                     <div className="w-32 border-l border-zinc-800 pl-4 flex items-center gap-1 cursor-pointer hover:text-zinc-200">Response code <span className="text-[10px]">▼</span></div>
                     <div className="w-32 border-l border-zinc-800 pl-4 flex items-center gap-1 cursor-pointer hover:text-zinc-200">Response Time <span className="text-[10px]">▼</span></div>
                     <div className="w-32 border-l border-zinc-800 pl-4 flex items-center gap-1 cursor-pointer hover:text-zinc-200">Duration <span className="text-[10px]">▼</span></div>
                     <div className="w-32 border-l border-zinc-800 pl-4 flex items-center gap-1 cursor-pointer hover:text-zinc-200">HTTP Method <span className="text-[10px]">▼</span></div>
                     <div className="flex-1 border-l border-zinc-800 pl-4 flex justify-between cursor-pointer hover:text-zinc-200">
                         URL Address
                         <span className="text-[10px]">▼</span>
                     </div>
                 </div>

                 {/* Empty State */}
                 <div className="h-24 flex flex-col items-center justify-center border-b border-zinc-800/50 mb-2">
                    <span className="text-sm font-medium text-zinc-400">No services</span>
                    <span className="text-xs text-zinc-600 mt-1">Try adjusting the time range</span>
                 </div>
             </div>
        </div>

      </div>
    </div>
  )
}