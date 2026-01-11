'use client'

import { useState, useRef, useEffect } from 'react'

interface Model {
  id: string
  name: string
  baseModel: string
  parameters: string
  weightSize: string
  status: 'idle' | 'training' | 'ready'
  dataset: string
  updated: string
}

interface Dataset {
  id: string
  name: string
  fileType: string
  samples: number
  size: string
  status: 'uploaded' | 'validated'
  uploadedAt: string
}

interface Version {
  id: string
  datasetUsed: string
  createdAt: string
  status: 'active' | 'inactive'
}

interface InferenceHistory {
  id: string
  timestamp: string
  prompt: string
  tokensIn: number
  tokensOut: number
  latency: number
  status: 'completed' | 'error'
}

const mockModels: Model[] = [
  {
    id: 'llama-3-7b-finance',
    name: 'llama-3-7b-finance',
    baseModel: 'LLaMA 3',
    parameters: '7B',
    weightSize: '13.5 GB',
    status: 'ready',
    dataset: 'financial-data-v2',
    updated: '2024-01-15'
  },
  {
    id: 'mistral-7b-code',
    name: 'mistral-7b-code',
    baseModel: 'Mistral',
    parameters: '7B',
    weightSize: '14.2 GB',
    status: 'training',
    dataset: 'code-dataset-v1',
    updated: '2024-01-14'
  },
  {
    id: 'llama-2-13b-chat',
    name: 'llama-2-13b-chat',
    baseModel: 'LLaMA 2',
    parameters: '13B',
    weightSize: '26.8 GB',
    status: 'idle',
    dataset: 'None',
    updated: '2024-01-10'
  }
]

const mockDatasets: Dataset[] = [
  {
    id: 'financial-data-v2',
    name: 'financial-data-v2',
    fileType: 'JSONL',
    samples: 50000,
    size: '2.3 GB',
    status: 'validated',
    uploadedAt: '2024-01-12'
  },
  {
    id: 'code-dataset-v1',
    name: 'code-dataset-v1',
    fileType: 'CSV',
    samples: 75000,
    size: '1.8 GB',
    status: 'uploaded',
    uploadedAt: '2024-01-14'
  }
]

const mockVersions: Version[] = [
  { id: 'v3', datasetUsed: 'financial-data-v2', createdAt: '2024-01-15', status: 'active' },
  { id: 'v2', datasetUsed: 'financial-data-v1', createdAt: '2024-01-10', status: 'inactive' },
  { id: 'v1', datasetUsed: 'base-dataset', createdAt: '2024-01-05', status: 'inactive' }
]

const mockInferenceHistory: InferenceHistory[] = [
  {
    id: '1',
    timestamp: '14:32:15',
    prompt: 'Analyze the quarterly financial report...',
    tokensIn: 45,
    tokensOut: 312,
    latency: 1240,
    status: 'completed'
  },
  {
    id: '2',
    timestamp: '14:28:03',
    prompt: 'What are the key risk factors in...',
    tokensIn: 28,
    tokensOut: 156,
    latency: 890,
    status: 'completed'
  },
  {
    id: '3',
    timestamp: '14:25:41',
    prompt: 'Generate a summary of market trends...',
    tokensIn: 32,
    tokensOut: 0,
    latency: 0,
    status: 'error'
  }
]

