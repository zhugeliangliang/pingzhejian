import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-cinnabar/10">
              <svg
                className="w-8 h-8 text-cinnabar"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-ink-black/70 tracking-wider mb-2">
              页面出现错误
            </h2>
            <p className="text-sm text-ink-black/40 tracking-wider mb-6 leading-relaxed">
              抱歉，页面加载时出现了问题。请尝试重新加载或返回上一页。
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-xs text-left text-ink-black/30 bg-ink-black/5 p-3 rounded-sm mb-4 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 text-sm border border-cinnabar/30 text-cinnabar rounded-sm
                           hover:bg-cinnabar/5 transition-colors tracking-wider"
              >
                重新加载
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm border border-ink-black/10 text-ink-black/50 rounded-sm
                           hover:border-ink-black/20 hover:text-ink-black/70 transition-colors tracking-wider"
              >
                返回上一页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as ReactNode;
  }
}
