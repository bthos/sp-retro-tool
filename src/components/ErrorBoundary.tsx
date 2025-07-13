import * as React from 'react';

interface IErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, IErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error details
    console.error('RetroTool Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #d13438', 
          borderRadius: '4px', 
          backgroundColor: '#fdf2f2',
          margin: '10px 0'
        }}>
          <h2 style={{ color: '#d13438', marginTop: 0 }}>⚠️ Something went wrong with the Retrospective Tool</h2>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
              <strong>Click to view technical details</strong>
            </summary>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              <strong>Error:</strong> {this.state.error?.toString()}<br/><br/>
              <strong>Stack:</strong><br/>
              <pre>{this.state.error?.stack}</pre>
              {this.state.errorInfo && (
                <>
                  <strong>Component Stack:</strong><br/>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
          <div style={{ marginTop: '15px' }}>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                window.location.reload();
              }}
              style={{
                backgroundColor: '#0078d4',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '2px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Reload Page
            </button>
            <button 
              onClick={() => {
                // Clear localStorage to reset the component
                localStorage.removeItem('retro-columns');
                localStorage.removeItem('retro-cards');
                localStorage.removeItem('retro-private-cards');
                localStorage.removeItem('retro-next-card-id');
                window.location.reload();
              }}
              style={{
                backgroundColor: '#d13438',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              🗑️ Reset Data & Reload
            </button>
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            <strong>Troubleshooting tips:</strong>
            <ul style={{ marginTop: '5px' }}>
              <li>Try refreshing the page</li>
              <li>Clear browser cache and cookies</li>
              <li>Try in an incognito/private browsing window</li>
              <li>If the issue persists, contact your site administrator</li>
            </ul>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
