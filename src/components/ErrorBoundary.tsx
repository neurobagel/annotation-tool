import { Typography, Button, Collapse } from '@mui/material';
import React from 'react';
import emoji from '../assets/errorboundary-emoji.png';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  showDetails: boolean;
};

/**
 * ErrorBoundary must use the Class API because React's Error Boundary feature
 * is only available in class components. Specifically, React provides two
 * lifecycle methods for handling errors:
 *
 * 1. `static getDerivedStateFromError(error)`: Updates the state to render a
 *    fallback UI when an error occurs.
 * 2. `componentDidCatch(error, errorInfo)`: Captures the error and error info
 *    for logging or display purposes.
 *
 * These lifecycle methods are not available in functional components, so a
 * class component is required to implement an Error Boundary.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true, showDetails: false };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.setState({ error, errorInfo: info });
  }

  toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { children } = this.props;

    if (hasError) {
      // Fallback UI
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-5">
          <img src={emoji} alt="Emoji" className="max-h-20 animate-pulse" />
          <Typography variant="h5" className="text-center">
            This is not supposed to happen. Please try again,{' '}
            <a
              href="https://neurobagel.org/user_guide/annotation_tool/"
              target="_blank"
              rel="noopener noreferrer"
            >
              check out the documentation,
            </a>{' '}
            or{' '}
            <a
              href="https://github.com/neurobagel/annotation-tool/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue
            </a>
            .
          </Typography>
          <Button variant="outlined" color="primary" onClick={this.toggleDetails}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Collapse in={showDetails}>
            <div className="mt-4 w-11/12 max-w-lg overflow-auto rounded bg-gray-100 p-4 text-left shadow">
              {error && (
                <Typography variant="body1" className="mb-2">
                  <strong>Error:</strong> {error.message}
                </Typography>
              )}
              {errorInfo && (
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                  <strong>Component Stack:</strong>
                  {'\n'}
                  {errorInfo.componentStack}
                </Typography>
              )}
            </div>
          </Collapse>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
