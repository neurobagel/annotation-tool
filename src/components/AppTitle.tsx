import { GitHub, MenuBook } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
// TODO: consider making logo a prop
import logo from '../assets/logo.svg';

interface AppTitleProps {
  title: string;
  githubUrl: string;
  docsUrl: string;
}

function AppTitle({ title, githubUrl, docsUrl }: AppTitleProps) {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AppBar position="fixed" color="default" data-cy="app-title">
      <Toolbar>
        <Box component="img" src={logo} alt="Neurobagel Logo" sx={{ height: 45, width: 'auto' }} />

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="h1" sx={{ margin: 1 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
            }}
          >
            v{APP_VERSION || 'beta'}
          </Typography>
        </Box>

        <Box data-cy="external-links">
          <IconButton
            onClick={() => handleLinkClick(docsUrl)}
            color="inherit"
            aria-label="Documentation"
            title="Documentation"
          >
            <MenuBook />
          </IconButton>

          <IconButton
            onClick={() => handleLinkClick(githubUrl)}
            color="inherit"
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <GitHub />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppTitle;