export default function ModelsView() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'weights' | 'datasets' | 'training' | 'inference' | 'versions'>('overview')
  const [trainingState, setTrainingState] = useState<'idle' | 'running' | 'completed'>('idle')
  const [trainingProgress, setTrainingProgress] = useState(0)
  
  // Inference state
  const [prompt, setPrompt] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [showSystemPrompt, setShowSystemPrompt] = useState(false)
  const [output, setOutput] = useState('')
  const [inferenceState, setInferenceState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(512)
  const [topP, setTopP] = useState(0.9)
  const [topK, setTopK] = useState(40)
  const [stopSequences, setStopSequences] = useState('')
  const [tokensIn, setTokensIn] = useState(0)
  const [tokensOut, setTokensOut] = useState(0)
  const [latency, setLatency] = useState(0)
  const [isWarm, setIsWarm] = useState(true)
  
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const StatusDot = ({ status }: { status: Model['status'] }) => {
    const colors = {
      idle: 'bg-zinc-500',
      training: 'bg-yellow-500 animate-pulse',
      ready: 'bg-green-500'
    }
    return <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
  }

  const runInference = async () => {
    if (!prompt.trim()) return
    
    setInferenceState('running')
    setOutput('')
    setTokensIn(prompt.split(' ').length)
    const startTime = Date.now()
    
    // Simulate streaming response
    const mockResponse = "Based on the financial data provided, I can see several key trends emerging in Q4. The revenue growth of 12.3% year-over-year indicates strong market performance, particularly in the technology and healthcare sectors. However, there are some concerning indicators in the supply chain metrics that warrant closer examination.\n\nKey findings:\n1. Revenue increased by $2.4M compared to Q3\n2. Operating margins improved by 1.8%\n3. Customer acquisition costs decreased by 15%\n4. Inventory turnover ratio shows optimization\n\nRecommendations for Q1 strategy should focus on maintaining this growth trajectory while addressing the identified supply chain bottlenecks."
    
    let currentOutput = ''
    const words = mockResponse.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      currentOutput += (i === 0 ? '' : ' ') + words[i]
      setOutput(currentOutput)
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    }
    
    const endTime = Date.now()
    setLatency(endTime - startTime)
    setTokensOut(words.length)
    setInferenceState('completed')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      runInference()
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
  }

  const loadHistoryItem = (item: InferenceHistory) => {
    setPrompt(item.prompt)
    if (item.status === 'completed') {
      setOutput('Previous output would be loaded here...')
      setInferenceState('completed')
      setTokensIn(item.tokensIn)
      setTokensOut(item.tokensOut)
      setLatency(item.latency)
    }
  }

  if (selectedModel) {
    return (
      <div className="flex-1 flex flex-col bg-black text-white">
        {/* Header */}
        <div className="border-b-line p-6">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => setSelectedModel(null)}
                className="text-zinc-400 hover:text-white mb-2 text-[11px] font-bold"
              >
                ← BACK TO MODELS
              </button>
              <div className="space-y-1">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">MODEL</div>
                <div className="text-xl font-mono text-white">{selectedModel.name}</div>
                <div className="flex items-center gap-4 text-[11px] text-zinc-400">
                  <span>Base: {selectedModel.baseModel}</span>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <StatusDot status={selectedModel.status} />
                    <span className="capitalize">{selectedModel.status}</span>
                  </div>
                  <span>Active Version: v3</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-zinc-950 border-line hover:bg-zinc-900 text-white text-[11px] font-bold rounded transition">
                RUN INFERENCE
              </button>
              <button className="px-4 py-2 bg-zinc-950 border-line hover:bg-zinc-900 text-white text-[11px] font-bold rounded transition">
                UPLOAD DATASET
              </button>
              <button className="px-4 py-2 bg-zinc-950 border-line hover:bg-zinc-900 text-white text-[11px] font-bold rounded transition">
                TRAIN MODEL
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b-line">
          <div className="flex px-6">
            {(['overview', 'weights', 'datasets', 'training', 'inference', 'versions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[11px] font-bold transition relative ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-zinc-600 hover:text-white'
                }`}
              >
                {tab.toUpperCase()}
                {activeTab === tab && <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-white"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
                {[
                  ['Model Name', selectedModel.name],
                  ['Base Model', selectedModel.baseModel],
                  ['Parameter Count', selectedModel.parameters],
                  ['Precision', 'FP16'],
                  ['Total Weight Size', selectedModel.weightSize],
                  ['Storage Location', '/models/llama-3-7b-finance'],
                  ['Current Status', selectedModel.status],
                  ['Active Version', 'v3'],
                  ['Created At', '2024-01-05 14:30:22'],
                  ['Last Updated', selectedModel.updated]
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2">
                    <span className="text-zinc-400 text-[11px] font-medium">{label}</span>
                    <span className={`text-[11px] ${label.includes('Location') || label.includes('Version') ? 'font-mono' : ''} text-white`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weights' && (
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">WEIGHT FORMAT</div>
                <div className="text-[11px] text-white">safetensors</div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">TOTAL SIZE</div>
                <div className="text-[11px] text-white">{selectedModel.weightSize}</div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">NUMBER OF SHARDS</div>
                <div className="text-[11px] text-white">4</div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">CHECKSUM</div>
                <div className="text-[11px] font-mono text-zinc-400">sha256:a1b2c3d4e5f6...</div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">LOAD MODE</div>
                <div className="text-[11px] text-white">Frozen</div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">STORAGE PATH</div>
                <div className="text-[11px] font-mono text-zinc-400">/models/weights/model-00001-of-00004.safetensors</div>
              </div>
              <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">LAST LOADED</div>
                <div className="text-[11px] text-white">2024-01-15 09:15:33</div>
              </div>
            </div>
          )}

          {activeTab === 'datasets' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">DATASETS</div>
                <button className="px-4 py-2 bg-zinc-950 border-line hover:bg-zinc-900 text-white text-[11px] font-bold rounded transition">
                  UPLOAD DATASET
                </button>
              </div>
              <div className="space-y-2">
                {mockDatasets.map((dataset) => (
                  <div key={dataset.id} className="border-line rounded p-4 hover:bg-zinc-950/50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-mono text-white">{dataset.name}</div>
                        <div className="text-[9px] text-zinc-400 mt-1">
                          {dataset.fileType} • {dataset.samples.toLocaleString()} samples • {dataset.size}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                          dataset.status === 'validated' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {dataset.status.toUpperCase()}
                        </span>
                        <span className="text-[9px] text-zinc-500">{dataset.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="p-6 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">TRAINING CONFIGURATION</div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-zinc-400 tracking-wide mb-2">DATASET</label>
                    <select className="w-full p-2 bg-zinc-950 border-line rounded text-[11px] text-white">
                      <option>financial-data-v2</option>
                      <option>code-dataset-v1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-zinc-400 tracking-wide mb-2">EPOCHS</label>
                    <input type="number" defaultValue="3" className="w-full p-2 bg-zinc-950 border-line rounded text-[11px] text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-zinc-400 tracking-wide mb-2">LEARNING RATE</label>
                    <input type="number" defaultValue="0.0001" step="0.0001" className="w-full p-2 bg-zinc-950 border-line rounded text-[11px] text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-zinc-400 tracking-wide mb-2">BATCH SIZE</label>
                    <input type="number" defaultValue="16" className="w-full p-2 bg-zinc-950 border-line rounded text-[11px] text-white" />
                  </div>
                  <button 
                    disabled={trainingState === 'running'}
                    className="w-full px-4 py-2 bg-white text-black text-[11px] font-black rounded transition hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400"
                  >
                    {trainingState === 'running' ? 'TRAINING...' : 'START TRAINING'}
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide">TRAINING STATUS</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-zinc-400">Training State</span>
                      <span className="text-white capitalize">{trainingState}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-zinc-400">Progress</span>
                      <span className="text-white">{trainingProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${trainingProgress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Current Epoch</span>
                      <span className="text-white">1/3</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Loss</span>
                      <span className="font-mono text-white">0.245</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inference' && (
            <div className="flex-1 flex flex-col">
              {/* Inference Layout */}
              <div className="flex-1 grid grid-cols-2 min-h-0">
                {/* Left Column - Prompt Input */}
                <div className="border-r-line flex flex-col">
                  <div className="p-4 border-b-line">
                    <div className="text-[9px] font-black text-zinc-400 tracking-wide mb-3">PROMPT INPUT</div>
                    
                    {/* System Prompt Toggle */}
                    <button 
                      onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                      className="text-[9px] font-bold text-zinc-400 hover:text-white mb-3 transition"
                    >
                      {showSystemPrompt ? '▼' : '▶'} SYSTEM PROMPT
                    </button>
                    
                    {/* System Prompt */}
                    {showSystemPrompt && (
                      <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="You are a helpful AI assistant..."
                        className="w-full h-20 p-3 bg-zinc-950 border-line rounded text-[11px] font-mono text-white resize-none mb-3"
                      />
                    )}
                  </div>
                  
                  {/* Main Prompt */}
                  <div className="flex-1 p-4 flex flex-col">
                    <textarea
                      ref={promptRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your prompt here...

Press Ctrl+Enter to run inference"
                      className="flex-1 w-full p-3 bg-zinc-950 border-line rounded text-[11px] font-mono text-white resize-none"
                    />
                    
                    <button 
                      onClick={runInference}
                      disabled={!prompt.trim() || inferenceState === 'running'}
                      className="mt-3 px-4 py-2 bg-white text-black text-[11px] font-black rounded transition hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {inferenceState === 'running' ? 'RUNNING...' : 'RUN INFERENCE'}
                    </button>
                  </div>
                </div>

                {/* Right Column - Model Output */}
                <div className="flex flex-col">
                  <div className="p-4 border-b-line flex justify-between items-center">
                    <div className="text-[9px] font-black text-zinc-400 tracking-wide">MODEL OUTPUT</div>
                    {output && (
                      <button 
                        onClick={copyOutput}
                        className="text-[9px] font-bold text-zinc-400 hover:text-white transition"
                      >
                        COPY
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div 
                      ref={outputRef}
                      className="h-full w-full p-3 bg-zinc-950 border-line rounded text-[11px] font-mono text-white overflow-auto"
                    >
                      {inferenceState === 'idle' && (
                        <div className="text-zinc-500">Output will appear here...</div>
                      )}
                      {inferenceState === 'running' && !output && (
                        <div className="text-zinc-400 flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          Generating response...
                        </div>
                      )}
                      {output && (
                        <div className="whitespace-pre-wrap">{output}</div>
                      )}
                      {inferenceState === 'running' && output && (
                        <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inference Parameters & Metadata */}
              <div className="border-t-line">
                <div className="grid grid-cols-2">
                  {/* Parameters */}
                  <div className="p-4 border-r-line">
                    <div className="text-[9px] font-black text-zinc-400 tracking-wide mb-3">PARAMETERS</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] text-zinc-500 mb-1">Temperature</label>
                        <input 
                          type="number" 
                          value={temperature} 
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          step="0.1" 
                          min="0" 
                          max="2"
                          className="w-full p-1 bg-zinc-950 border-line rounded text-[10px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 mb-1">Max Tokens</label>
                        <input 
                          type="number" 
                          value={maxTokens} 
                          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                          className="w-full p-1 bg-zinc-950 border-line rounded text-[10px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 mb-1">Top-p</label>
                        <input 
                          type="number" 
                          value={topP} 
                          onChange={(e) => setTopP(parseFloat(e.target.value))}
                          step="0.1" 
                          min="0" 
                          max="1"
                          className="w-full p-1 bg-zinc-950 border-line rounded text-[10px] text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="p-4">
                    <div className="text-[9px] font-black text-zinc-400 tracking-wide mb-3">INFERENCE METADATA</div>
                    <div className="grid grid-cols-4 gap-4 text-[9px]">
                      <div>
                        <div className="text-zinc-500">Model Version</div>
                        <div className="text-white font-mono">v3</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Tokens In/Out</div>
                        <div className="text-white font-mono">{tokensIn}/{tokensOut}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Latency</div>
                        <div className="text-white font-mono">{latency}ms</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Status</div>
                        <div className={`font-mono ${
                          isWarm ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {isWarm ? 'WARM' : 'COLD'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inference History */}
              <div className="border-t-line p-4">
                <div className="text-[9px] font-black text-zinc-400 tracking-wide mb-3">INFERENCE HISTORY</div>
                <div className="space-y-1">
                  {mockInferenceHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="w-full text-left p-2 hover:bg-zinc-950/50 rounded transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="text-[10px] text-white truncate">
                            {item.prompt.length > 60 ? item.prompt.substring(0, 60) + '...' : item.prompt}
                          </div>
                          <div className="text-[9px] text-zinc-500 mt-1">
                            {item.timestamp} • {item.tokensIn}→{item.tokensOut} tokens • {item.latency}ms
                          </div>
                        </div>
                        <div className={`text-[9px] font-bold ${
                          item.status === 'completed' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.status.toUpperCase()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="p-6 space-y-4">
              <div className="text-[9px] font-black text-zinc-400 tracking-wide">VERSIONS</div>
              <div className="space-y-2">
                {mockVersions.map((version) => (
                  <div key={version.id} className={`border-line rounded p-4 transition ${
                    version.status === 'active' ? 'bg-zinc-950/50' : 'hover:bg-zinc-950/30'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[11px] font-mono text-white">{version.id}</div>
                        <div className="text-[9px] text-zinc-400 mt-1">
                          Dataset: {version.datasetUsed} • Created: {version.createdAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                          version.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-zinc-700/50 text-zinc-300'
                        }`}>
                          {version.status.toUpperCase()}
                        </span>
                        {version.status === 'inactive' && (
                          <button className="text-[9px] font-bold text-white hover:text-zinc-300 transition">
                            SET ACTIVE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Models List View
  return (
    <div className="flex-1 flex flex-col bg-black text-white">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-black border-b-line">
            <tr>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">MODEL NAME</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">BASE MODEL</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">PARAMETERS</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">WEIGHT SIZE</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">STATUS</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">DATASET</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">UPDATED</th>
              <th className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 tracking-wide">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {mockModels.map((model) => (
              <tr key={model.id} className="border-b-line hover:bg-zinc-950/50 transition">
                <td className="py-4 px-6">
                  <button 
                    onClick={() => setSelectedModel(model)}
                    className="text-white hover:text-zinc-300 font-mono text-[11px] transition"
                  >
                    {model.name}
                  </button>
                </td>
                <td className="py-4 px-6 text-[11px] text-zinc-300">{model.baseModel}</td>
                <td className="py-4 px-6 text-[11px] text-zinc-300">{model.parameters}</td>
                <td className="py-4 px-6 text-[11px] text-zinc-300">{model.weightSize}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <StatusDot status={model.status} />
                    <span className="text-[11px] text-zinc-300 capitalize">{model.status}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-[11px] text-zinc-300">{model.dataset}</td>
                <td className="py-4 px-6 text-[11px] text-zinc-300">{model.updated}</td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => setSelectedModel(model)}
                    className="text-white hover:text-zinc-300 text-[11px] font-bold transition"
                  >
                    VIEW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}