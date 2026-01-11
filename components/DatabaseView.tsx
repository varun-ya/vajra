'use client'

import { useState, useRef } from 'react'

// --- Custom Icons (Clean Enterprise Theme) ---
const Icons = {
  Lightning: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8.5 1.5l-5 8h4l-1.5 5 5-8h-4l1.5-5z" /></svg>,
  Monitor: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  Gear: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  Play: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>,
  FileText: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  ChevronDown: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>,
  Code: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Upload: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  History: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12a10 10 0 00-10-10 10 10 0 00-10 10c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10z" /><polyline points="12 6 12 12 16 14" /></svg>,
  Book: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
  Question: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  ExternalArrow: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  XCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  Alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
}

// --- Utils ---
const generateRequestId = () => Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6)
const getCurrentTimestamp = () => new Date().toISOString()

export default function CleanTestEventView() {
  const [action, setAction] = useState('create')
  const [invocationType, setInvocationType] = useState('synchronous')
  const [privacy, setPrivacy] = useState('private')
  const [eventName, setEventName] = useState('')
  const [nameError, setNameError] = useState('')
  const [jsonContent, setJsonContent] = useState(`{
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}`)
  const [selectedTemplate, setSelectedTemplate] = useState('Hello World')
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; duration: string; logs: string; memory: string; billed: string } | null>(null)
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'error' | 'info'}[]>([])

  // --- Logic & Handlers (Identical to previous logic) ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const validateEventName = (name: string) => {
    setEventName(name)
    if (name.length > 25) setNameError('Max 25 chars')
    else if (name.length > 0 && !/^[a-zA-Z0-9._-]+$/.test(name)) setNameError('Invalid characters')
    else setNameError('')
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    const templates: Record<string, string> = {
      'Hello World': `{\n  "message": "Hello World"\n}`,
      'API Gateway Event': `{\n  "httpMethod": "GET",\n  "path": "/hello",\n  "headers": {\n    "Accept": "*/*"\n  }\n}`,
      'S3 Event': `{\n  "Records": [{\n    "s3": {\n      "bucket": {"name": "my-bucket"},\n      "object": {"key": "hello.txt"}\n    }\n  }]\n}`,
      'DynamoDB Event': `{\n  "Records": [{\n    "eventName": "INSERT",\n    "dynamodb": {\n      "Keys": {"id": {"S": "123"}}\n    }\n  }]\n}`
    }
    setJsonContent(templates[template] || templates['Hello World'])
    addToast(`Loaded ${template}`, 'info')
  }

  const formatJson = () => {
    try {
      setJsonContent(JSON.stringify(JSON.parse(jsonContent), null, 2))
      addToast('JSON formatted', 'success')
    } catch (e) { addToast('Invalid JSON', 'error') }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonContent)
    addToast('Copied to clipboard', 'success')
  }

  const exportEvent = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${eventName || 'test-event'}.json`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    addToast('Event exported', 'success')
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleImportClick = () => fileInputRef.current?.click()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setJsonContent(ev.target?.result as string)
        addToast('Import successful', 'success')
      }
      reader.readAsText(file)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = () => {
    if (nameError || !eventName) { addToast('Invalid name', 'error'); return }
    addToast('Draft saved', 'success')
  }

  const runTest = () => {
    try { JSON.parse(jsonContent) } catch (e) { addToast('Invalid JSON', 'error'); return }
    setIsTestRunning(true); setTestResult(null)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2
      const reqId = generateRequestId()
      setTestResult({
        success: isSuccess,
        duration: `${(Math.random() * 100).toFixed(2)} ms`,
        logs: isSuccess ? `START RequestId: ${reqId}\n[INFO] Success.\nEND RequestId: ${reqId}` : `START RequestId: ${reqId}\n[ERROR] Failed.\nEND RequestId: ${reqId}`,
        memory: "128 MB",
        billed: `${Math.ceil(Math.random() * 100)} ms`
      })
      setIsTestRunning(false)
      addToast(isSuccess ? 'Success' : 'Failed', isSuccess ? 'success' : 'error')
    }, 1200)
  }

  return (
    <div className="flex-1 bg-black overflow-y-auto min-h-screen font-sans text-zinc-300">
      
      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-medium flex items-center gap-3 shadow-xl">
             {toast.type === 'success' && <div className="text-white"><Icons.CheckCircle /></div>}
             {toast.type === 'error' && <div className="text-white"><Icons.Alert /></div>}
             {toast.type === 'info' && <div className="text-zinc-400"><Icons.Alert /></div>}
             <span className="text-zinc-200">{toast.message}</span>
          </div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />

      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-20">
        <div className="px-6 py-3 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
              <Icons.Lightning />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">Test Event Configuration</h1>
              <p className="text-[11px] text-zinc-500">Function: lmlens-pdf-processor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
              <Icons.Monitor /> CloudWatch Logs
            </button>
            <div className="w-px h-4 bg-zinc-800 mx-1"></div>
            <button onClick={handleSave} className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              Save Draft
            </button>
            <button 
              onClick={runTest}
              disabled={isTestRunning}
              className={`ml-2 px-4 py-1.5 text-xs font-bold text-black bg-white rounded hover:bg-zinc-200 transition-colors flex items-center gap-2 ${isTestRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isTestRunning ? 'Running...' : <><Icons.Play /> Test Function</>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Action Card */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-zinc-100">
                <Icons.Gear />
                <h2 className="text-sm font-semibold">Test Action</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`group relative flex items-center p-4 rounded-lg cursor-pointer border transition-all ${action === 'create' ? 'bg-zinc-900 border-zinc-700' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
                  <input type="radio" name="action" value="create" checked={action === 'create'} onChange={(e) => setAction(e.target.value)} className="sr-only" />
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${action === 'create' ? 'border-white' : 'border-zinc-600'}`}>
                      {action === 'create' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Create New Event</div>
                      <div className="text-xs text-zinc-500">Start from a template</div>
                    </div>
                  </div>
                </label>
                <div className="relative flex items-center p-4 rounded-lg border border-zinc-900 bg-black opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-zinc-800" />
                    <div>
                      <div className="text-sm font-medium text-zinc-500">Edit Saved Event</div>
                      <div className="text-xs text-zinc-700">Modify existing event</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Event Settings */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-zinc-100">
                <Icons.FileText />
                <h2 className="text-sm font-semibold">Event Settings</h2>
              </div>
              <div className="space-y-4 bg-zinc-900/30 p-1 rounded-xl border border-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Event Name</label>
                        <input
                            type="text"
                            placeholder="e.g. MyTestEvent"
                            value={eventName}
                            onChange={(e) => validateEventName(e.target.value)}
                            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors ${nameError ? 'border-red-900' : 'border-zinc-800'}`}
                        />
                        {nameError && <p className="text-[10px] text-red-500 mt-1">{nameError}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Template</label>
                        <div className="relative">
                            <select 
                                value={selectedTemplate}
                                onChange={(e) => handleTemplateChange(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
                            >
                                <option>Hello World</option>
                                <option>API Gateway Event</option>
                                <option>S3 Event</option>
                                <option>DynamoDB Event</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"><Icons.ChevronDown /></div>
                        </div>
                    </div>
                </div>
              </div>
            </section>

            {/* JSON Editor */}
            <section className="flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-zinc-100">
                    <Icons.Code />
                    <h2 className="text-sm font-semibold">Event JSON</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={formatJson} className="text-xs text-zinc-500 hover:text-white px-2 py-1 transition-colors">Format</button>
                    <button onClick={copyToClipboard} className="text-xs text-zinc-500 hover:text-white px-2 py-1 transition-colors">Copy</button>
                </div>
              </div>
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded overflow-hidden relative group">
                <textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  className="w-full h-full p-4 font-mono text-xs bg-transparent text-zinc-300 placeholder-zinc-700 border-none outline-none resize-none leading-relaxed selection:bg-zinc-800"
                  spellCheck={false}
                />
                <div className="absolute bottom-2 right-4 text-[10px] text-zinc-700 font-mono pointer-events-none group-hover:text-zinc-500 transition-colors">JSON</div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Test Results (Conditional) */}
            {testResult && (
              <div className={`rounded-lg border p-5 duration-300 ${testResult.success ? 'bg-zinc-900/50 border-zinc-700' : 'bg-red-950/10 border-red-900/30'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={testResult.success ? 'text-white' : 'text-zinc-400'}>
                        {testResult.success ? <Icons.CheckCircle /> : <Icons.XCircle />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">{testResult.success ? 'Success' : 'Failed'}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {Math.random().toString(36).substr(2,8)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[11px] mb-4 border-b border-zinc-800/50 pb-4">
                    <div><span className="text-zinc-500 block mb-1">Duration</span><span className="text-white font-mono">{testResult.duration}</span></div>
                    <div><span className="text-zinc-500 block mb-1">Billed</span><span className="text-white font-mono">{testResult.billed}</span></div>
                    <div><span className="text-zinc-500 block mb-1">Memory</span><span className="text-white font-mono">{testResult.memory}</span></div>
                </div>
                <div className="bg-black/50 p-3 rounded border border-zinc-900/50 overflow-hidden">
                    <pre className="text-[10px] text-zinc-400 font-mono whitespace-pre-wrap">{testResult.logs}</pre>
                </div>
              </div>
            )}

            {/* Sidebar Cards */}
            <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="space-y-1">
                    {[
                        { icon: <Icons.Download />, text: 'Export Event', action: exportEvent },
                        { icon: <Icons.Upload />, text: 'Import Event', action: handleImportClick },
                        { icon: <Icons.History />, text: 'View History', action: () => addToast('History unavailable', 'info') }
                    ].map((item, i) => (
                        <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors group">
                            <span className="text-zinc-600 group-hover:text-white transition-colors">{item.icon}</span>
                            <span className="text-xs">{item.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Documentation</h3>
                <div className="space-y-1">
                    {[
                        'Lambda Testing Guide',
                        'Event Templates',
                        'Troubleshooting'
                    ].map((text, i) => (
                        <a key={i} href="#" className="flex items-center justify-between w-full px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="text-zinc-600 group-hover:text-white transition-colors"><Icons.Book /></span>
                                <span className="text-xs">{text}</span>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Icons.ExternalArrow /></span>
                        </a>
                    ))}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}