'use client'

import { useEffect } from 'react'
// Components
import { ErrorBoundary } from '@/components/ErrorBoundary'
import CommandPalette from '@/components/CommandPalette'
import AIAssistant from '@/components/AIAssistant'
import AIChatEnhanced from '@/components/AIChatEnhanced'
import GlobalSearch from '@/components/GlobalSearch'
import TopBar from '@/components/TopBar'
import Sidebar from '@/components/Sidebar'
import MainEditor from '@/components/MainEditor'
import Terminal from '@/components/Terminal'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import DeploymentDashboard from '@/components/DeploymentDashboard'
import AnalyticsView from '@/components/AnalyticsView'
import DatabaseView from '@/components/DatabaseView'
import LogsView from '@/components/LogsView'
import SettingsView from '@/components/SettingsView'
import { useIDEStore } from '@/stores/ide-store'
import { useIDEHotkeys } from '@/hooks/useIDEHotkeys'

export default function Home() {
  const { view, aiChatOpen } = useIDEStore()
  useIDEHotkeys()

  useEffect(() => {
    // Disable browser right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      // TODO: Show custom context menu
    }

    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  const renderMainContent = () => {
    switch (view) {
      case 'deploy':
        return <DeploymentDashboard />
      case 'monitoring':
        return <PerformanceMonitor />
      case 'analytics':
        return <AnalyticsView />
      case 'db':
        return <DatabaseView />
      case 'logs':
        return <LogsView />
      case 'settings':
        return <SettingsView />
      default:
        return <MainEditor />
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <CommandPalette />
        <AIAssistant />
        <GlobalSearch />
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          {renderMainContent()}
          {aiChatOpen && <AIChatEnhanced />}
        </div>
        <Terminal />
      </div>
    </ErrorBoundary>
  )
}