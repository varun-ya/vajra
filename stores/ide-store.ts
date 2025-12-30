import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { FileTreeManager, FileTreeNode } from '@/lib/file-tree'

export interface FileTab {
  id: string
  name: string
  path: string
  content: string
  language: string
  isDirty: boolean
  icon?: string
}

interface TerminalTab {
  id: string
  name: string
  type: 'bash' | 'node' | 'python'
  isActive: boolean
}

interface APIRequest {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers: Record<string, string>
  body?: string
}

interface AIMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface IDEState {
  // UI State
  commandPalette: boolean
  aiModal: boolean
  aiChatOpen: boolean
  settingsModal: boolean
  settingsOpen: boolean
  globalSearch: boolean
  globalSearchQuery: string
  terminalOpen: boolean
  view: string
  collab: boolean
  environment: 'production' | 'development'
  activePanel: string
  
  // Editor State
  activeTab: string | null
  tabs: FileTab[]
  recentFiles: string[]
  
  // File Tree State
  fileTree: FileTreeNode | null
  fileTreeVersion: number
  
  // AI Chat State
  aiMessages: AIMessage[]
  aiInputValue: string
  
  // Terminal State
  terminalTabs: TerminalTab[]
  activeTerminalTab: string | null
  
  // Debug State
  breakpoints: Record<string, number[]>
  debugSession: boolean
  
  // API State
  apiRequests: APIRequest[]
  activeApiRequest: string | null
  
  // Project State
  projectRoot: string | null
  projectFiles: any[]
  
  // Settings
  fontSize: number
  tabSize: number
  minimap: boolean
  autoSave: boolean
  
  // Performance Metrics
  cpuUsage: number
  memoryUsage: number
  buildTime: number
  
  // Git State
  gitBranch: string
  gitStatus: 'clean' | 'modified' | 'staged' | 'committed'
  uncommittedChanges: number
  
  // Actions
  setCommandPalette: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setAIModal: (open: boolean) => void
  setAIChatOpen: (open: boolean) => void
  setSettingsModal: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  setGlobalSearch: (open: boolean) => void
  setGlobalSearchQuery: (query: string) => void
  setTerminalOpen: (open: boolean) => void
  setView: (view: string) => void
  setCollab: (collab: boolean) => void
  setEnvironment: (env: 'production' | 'development') => void
  setActivePanel: (panel: string) => void
  setActiveTab: (tabId: string) => void
  addTab: (file: FileTab) => void
  closeTab: (tabId: string) => void
  updateTabContent: (tabId: string, content: string) => void
  
  // AI Chat Actions
  addAIMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void
  setAIInputValue: (value: string) => void
  clearAIChat: () => void
  
  // Terminal Actions
  addTerminalTab: (tab: TerminalTab) => void
  closeTerminalTab: (tabId: string) => void
  setActiveTerminalTab: (tabId: string) => void
  
  // Debug Actions
  toggleBreakpoint: (file: string, line: number) => void
  startDebugSession: () => void
  stopDebugSession: () => void
  
  // API Actions
  addApiRequest: (request: APIRequest) => void
  updateApiRequest: (id: string, updates: Partial<APIRequest>) => void
  deleteApiRequest: (id: string) => void
  setActiveApiRequest: (id: string) => void
  
  setFontSize: (size: number) => void
  setTabSize: (size: number) => void
  setMinimap: (enabled: boolean) => void
  setAutoSave: (enabled: boolean) => void
  saveFile: (tabId: string) => void
  
  // Project Actions
  setProjectRoot: (path: string | null) => void
  setProjectFiles: (files: any[]) => void
  
  // Performance Actions
  updateMetrics: (metrics: { cpu: number; memory: number; buildTime: number }) => void
  
  // Git Actions
  setGitBranch: (branch: string) => void
  setGitStatus: (status: 'clean' | 'modified' | 'staged' | 'committed') => void
  setUncommittedChanges: (count: number) => void
  
