import React, { ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import './ErrorBoundary.scss';

/**
 * Error Fallback Props Interface
 */
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError?: () => void;
}

/**
 * Error Fallback UI
 *
 * Displayed when an error is caught by the Error Boundary
 * Provides a user-friendly error message and recovery options
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo }) => {
  const handleReload = (): void => {
    window.location.reload();
  };

  const handleGoHome = (): void => {
    window.location.href = '/';
  };

  return (
    <div className="error-boundary">
      <div className="error-boundary__container">
        <motion.div
          className="error-boundary__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Icon */}
          <motion.div
            className="error-boundary__icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            ⚠️
          </motion.div>

          {/* Error Title */}
          <h1 className="error-boundary__title">Oops! Something went wrong</h1>

          {/* Error Message */}
          <p className="error-boundary__message">
            We encountered an unexpected error. Don't worry, it's not your fault!
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="error-boundary__details">
              <summary>Error Details (Development Mode)</summary>
              <div className="error-boundary__error-info">
                <p>
                  <strong>Error:</strong> {error.toString()}
                </p>
                {errorInfo && errorInfo.componentStack && (
                  <pre className="error-boundary__stack">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="error-boundary__actions">
            <motion.button
              className="error-boundary__button error-boundary__button--primary"
              onClick={handleReload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reload Page
            </motion.button>

            <motion.button
              className="error-boundary__button error-boundary__button--secondary"
              onClick={handleGoHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Homepage
            </motion.button>
          </div>

          {/* Help Text */}
          <p className="error-boundary__help">
            If this problem persists, please{' '}
            <a
              href="https://github.com/Playyer96"
              target="_blank"
              rel="noopener noreferrer"
              className="error-boundary__link"
            >
              report it on GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorFallback;
