import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              textAlign: 'center',
              background: '#fff8f0',
              border: '1px solid #eadfd2',
              borderRadius: '18px',
              padding: '32px',
              boxShadow: '0 16px 40px rgba(28, 20, 14, 0.12)',
            }}
          >
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '12px',
                color: '#6c5f54',
                margin: '0 0 8px',
              }}
            >
              Something went wrong
            </p>
            <h2 style={{ margin: '0 0 12px', fontSize: '22px' }}>
              The app crashed
            </h2>
            <p style={{ color: '#6c5f54', margin: '0 0 20px' }}>
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                background: 'linear-gradient(135deg, #ff5b2b 0%, #ff8e6a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 18px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
