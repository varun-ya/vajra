'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.retry} />
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null
  retry: () => void
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="glass border-line rounded-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <i className="ph ph-warning-circle text-red-400 text-4xl mb-4"></i>
          <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-zinc-400 text-sm">
            The IDE encountered an unexpected error. This has been logged for investigation.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4 mb-6">
            <div className="text-red-400 font-mono text-xs mb-2">Error Details:</div>
            <div className="text-red-300 font-mono text-xs break-all">
              {error.message}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={retry}
            className="btn-primary flex items-center gap-2"
          >
            <i className="ph ph-arrow-clockwise"></i>
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition border border-zinc-800 rounded-lg hover:border-zinc-600"
          >
            Reload Page
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            If this problem persists, please contact support with the error details above.
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook for error reporting
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Manual error report:', error, errorInfo)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }
}