  // File Tree Actions
  refreshFileTree: () => void
  createFile: (parentId: string | null, name: string) => void
  createFolder: (parentId: string | null, name: string) => void
  
  // Persistence
  loadFromURL: () => void
  saveToURL: () => void
  restoreLastSession: () => void
}

export const useIDEStore = create<IDEState>()(
  devtools(
    persist(
      (set, get) => {
        const fileManager = FileTreeManager.getInstance()
        
        return {
          // Initial state
          commandPalette: false,
          aiModal: false,
          aiChatOpen: false,
          settingsModal: false,
          settingsOpen: false,
          globalSearch: false,
          globalSearchQuery: '',
          terminalOpen: false,
          view: 'workspace',
          collab: false,
          environment: 'production',
          activePanel: 'files',
          activeTab: null,
          tabs: [],
          recentFiles: [],
          fileTree: fileManager.getFileTree(),
          fileTreeVersion: 0,
          aiMessages: [],
          aiInputValue: '',
          terminalTabs: [{ id: 'bash-1', name: 'bash', type: 'bash', isActive: true }],
          activeTerminalTab: 'bash-1',
          breakpoints: {},
          debugSession: false,
          apiRequests: [],
          activeApiRequest: null,
          projectRoot: null,
          projectFiles: [],
          fontSize: 14,
          tabSize: 2,
          minimap: false,
          autoSave: true,
          cpuUsage: 45,
          memoryUsage: 67,
          buildTime: 2.3,
          gitBranch: 'main',
          gitStatus: 'modified',
          uncommittedChanges: 3,
          
          // Actions
          setCommandPalette: (open) => { set({ commandPalette: open }); get().saveToURL() },
          setCommandPaletteOpen: (open) => { set({ commandPalette: open }); get().saveToURL() },
          setSidebarOpen: (open) => { 
            const newValue = typeof open === 'function' ? open(get().activePanel !== '') : open
            set({ activePanel: newValue ? 'files' : '' })
            get().saveToURL()
          },
          setAIModal: (open) => { set({ aiModal: open }); get().saveToURL() },
          setAIChatOpen: (open) => { set({ aiChatOpen: open }); get().saveToURL() },
          setSettingsModal: (open) => { set({ settingsModal: open }); get().saveToURL() },
          setSettingsOpen: (open) => { set({ settingsOpen: open }); get().saveToURL() },
          setGlobalSearch: (open) => { set({ globalSearch: open }); get().saveToURL() },
          setGlobalSearchQuery: (query) => { set({ globalSearchQuery: query }); get().saveToURL() },
          setTerminalOpen: (open) => { set({ terminalOpen: open }); get().saveToURL() },
          setView: (view) => { set({ view }); get().saveToURL() },
          setCollab: (collab) => { set({ collab }); get().saveToURL() },
          setEnvironment: (environment) => { set({ environment }); get().saveToURL() },
          setActivePanel: (panel) => { set({ activePanel: panel }); get().saveToURL() },
          setActiveTab: (tabId) => { set({ activeTab: tabId }); get().saveToURL() },
          
          addTab: (file) => set((state) => {
            const existingTab = state.tabs.find(tab => tab.path === file.path)
            if (existingTab) {
              return { activeTab: existingTab.id }
            }
            return {
              tabs: [...state.tabs, file],
              activeTab: file.id
            }
          }),
          
          closeTab: (tabId) => set((state) => {
            const newTabs = state.tabs.filter(tab => tab.id !== tabId)
            let newActiveTab = state.activeTab
            
            if (state.activeTab === tabId && newTabs.length > 0) {
              newActiveTab = newTabs[0].id
            } else if (newTabs.length === 0) {
              newActiveTab = null
            }
            
            return { tabs: newTabs, activeTab: newActiveTab }
          }),
          
          updateTabContent: (tabId, content) => set((state) => ({
            tabs: state.tabs.map(tab => 
              tab.id === tabId 
                ? { ...tab, content, isDirty: true }
                : tab
            )
          })),
          
          // Terminal Actions
          addTerminalTab: (tab) => set((state) => ({
            terminalTabs: [...state.terminalTabs.map(t => ({ ...t, isActive: false })), tab],
            activeTerminalTab: tab.id
          })),
          
          closeTerminalTab: (tabId) => set((state) => {
            const newTabs = state.terminalTabs.filter(tab => tab.id !== tabId)
            let newActiveTab = state.activeTerminalTab
            
            if (state.activeTerminalTab === tabId && newTabs.length > 0) {
              newActiveTab = newTabs[0].id
              newTabs[0].isActive = true
            } else if (newTabs.length === 0) {
              newActiveTab = null
            }
            
            return { terminalTabs: newTabs, activeTerminalTab: newActiveTab }
          }),
          
          setActiveTerminalTab: (tabId) => set((state) => ({
            terminalTabs: state.terminalTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })),
            activeTerminalTab: tabId
          })),
          
          // Debug Actions
          toggleBreakpoint: (file, line) => set((state) => {
            const fileBreakpoints = state.breakpoints[file] || []
            const hasBreakpoint = fileBreakpoints.includes(line)
            
            return {
              breakpoints: {
                ...state.breakpoints,
                [file]: hasBreakpoint 
                  ? fileBreakpoints.filter(l => l !== line)
                  : [...fileBreakpoints, line].sort((a, b) => a - b)
              }
            }
          }),
          
          startDebugSession: () => set({ debugSession: true }),
          stopDebugSession: () => set({ debugSession: false }),
          
          // API Actions
          addApiRequest: (request) => set((state) => ({
            apiRequests: [...state.apiRequests, request],
            activeApiRequest: request.id
          })),
          
          updateApiRequest: (id, updates) => set((state) => ({
            apiRequests: state.apiRequests.map(req => 
              req.id === id ? { ...req, ...updates } : req
            )
          })),
          
          deleteApiRequest: (id) => set((state) => ({
            apiRequests: state.apiRequests.filter(req => req.id !== id),
            activeApiRequest: state.activeApiRequest === id ? null : state.activeApiRequest
          })),
          
          setActiveApiRequest: (id) => set({ activeApiRequest: id }),
          
          // AI Chat Actions
          addAIMessage: (message) => set((state) => ({
            aiMessages: [...state.aiMessages, {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date()
            }]
          })),
          
          setAIInputValue: (value) => set({ aiInputValue: value }),
          
          clearAIChat: () => set({ aiMessages: [], aiInputValue: '' }),
          
          setFontSize: (size) => set({ fontSize: size }),
          setTabSize: (size) => set({ tabSize: size }),
          setMinimap: (enabled) => set({ minimap: enabled }),
          setAutoSave: (enabled) => set({ autoSave: enabled }),
          
          saveFile: (tabId) => set((state) => ({
            tabs: state.tabs.map(tab => 
              tab.id === tabId 
                ? { ...tab, isDirty: false }
                : tab
            )
          })),
          
          // Project Actions
          setProjectRoot: (path) => set({ projectRoot: path }),
          setProjectFiles: (files) => set({ projectFiles: files }),
          
          // Performance Actions
          updateMetrics: (metrics) => set({ 
            cpuUsage: metrics.cpu, 
            memoryUsage: metrics.memory, 
            buildTime: metrics.buildTime 
          }),
          
          // Git Actions
          setGitBranch: (branch) => set({ gitBranch: branch }),
          setGitStatus: (status) => set({ gitStatus: status }),
          setUncommittedChanges: (count) => set({ uncommittedChanges: count }),
          
          // File Tree Actions
          refreshFileTree: () => set((state) => ({
            fileTree: fileManager.getFileTree(),
            fileTreeVersion: state.fileTreeVersion + 1
          })),
          
          createFile: (parentId, name) => {
            const newFile = fileManager.addFile(parentId, name)
            if (newFile) {
              const getFileContent = (filename: string): string => {
                const contentMap: Record<string, string> = {
                  'MainEditor.tsx': `'use client'\n\nimport { useEffect, useRef } from 'react'\n\nexport default function MainEditor() {\n  return <div>Editor</div>\n}`,
                  'package.json': `{\n  "name": "kriya-ide",\n  "version": "0.1.0"\n}`,
                  'README.md': `# ${filename.replace('.md', '')}\n\nFile description here...`
                }
                return contentMap[filename] || `// ${filename}\n\n// File content here...`
              }
              
              const getLanguage = (filename: string): string => {
                const ext = filename.split('.').pop()?.toLowerCase()
                const langMap: Record<string, string> = {
                  'tsx': 'typescript', 'ts': 'typescript', 'js': 'javascript', 'jsx': 'javascript',
                  'css': 'css', 'json': 'json', 'md': 'markdown'
                }
                return langMap[ext || ''] || 'plaintext'
              }
              
              const newTab = {
                id: newFile.id,
                name: newFile.name,
                path: newFile.path,
                content: getFileContent(newFile.name),
                language: getLanguage(newFile.name),
                isDirty: false,
                icon: fileManager.getFileIcon(newFile.name)
              }
              
              set((state) => ({
                fileTree: fileManager.getFileTree(),
                fileTreeVersion: state.fileTreeVersion + 1,
                tabs: [...state.tabs, newTab],
                activeTab: newTab.id
              }))
            }
          },
          
          createFolder: (parentId, name) => {
            fileManager.addFolder(parentId, name)
            set((state) => ({
              fileTree: fileManager.getFileTree(),
              fileTreeVersion: state.fileTreeVersion + 1
            }))
          },
          
          // Persistence
          loadFromURL: () => {
            if (typeof window === 'undefined') return
            const params = new URLSearchParams(window.location.search)
            const state = get()
            
            const view = params.get('view')
            const panel = params.get('panel')
            const tab = params.get('tab')
            const search = params.get('search')
            const terminal = params.get('terminal')
            
            if (view && view !== state.view) set({ view })
            if (panel && panel !== state.activePanel) set({ activePanel: panel })
            if (tab && tab !== state.activeTab) set({ activeTab: tab })
            if (search) set({ globalSearchQuery: search, globalSearch: true })
            if (terminal === 'true') set({ terminalOpen: true })
          },
          
          saveToURL: () => {
            if (typeof window === 'undefined') return
            const state = get()
            const params = new URLSearchParams()
            
            if (state.view !== 'workspace') params.set('view', state.view)
            if (state.activePanel !== 'files') params.set('panel', state.activePanel)
            if (state.activeTab) params.set('tab', state.activeTab)
            if (state.globalSearchQuery) params.set('search', state.globalSearchQuery)
            if (state.terminalOpen) params.set('terminal', 'true')
            
            const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
            window.history.replaceState({}, '', newURL)
          },
          
          restoreLastSession: () => {
            const state = get()
            if (state.recentFiles.length > 0 && state.tabs.length === 0) {
              // Try to restore last active file if it exists in file tree
              const lastFile = state.recentFiles[0]
              // This would need file tree integration to check if file exists
            }
          }
        }
      },
      {
        name: 'kriya-ide-storage',
        partialize: (state: IDEState) => ({
          tabs: state.tabs,
          activeTab: state.activeTab,
          recentFiles: state.recentFiles,
          terminalTabs: state.terminalTabs,
          activeTerminalTab: state.activeTerminalTab,
          breakpoints: state.breakpoints,
          apiRequests: state.apiRequests,
          activeApiRequest: state.activeApiRequest,
          fontSize: state.fontSize,
          tabSize: state.tabSize,
          minimap: state.minimap,
          autoSave: state.autoSave,
          view: state.view,
          activePanel: state.activePanel,
          environment: state.environment,
          collab: state.collab
        })
      }
    )
  )
)