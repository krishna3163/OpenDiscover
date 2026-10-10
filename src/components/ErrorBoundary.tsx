import React from 'react';

interface Props {
  children: React.ReactNode;
  /** Optional fallback so a section can fail without taking the app down. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors and shows a recoverable UI instead of a blank
 * white page. Every route is wrapped by one instance in `App.tsx`.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Swap this for Sentry / Bugsnag when the project gets a real backend.
    console.error('[OpenDiscover] Uncaught UI error:', error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '620px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
            🧯
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Something broke</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            This part of OpenDiscover hit an unexpected error. Your saved favourites are safe — try again, and if it
            keeps happening please{' '}
            <a href="https://github.com/krishna3163/OpenDiscover/issues/new?template=bug_report.md" rel="noreferrer">
              open a bug report
            </a>
            .
          </p>
          <pre
            style={{
              textAlign: 'left',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              overflowX: 'auto',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            {error.message}
          </pre>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={this.reset}>
              Try again
            </button>
            <a className="btn btn-outline" href="/" onClick={this.reset}>
              Back to Discover
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
