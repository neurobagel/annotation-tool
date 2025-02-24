import { ThemeProvider } from '@mui/material/styles';
import Upload from '../../src/components/Upload';
import NBTheme from '../../src/theme';

describe('Upload', () => {
  it('should render correctly', () => {
    cy.mount(
      <ThemeProvider theme={NBTheme}>
        <Upload />
      </ThemeProvider>
    );
    cy.contains('Upload');
  });
});
