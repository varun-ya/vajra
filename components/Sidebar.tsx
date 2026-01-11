'use client'

import { useIDEStore } from '@/stores/ide-store'
import { FileTreeManager, FileTreeNode } from '@/lib/file-tree'
import { DebugPanel, ExtensionsPanel, DatabasePanel, APIPanel } from './SidebarPanels'
import { useState, useEffect, useRef } from 'react'

const sidebarTabs = [
  { id: 'files', icon: 'ph-fill ph-files', label: 'Files' },
  { id: 'search', icon: 'ph-fill ph-magnifying-glass', label: 'Search' },
  { id: 'git', icon: 'ph-fill ph-git-branch', label: 'Git' },
  { id: 'debug', icon: 'ph-fill ph-bug', label: 'Debug' },
  { id: 'extensions', icon: 'ph-fill ph-package', label: 'Extensions' },
  { id: 'docker', icon: 'ph-fill ph-container', label: 'Docker' },
  { id: 'database', icon: 'ph-fill ph-database', label: 'Database' },
  { id: 'api', icon: 'ph-fill ph-plugs', label: 'API' },
]

export default function Sidebar() {
  const { 
    setAIChatOpen, 
    setView,
    view,
    setGlobalSearch,
    activePanel, 
    setActivePanel,
    tabs,
    activeTab,
    gitBranch,
    gitStatus,
    uncommittedChanges,
    fileTree,
    refreshFileTree
  } = useIDEStore()
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileTreeNode } | null>(null)
  const [renamingNode, setRenamingNode] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [uploading, setUploading] = useState(false)
  const [extractedFiles, setExtractedFiles] = useState<Map<string, string>>(new Map())
  const fileManager = FileTreeManager.getInstance()
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDirectory = (nodeId: string) => {
    fileManager.toggleDirectory(nodeId)
    refreshFileTree()
  }

  const openFile = (node: FileTreeNode) => {
    if (node.type === 'directory') {
      toggleDirectory(node.id)
      return
    }

    const existingTab = tabs.find(tab => tab.path === node.path)
    if (existingTab) {
      const { setActiveTab } = useIDEStore.getState()
      setActiveTab(existingTab.id)
      return
    }

    const content = getFileContent(node.name, node.path)
    const language = getLanguage(node.name)
    
    const { addTab, setActiveTab } = useIDEStore.getState()
    addTab({
      id: node.id,
      name: node.name,
      path: node.path,
      content,
      language,
      isDirty: false,
      icon: fileManager.getFileIcon(node.name)
    })
    setActiveTab(node.id)
  }

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.name.endsWith('.zip')) {
      alert('Please select a valid ZIP file')
      return
    }

    setUploading(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const contents = await zip.loadAsync(file)
      
      // Clear existing file tree
      fileManager.clearFileTree()
      
      const fileContents = new Map<string, string>()
      let extractedCount = 0
      
      // Extract all files and their contents
      for (const [path, zipEntry] of Object.entries(contents.files)) {
        if (!zipEntry.dir && path) {
          try {
            const content = await zipEntry.async('text')
            fileContents.set(path, content)
            extractedCount++
          } catch (err) {
            console.warn(`Failed to extract ${path}:`, err)
          }
        }
      }
      
      // Build new file tree structure
      const rootNode: FileTreeNode = {
        id: 'root',
        name: file.name.replace('.zip', ''),
        path: '/',
        type: 'directory',
        isExpanded: true,
        children: []
      }
      
      const folderMap = new Map<string, FileTreeNode>()
      folderMap.set('', rootNode)
      
      // Create directory structure
      for (const filePath of fileContents.keys()) {
        const pathParts = filePath.split('/')
        let currentPath = ''
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          const parentPath = currentPath
          currentPath = currentPath ? `${currentPath}/${part}` : part
          
          if (!folderMap.has(currentPath)) {
            const folderNode: FileTreeNode = {
              id: `folder-${currentPath.replace(/\//g, '-')}`,
              name: part,
              path: `/${currentPath}`,
              type: 'directory',
              isExpanded: true,
              children: []
            }
            
            const parent = folderMap.get(parentPath)!
            parent.children!.push(folderNode)
            folderMap.set(currentPath, folderNode)
          }
        }
      }
      
      // Add files to their respective directories
      for (const [filePath, content] of fileContents.entries()) {
        const pathParts = filePath.split('/')
        const fileName = pathParts[pathParts.length - 1]
        const dirPath = pathParts.slice(0, -1).join('/')
        
        const fileNode: FileTreeNode = {
          id: `file-${filePath.replace(/\//g, '-')}`,
          name: fileName,
          path: `/${filePath}`,
          type: 'file',
          size: content.length
        }
        
        const parent = folderMap.get(dirPath)!
        parent.children!.push(fileNode)
      }
      
      // Set the new file tree and store file contents
      fileManager.setFileTree(rootNode)
      setExtractedFiles(fileContents)
      refreshFileTree()
      
      alert(`Successfully extracted ${extractedCount} files from ZIP`)
    } catch (error) {
      console.error('Failed to extract ZIP:', error)
      alert('Failed to extract ZIP file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRightClick = (e: React.MouseEvent, node: FileTreeNode) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, node })
  }

  const handleRename = (node: FileTreeNode) => {
    setRenamingNode(node.id)
    setRenameValue(node.name)
    setContextMenu(null)
  }

  const handleRenameSubmit = () => {
    if (!renameValue.trim() || !renamingNode) return
    console.log(`Renamed to: ${renameValue}`)
    setRenamingNode(null)
    setRenameValue('')
  }

  const handleDelete = (node: FileTreeNode) => {
    if (confirm(`Delete ${node.name}?`)) {
      console.log(`Deleted: ${node.name}`)
    }
    setContextMenu(null)
  }

  const handleCopyPath = (node: FileTreeNode) => {
    navigator.clipboard.writeText(node.path)
    console.log(`Copied path: ${node.path}`)
    setContextMenu(null)
  }

  const triggerZipUpload = () => {
    fileInputRef.current?.click()
  }

  const getFileContent = (filename: string, filePath?: string): string => {
    // Check if we have extracted content for this file
    if (filePath && extractedFiles.has(filePath.replace(/^\//, ''))) {
      return extractedFiles.get(filePath.replace(/^\//, ''))!
    }
    
    // Return empty content for files not in extracted ZIP
    return `// ${filename}\n\n// No content available`
  }

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const langMap: Record<string, string> = {
      'tsx': 'typescript',
      'ts': 'typescript', 
      'js': 'javascript',
      'jsx': 'javascript',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    }
    return langMap[ext || ''] || 'plaintext'
  }

  const renderFileTree = (node: FileTreeNode, depth = 0): React.ReactNode => {
    const isActive = activeTab === node.id
    const paddingLeft = depth * 12 + 12
    const isRenaming = renamingNode === node.id

    return (
      <div key={node.id}>
        <div 
          onClick={() => !isRenaming && openFile(node)}
          onContextMenu={(e) => handleRightClick(e, node)}
          className={`flex items-center gap-2 px-3 py-1 text-xs cursor-pointer transition group ${
            isActive ? 'text-white bg-white/10' : 'text-zinc-600 hover:text-white hover:bg-white/5'
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {node.type === 'directory' && (
            <i className={`ph-fill ${node.isExpanded ? 'ph-caret-down' : 'ph-caret-right'} text-[8px]`}></i>
          )}
          <i className={`${
            node.type === 'directory' 
              ? 'ph-fill ph-folder' 
              : fileManager.getFileIcon(node.name)
          } text-sm`}></i>
          
          {isRenaming ? (
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit()
                if (e.key === 'Escape') { setRenamingNode(null); setRenameValue('') }
              }}
              onBlur={handleRenameSubmit}
              className="flex-1 bg-transparent border border-zinc-600 text-white text-xs outline-none px-1 rounded"
              autoFocus
            />
          ) : (
            <span className="flex-1">{node.name}</span>
          )}
        </div>
        
        {node.type === 'directory' && node.isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileTree(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Icon Sidebar */}
      <aside className="w-12 border-r-line bg-black flex flex-col items-center py-4 gap-5 shrink-0">
        {sidebarTabs.map(tab => (
          <i 
            key={tab.id}
            onClick={() => setActivePanel(tab.id)} 
            className={`${tab.icon} text-lg cursor-pointer transition ${
              activePanel === tab.id ? 'icon-active' : 'text-zinc-700 hover:text-white'
            }`}
          ></i>
        ))}
        <i 
          onClick={() => setAIChatOpen(true)} 
          className="ph-fill ph-sparkle text-lg text-zinc-700 hover:text-white cursor-pointer transition"
        ></i>
        
        <div className="mt-auto flex flex-col gap-5 items-center">
          <i 
            onClick={() => setView('settings')} 
            className={`ph-fill ph-gear-six text-lg cursor-pointer transition ${
              view === 'settings' ? 'icon-active' : 'text-zinc-700 hover:text-white'
            }`}
          ></i>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zinc-700 to-white border-line cursor-pointer overflow-hidden">
            <img 
              src="https://api.dicebear.com/9.x/glass/svg?seed=kriya-user" 
              alt="User Avatar"
              className="w-full h-full"
            />
          </div>
        </div>
      </aside>

      {/* Content Sidebar */}
      {activePanel && (
        <aside className="w-64 border-r-line bg-black shrink-0 flex flex-col overflow-hidden">
          
          {/* Files Panel */}
          {activePanel === 'files' && (
            <div className="flex flex-col h-full">
              <div className="h-10 px-4 flex items-center justify-between shrink-0">
                <span className="label">Files</span>
                <div className="flex gap-1">
                  <button 
                    onClick={triggerZipUpload}
                    disabled={uploading}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    title="Upload ZIP file"
                  >
                    <i className={`ph ${uploading ? 'ph-spinner ph-spin' : 'ph-upload'} text-white text-xs`}></i>
                  </button>
                  <button 
                    onClick={() => refreshFileTree()}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors"
                    title="Refresh"
                  >
                    <i className="ph ph-arrow-clockwise text-white text-xs"></i>
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleZipUpload}
                className="hidden"
              />
              <div className="flex-1 overflow-y-auto">
                {fileTree && renderFileTree(fileTree)}
              </div>
            </div>
          )}

          {/* Git Panel */}
          {activePanel === 'git' && (
            <div className="flex flex-col h-full">
              <div className="h-10 px-4 flex items-center justify-between shrink-0">
                <span className="label">Source Control</span>
                <div className="flex gap-2">
                  <i className="ph ph-git-commit text-zinc-600 hover:text-white cursor-pointer text-xs transition"></i>
                  <i className="ph ph-git-pull-request text-zinc-600 hover:text-white cursor-pointer text-xs transition"></i>
                </div>
              </div>
              <div className="p-3 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Branch:</span>
                    <span className="text-white font-mono">{gitBranch}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Status:</span>
                    <span className={`font-semibold ${
                      gitStatus === 'clean' ? 'text-green-400' :
                      gitStatus === 'modified' ? 'text-yellow-400' :
                      gitStatus === 'staged' ? 'text-blue-400' :
                      'text-green-400'
                    }`}>
                      {gitStatus.charAt(0).toUpperCase() + gitStatus.slice(1)}
                    </span>
                  </div>
                  {uncommittedChanges > 0 && (
                    <div className="text-xs text-zinc-400">
                      {uncommittedChanges} uncommitted change{uncommittedChanges !== 1 ? 's' : ''}
                    </div>
                  )}
                  <button className="w-full btn-primary text-xs py-2">
                    Commit Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Panel */}
          {activePanel === 'search' && (
            <div className="flex flex-col h-full">
              <div className="h-10 px-4 flex items-center">
                <span className="label">Search</span>
              </div>
              <div className="p-3 flex-1">
                <button 
                  onClick={() => setGlobalSearch(true)}
                  className="w-full p-3 text-left text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg border-line transition"
                >
                  <i className="ph ph-magnifying-glass mr-2"></i>
                  Search across files...
                </button>
              </div>
            </div>
          )}

          {/* Debug Panel */}
          {activePanel === 'debug' && <DebugPanel />}

          {/* Extensions Panel */}
          {activePanel === 'extensions' && <ExtensionsPanel />}

          {/* Database Panel */}
          {activePanel === 'database' && <DatabasePanel />}

          {/* API Panel */}
          {activePanel === 'api' && <APIPanel />}

          {/* Docker Panel */}
          {activePanel === 'docker' && (
            <div className="flex flex-col h-full">
              <div className="h-10 px-4 flex items-center">
                <span className="label">Docker</span>
              </div>
              <div className="p-3 flex-1">
                <div className="text-xs text-zinc-600">Docker containers and images...</div>
              </div>
            </div>
          )}

          {/* Other panels */}
          {!['files', 'git', 'search', 'debug', 'extensions', 'database', 'api', 'docker'].includes(activePanel) && (
            <div className="flex flex-col h-full">
              <div className="h-10 px-4 flex items-center">
                <span className="label">{sidebarTabs.find(t => t.id === activePanel)?.label}</span>
              </div>
              <div className="p-3 flex-1">
                <div className="text-xs text-zinc-600">Panel content...</div>
              </div>
            </div>
          )}

        </aside>
      )}
      
      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleRename(contextMenu.node)}
            className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 transition flex items-center gap-2"
          >
            <i className="ph ph-pencil text-xs"></i>
            Rename
          </button>
          
          <button
            onClick={() => handleCopyPath(contextMenu.node)}
            className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 transition flex items-center gap-2"
          >
            <i className="ph ph-copy text-xs"></i>
            Copy Path
          </button>
          
          {contextMenu.node.type === 'file' && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(contextMenu.node.path.split('/').pop() || '')
                setContextMenu(null)
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 transition flex items-center gap-2"
            >
              <i className="ph ph-clipboard text-xs"></i>
              Copy Name
            </button>
          )}
          
          <div className="h-px bg-zinc-700 my-1"></div>
          
          <button
            onClick={() => handleDelete(contextMenu.node)}
            className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-900/20 transition flex items-center gap-2"
          >
            <i className="ph ph-trash text-xs"></i>
            Delete
          </button>
        </div>
      )}
    </>
  )
}