'use client'

import { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useIDEStore } from '@/stores/ide-store'
import { useHotkeys } from 'react-hotkeys-hook'

export default function CodeEditor() {
  const { tabs, activeTab, updateTabContent } = useIDEStore()
  const editorRef = useRef<any>(null)

  const currentTab = tabs.find(tab => tab.id === activeTab)

  useHotkeys('meta+s', (e) => {
    e.preventDefault()
    if (currentTab) {
      // Save file logic
      console.log('Saving file:', currentTab.name)
    }
  })

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Configure Monaco theme
    monaco.editor.defineTheme('kriya-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D' },
        { token: 'keyword', foreground: 'F97583' },
        { token: 'string', foreground: '9ECBFF' },
        { token: 'number', foreground: '79B8FF' },
        { token: 'type', foreground: 'B392F0' },
        { token: 'class', foreground: 'FFAB70' },
        { token: 'function', foreground: 'B392F0' },
        { token: 'variable', foreground: 'E1E4E8' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#E1E4E8',
        'editor.lineHighlightBackground': '#0A0A0A',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#FFFFFF',
        'editorWhitespace.foreground': '#3B4048',
        'editorIndentGuide.background': '#3B4048',
        'editorIndentGuide.activeBackground': '#6A737D',
        'editorLineNumber.foreground': '#6A737D',
        'editorLineNumber.activeForeground': '#E1E4E8',
      }
    })

    monaco.editor.setTheme('kriya-dark')

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      // Command palette
    })

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      lineHeight: 1.6,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      automaticLayout: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (currentTab && value !== undefined) {
      updateTabContent(currentTab.id, value)
    }
  }

  if (!currentTab) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <div className="text-lg font-semibold mb-2">No file open</div>
          <div className="text-sm">Open a file to start coding</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full">
      <Editor
        height="100%"
        language={currentTab.language}
        value={currentTab.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          theme: 'kriya-dark',
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 1.6,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
        }}
      />
    </div>
  )
}