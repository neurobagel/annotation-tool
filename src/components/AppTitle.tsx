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

        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, margin: 1 }}>
          {title}
        </Typography>

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
