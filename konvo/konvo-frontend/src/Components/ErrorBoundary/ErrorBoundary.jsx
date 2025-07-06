import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import useColorMode from '../../theme/useColorMode';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        onReload={this.handleReload}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onReload, onGoHome }) => {
  const { theme } = useColorMode();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Oops! Something went wrong
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
        </Typography>

        {import.meta.env.DEV && error && (
          <Box
            sx={{
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
              padding: 2,
              borderRadius: 1,
              marginBottom: 3,
              maxWidth: '100%',
              overflow: 'auto',
              textAlign: 'left',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Error Details (Development Only):
            </Typography>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {error.toString()}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={onReload}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Refresh Page
          </Button>
          
          <Button
            variant="outlined"
            onClick={onGoHome}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;

// Prompt: "How do I implement error reporting to external services?"
// Prompt: "The error boundary is not catching all errors. How can I improve it?"
// Prompt: "How do I add error logging for production debugging?" 