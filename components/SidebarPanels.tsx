'use client'

import { useState } from 'react'
import { useIDEStore } from '@/stores/ide-store'

export function DebugPanel() {
  const { 
    breakpoints, 
    debugSession, 
    startDebugSession, 
    stopDebugSession, 
    toggleBreakpoint 
  } = useIDEStore()

  return (
    <div className="flex flex-col h-full">
      <div className="h-10 px-4 flex items-center justify-between shrink-0">
        <span className="label">Debug</span>
        <div className="flex gap-2">
          <button
            onClick={debugSession ? stopDebugSession : startDebugSession}
            className={`px-2 py-1 text-xs rounded transition ${
              debugSession ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {debugSession ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      <div className="p-3 flex-1 space-y-3">
        <div className="text-xs text-zinc-400 mb-2">Variables</div>
        <div className="bg-black/30 rounded p-2 text-xs">
          <div className="text-zinc-400">No variables in scope</div>
        </div>
        
        <div className="text-xs text-zinc-400 mb-2">Call Stack</div>
        <div className="bg-black/30 rounded p-2 text-xs">
          <div className="text-zinc-400">Not debugging</div>
        </div>
        
        <div className="text-xs text-zinc-400 mb-2">Breakpoints</div>
        <div className="space-y-1">
          {Object.entries(breakpoints).map(([file, lines]) => 
            lines.map(line => (
              <div key={`${file}-${line}`} className="flex items-center gap-2 text-xs">
                <i className="ph-fill ph-circle text-red-400"></i>
                <span className="text-white">{file}:{line}</span>
                <button 
                  onClick={() => toggleBreakpoint(file, line)}
                  className="ml-auto text-zinc-600 hover:text-white"
                >
                  <i className="ph ph-x"></i>
                </button>
              </div>
            ))
          )}
          {Object.keys(breakpoints).length === 0 && (
            <div className="text-xs text-zinc-600">No breakpoints set</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ExtensionsPanel() {
  const extensions = [
    { id: 'prettier', name: 'Prettier', description: 'Code formatter', enabled: true },
    { id: 'eslint', name: 'ESLint', description: 'JavaScript linter', enabled: true },
    { id: 'typescript', name: 'TypeScript', description: 'TypeScript support', enabled: true },
    { id: 'tailwind', name: 'Tailwind CSS', description: 'CSS framework', enabled: false },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="h-10 px-4 flex items-center justify-between shrink-0">
        <span className="label">Extensions</span>
        <button className="text-xs text-zinc-600 hover:text-white">
          <i className="ph ph-plus"></i>
        </button>
      </div>
      <div className="p-3 flex-1 space-y-2">
        {extensions.map(ext => (
          <div key={ext.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5">
            <div className={`w-2 h-2 rounded-full ${ext.enabled ? 'bg-green-400' : 'bg-zinc-600'}`}></div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-white">{ext.name}</div>
              <div className="text-xs text-zinc-600">{ext.description}</div>
            </div>
            <button className="text-xs text-zinc-600 hover:text-white">
              {ext.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DatabasePanel() {
  const [selectedDb, setSelectedDb] = useState('postgres')
  const databases = [
    { id: 'postgres', name: 'PostgreSQL', status: 'connected' },
    { id: 'redis', name: 'Redis', status: 'disconnected' },
    { id: 'mongo', name: 'MongoDB', status: 'connected' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="h-10 px-4 flex items-center justify-between shrink-0">
        <span className="label">Database</span>
        <button className="text-xs text-zinc-600 hover:text-white">
          <i className="ph ph-plus"></i>
        </button>
      </div>
      <div className="p-3 flex-1 space-y-3">
        <div className="space-y-1">
          {databases.map(db => (
            <div 
              key={db.id}
              onClick={() => setSelectedDb(db.id)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                selectedDb === db.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                db.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="text-xs text-white">{db.name}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-zinc-800 pt-3">
          <div className="text-xs text-zinc-400 mb-2">Query</div>
          <textarea 
            placeholder="SELECT * FROM users;"
            className="w-full h-20 bg-black/50 border-line rounded p-2 text-xs text-white resize-none"
          />
          <button className="btn-primary text-xs mt-2 w-full">
            Execute Query
          </button>
        </div>
      </div>
    </div>
  )
}

export function APIPanel() {
  const { 
    apiRequests, 
    activeApiRequest, 
    addApiRequest, 
    setActiveApiRequest,
    deleteApiRequest,
    updateApiRequest
  } = useIDEStore()
  
  const [newRequest, setNewRequest] = useState({
    name: '',
    method: 'GET' as const,
    url: ''
  })
  
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'response'>('params')
  const [params, setParams] = useState<Array<{key: string, value: string, enabled: boolean}>>([])
  const [headers, setHeaders] = useState<Array<{key: string, value: string, enabled: boolean}>>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ])
  const [body, setBody] = useState('')
  const [response, setResponse] = useState<{status: number, data: any, time: number} | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const createRequest = () => {
    if (!newRequest.name || !newRequest.url) return
    
    const request = {
      id: Date.now().toString(),
      name: newRequest.name,
      method: newRequest.method,
      url: newRequest.url,
      headers: headers.filter(h => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
      body: body
    }
    
    addApiRequest(request)
    setNewRequest({ name: '', method: 'GET', url: '' })
  }

  const sendRequest = async () => {
    const activeReq = apiRequests.find(req => req.id === activeApiRequest)
    if (!activeReq) return

    setIsLoading(true)
    const startTime = Date.now()

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))
      
      const mockResponse = {
        status: 200,
        data: {
          message: 'Success',
          timestamp: new Date().toISOString(),
          data: { id: 1, name: 'Sample Data' }
        },
        time: Date.now() - startTime
      }
      
      setResponse(mockResponse)
    } catch (error) {
      setResponse({
        status: 500,
        data: { error: 'Request failed' },
        time: Date.now() - startTime
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addParam = () => {
    setParams([...params, { key: '', value: '', enabled: true }])
  }

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }

  const activeRequest = apiRequests.find(req => req.id === activeApiRequest)

  return (
    <div className="flex flex-col h-full">
      <div className="h-10 px-4 flex items-center justify-between shrink-0">
        <span className="label">API</span>
        <button 
          onClick={createRequest}
          className="text-xs text-zinc-600 hover:text-white"
        >
          <i className="ph ph-plus"></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* New Request Form */}
        <div className="p-3 border-b border-zinc-800 space-y-2">
          <input
            type="text"
            placeholder="Request name"
            value={newRequest.name}
            onChange={(e) => setNewRequest(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
          />
          <div className="flex gap-2">
            <select
              value={newRequest.method}
              onChange={(e) => setNewRequest(prev => ({ ...prev, method: e.target.value as any }))}
              className="bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              placeholder="https://api.example.com"
              value={newRequest.url}
              onChange={(e) => setNewRequest(prev => ({ ...prev, url: e.target.value }))}
              className="flex-1 bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
            />
          </div>
        </div>

        {/* Request List */}
        <div className="p-3 border-b border-zinc-800 max-h-32 overflow-y-auto">
          <div className="space-y-1">
            {apiRequests.map(request => (
              <div 
                key={request.id}
                onClick={() => setActiveApiRequest(request.id)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                  activeApiRequest === request.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <span className={`px-1 py-0.5 text-[8px] font-bold rounded ${
                  request.method === 'GET' ? 'bg-green-600' :
                  request.method === 'POST' ? 'bg-blue-600' :
                  request.method === 'PUT' ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}>
                  {request.method}
                </span>
                <span className="text-xs text-white flex-1 truncate">{request.name}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteApiRequest(request.id)
                  }}
                  className="text-xs text-zinc-600 hover:text-red-400"
                >
                  <i className="ph ph-x"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Request Details */}
        {activeRequest && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  activeRequest.method === 'GET' ? 'bg-green-600' :
                  activeRequest.method === 'POST' ? 'bg-blue-600' :
                  activeRequest.method === 'PUT' ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}>
                  {activeRequest.method}
                </span>
                <span className="text-xs text-white font-mono flex-1">{activeRequest.url}</span>
              </div>
              <button 
                onClick={sendRequest}
                disabled={isLoading}
                className="btn-primary text-xs w-full disabled:opacity-50"
              >
                {isLoading ? (
                  <><i className="ph ph-spinner animate-spin mr-2"></i>Sending...</>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              {['params', 'headers', 'body', 'response'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-2 text-xs font-semibold capitalize transition ${
                    activeTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-zinc-600 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {activeTab === 'params' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Query Parameters</span>
                    <button onClick={addParam} className="text-xs text-blue-400 hover:text-blue-300">
                      <i className="ph ph-plus"></i>
                    </button>
                  </div>
                  {params.map((param, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="checkbox" checked={param.enabled} className="w-3 h-3" />
                      <input 
                        placeholder="Key" 
                        value={param.key}
                        className="flex-1 bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
                      />
                      <input 
                        placeholder="Value" 
                        value={param.value}
                        className="flex-1 bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
                      />
                      <button className="text-xs text-red-400"><i className="ph ph-trash"></i></button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'headers' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Headers</span>
                    <button onClick={addHeader} className="text-xs text-blue-400 hover:text-blue-300">
                      <i className="ph ph-plus"></i>
                    </button>
                  </div>
                  {headers.map((header, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input 
                        type="checkbox" 
                        checked={header.enabled} 
                        onChange={(e) => {
                          const newHeaders = [...headers]
                          newHeaders[i].enabled = e.target.checked
                          setHeaders(newHeaders)
                        }}
                        className="w-3 h-3" 
                      />
                      <input 
                        placeholder="Key" 
                        value={header.key}
                        onChange={(e) => {
                          const newHeaders = [...headers]
                          newHeaders[i].key = e.target.value
                          setHeaders(newHeaders)
                        }}
                        className="flex-1 bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
                      />
                      <input 
                        placeholder="Value" 
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...headers]
                          newHeaders[i].value = e.target.value
                          setHeaders(newHeaders)
                        }}
                        className="flex-1 bg-black/50 border-line rounded px-2 py-1 text-xs text-white"
                      />
                      <button 
                        onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                        className="text-xs text-red-400"
                      >
                        <i className="ph ph-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'body' && (
                <div className="space-y-2">
                  <span className="text-xs text-zinc-400">Request Body</span>
                  <textarea 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="w-full h-32 bg-black/50 border-line rounded p-2 text-xs text-white font-mono resize-none"
                  />
                </div>
              )}

              {activeTab === 'response' && (
                <div className="space-y-2">
                  {response ? (
                    <>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded font-bold ${
                          response.status < 300 ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {response.status}
                        </span>
                        <span className="text-zinc-400">{response.time}ms</span>
                      </div>
                      <pre className="bg-black/50 border-line rounded p-2 text-xs text-white font-mono overflow-auto max-h-48">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <div className="text-xs text-zinc-600 text-center py-8">
                      Send a request to see the response
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}