import { Container, Typography, Box, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorPage = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Container component="main" maxWidth="xs" style={{ textAlign: 'center', marginTop: '10%' }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <ErrorOutlineIcon color="error" style={{ fontSize: 80 }} />
        <Typography variant="h4" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
