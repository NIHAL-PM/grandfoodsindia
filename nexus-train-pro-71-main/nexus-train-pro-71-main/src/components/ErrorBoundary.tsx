import React from 'react';

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: any) { console.error('ErrorBoundary', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm text-muted-foreground mb-4">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: undefined })} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
