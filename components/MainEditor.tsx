'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useIDEStore } from '@/stores/ide-store'

export default function MainEditor() {
  const { 
    tabs, 
    activeTab, 
    setActiveTab, 
    closeTab, 
    updateTabContent,
    fontSize,
    tabSize,
    minimap,
    saveFile
  } = useIDEStore()
  
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)

  const currentTab = tabs.find(tab => tab.id === activeTab)

  // Improved Formatting Function: Uses 'trigger' which is more reliable than getAction
  const formatCode = useCallback(() => {
    if (editorRef.current) {
      try {
        // First try to format the document
        editorRef.current.trigger('source', 'editor.action.formatDocument', {})
        console.log('Formatted code')
      } catch (e) {
        console.log('Format not available, trying beautify')
        // If format fails, try to beautify minified code
        beautifyCode()
      }
    }
  }, [])

  // Beautify minified code
  const beautifyCode = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.getValue()
      const language = currentTab?.language || 'javascript'
      
      // Simple beautification for JavaScript/TypeScript
      if (['javascript', 'typescript'].includes(language)) {
        const beautified = content
          .replace(/;/g, ';\n')
          .replace(/{/g, '{\n')
          .replace(/}/g, '\n}\n')
          .replace(/,/g, ',\n')
          .replace(/\n\s*\n/g, '\n')
          .split('\n')
          .map((line, index, arr) => {
            const trimmed = line.trim()
            if (!trimmed) return ''
            
            let indent = 0
            for (let i = 0; i < index; i++) {
              const prevLine = arr[i].trim()
              if (prevLine.endsWith('{') || prevLine.endsWith('(') || prevLine.endsWith('[')) {
                indent++
              }
              if (prevLine.startsWith('}') || prevLine.startsWith(')') || prevLine.startsWith(']')) {
                indent--
              }
            }
            
            if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith(']')) {
              indent--
            }
            
            return '  '.repeat(Math.max(0, indent)) + trimmed
          })
          .join('\n')
        
        editorRef.current.setValue(beautified)
        setTimeout(() => {
          editorRef.current?.trigger('source', 'editor.action.formatDocument', {})
        }, 100)
      }
    }
  }, [currentTab?.language])

  // Handle content changes from the editor
  const handleContentChange = useCallback((content: string) => {
    if (activeTab && currentTab && content !== currentTab.content) {
      updateTabContent(activeTab, content)
    }
  }, [activeTab, currentTab, updateTabContent])

  // Sync Tab Content & Language to Editor when Tab Changes
  useEffect(() => {
    if (editorRef.current && currentTab && monacoRef.current) {
      const editor = editorRef.current
      const model = editor.getModel()

      // 1. Update Content
      // We check strict equality to prevent cursor jumping on every keystroke
      if (editor.getValue() !== currentTab.content) {
        // preserve cursor position if possible, otherwise setValue resets it
        const pos = editor.getPosition()
        editor.setValue(currentTab.content || '')
        editor.setPosition(pos)
      }

      // 2. Update Language
      if (model && currentTab.language) {
        monacoRef.current.editor.setModelLanguage(model, currentTab.language)
      }

      // 3. Auto-format on file open (delayed slightly to ensure worker is ready)
      setTimeout(() => {
        formatCode()
      }, 300)
    }
  }, [currentTab?.id, currentTab?.content, currentTab?.language, formatCode])

  // Initial Editor Setup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleResize = () => {
      editorRef.current?.layout()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Save Shortcut (Cmd/Ctrl + S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (activeTab) {
          saveFile(activeTab)
          // Add a subtle visual feedback or log
          console.log('File saved via shortcut')
        }
      }
      // Format Shortcut (Shift + Alt + F)
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        formatCode()
      }
    }
    
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleKeyDown)
    
    const initEditor = () => {
      if (typeof window !== 'undefined' && (window as any).require) {
        // Configure Monaco loader
        (window as any).require.config({ 
          paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } 
        })
        
        ;(window as any).require(['vs/editor/editor.main'], () => {
          const monaco = (window as any).monaco
          monacoRef.current = monaco
          
          // Define custom theme to match your UI
          monaco.editor.defineTheme('kriya-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A737D' },
              { token: 'keyword', foreground: 'F97583' },
              { token: 'string', foreground: '9ECBFF' },
              { token: 'number', foreground: '79B8FF' },
              { token: 'type', foreground: 'B392F0' },
              { token: 'function', foreground: 'B392F0' },
              { token: 'variable', foreground: 'E1E4E8' },
            ],
            colors: {
              'editor.background': '#000000',
              'editor.foreground': '#E1E4E8',
              'editor.lineHighlightBackground': '#0A0A0A',
              'editor.selectionBackground': '#264F78',
              'editorCursor.foreground': '#FFFFFF',
              'editorLineNumber.foreground': '#6A737D',
              'editorGutter.background': '#000000',
            }
          })

          const container = document.getElementById('editor-container')
          if (!container) return

          // Destroy previous instance if exists to prevent duplicates
          if (editorRef.current) {
            editorRef.current.dispose()
          }

          const editor = monaco.editor.create(container, {
            value: currentTab?.content || '',
            language: currentTab?.language || 'plaintext',
            theme: 'kriya-dark',
            fontSize: fontSize || 14,
            tabSize: tabSize || 2,
            insertSpaces: true,
            detectIndentation: true,
            minimap: { enabled: minimap || false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            automaticLayout: true,
            wordWrap: 'off',
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: true
            },
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            renderWhitespace: 'selection',
            renderControlCharacters: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
            },
          })

          editor.onDidChangeModelContent(() => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              const content = editor.getValue()
              handleContentChange(content)
            }, 300)
          })

          // Add custom context menu action for format
          editor.addAction({
            id: 'format-document-custom',
            label: 'Format Document',
            keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
            contextMenuGroupId: 'modification',
            contextMenuOrder: 1,
            run: () => {
              formatCode()
            }
          })

          editorRef.current = editor
          
          // Format document after a short delay to ensure language services are ready
          setTimeout(() => {
            try {
              editor.getAction('editor.action.formatDocument')?.run()
            } catch (e) {
              console.log('Auto-format not available for this language')
            }
          }, 800)
        })
      }
    }

    if (!monacoRef.current) {
      setTimeout(initEditor, 100)
    } else if (currentTab && !editorRef.current) {
      // Re-create if tab exists but editor doesn't (e.g. view toggle)
      initEditor()
    }
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeyDown)
      // Note: We don't dispose editor here to avoid flickering when switching components
      // Ideally, dispose when the component strictly unmounts
    }
  }, [fontSize, tabSize, minimap, formatCode, handleContentChange]) // Removed currentTab from dep array to avoid re-creating editor on tab switch

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-black h-full">
      {/* Editor Tabs */}
      <div className="h-10 border-b border-zinc-800 flex items-center shrink-0 bg-black">
        <div className="flex gap-1 px-4 overflow-x-auto scrollbar-hide w-full">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`group flex items-center gap-2 px-3 py-1.5 text-xs rounded-t-md font-medium cursor-pointer transition whitespace-nowrap shrink-0 border-t-2 ${
                activeTab === tab.id 
                  ? 'border-blue-500 bg-zinc-900 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <i className={`${tab.icon || 'ph-file'} text-sm opacity-70`}></i>
              <span>{tab.name}</span>
              
              {/* Dirty Indicator / Close Button */}
              <div className="w-4 h-4 flex items-center justify-center relative">
                {tab.isDirty && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:hidden transition-all"></div>
                )}
                <i 
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }} 
                  className={`ph ph-x text-[10px] hover:bg-zinc-700 rounded-sm p-0.5 transition-colors ${tab.isDirty ? 'hidden group-hover:block' : 'block opacity-0 group-hover:opacity-100'}`}
                ></i>
              </div>
            </div>
          ))}
        </div>
        
        {/* Editor Controls */}
        <div className="ml-auto px-4 flex items-center gap-3 shrink-0 border-l border-zinc-800 h-full bg-black z-10">
          {currentTab && (
            <>
              <button
                onClick={formatCode}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded border border-zinc-800 transition-all"
                title="Format Document (Shift+Alt+F)"
              >
                <i className="ph ph-list-dashes"></i>
                Format
              </button>
              <button
                onClick={beautifyCode}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded border border-zinc-800 transition-all"
                title="Beautify Minified Code"
              >
                <i className="ph ph-magic-wand"></i>
                Beautify
              </button>
              <div className="h-3 w-[1px] bg-zinc-800"></div>
              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                <span className="uppercase">{currentTab.language}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative bg-black">
        {!currentTab && tabs.length === 0 && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
              <i className="ph ph-code text-4xl mb-2 opacity-50"></i>
              <p className="text-sm">Select a file to view code</p>
           </div>
        )}
        <div 
          id="editor-container" 
          className="absolute inset-0"
          style={{ visibility: currentTab ? 'visible' : 'hidden' }} 
        ></div>
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-zinc-800 px-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 bg-black shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 hover:text-zinc-300 cursor-pointer transition-colors">
            <i className="ph ph-git-branch text-xs"></i>
            <span>main</span>
          </div>
          {currentTab && (
             <div className="flex items-center gap-1.5">
               <i className="ph ph-check-circle text-green-500/70"></i>
               <span>Prettier</span>
             </div>
          )}
        </div>
        <div className="flex items-center gap-4 opacity-70">
          <span className="hidden sm:inline">Ln {1}, Col {1}</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span>{tabSize} Spaces</span>
        </div>
      </div>
    </main>
  )
}