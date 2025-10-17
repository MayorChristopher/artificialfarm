import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green via-accent-green to-primary-green p-4">
          <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center border border-secondary-yellow/20">
            <div className="w-16 h-16 bg-secondary-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-secondary-yellow" />
            </div>
            
            <h2 className="text-2xl font-bold text-secondary-yellow mb-2">
              Oops! Something went wrong
            </h2>
            
            <p className="text-white/80 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-secondary-yellow to-yellow-500 hover:from-yellow-500 hover:to-secondary-yellow text-primary-green font-semibold py-3 rounded-lg shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg border border-secondary-yellow/30"
              >
                Go to Homepage
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-white/80 cursor-pointer mb-2 hover:text-secondary-yellow transition-colors">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-secondary-yellow/80 bg-primary-green/40 p-3 rounded border border-secondary-yellow/20 overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;