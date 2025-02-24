import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import FileUploader from '../../src/components/FileUploader';
import NBTheme from '../../src/theme';

const props = {
  displayText: 'Upload your file (.csv)',
  handleClickToUpload: () => {},
  handleDrop: () => {},
  handleDragOver: () => {},
  handleFileUpload: () => {},
  fileInputRef: React.createRef<HTMLInputElement>(),
  allowedFileType: '.csv',
};

describe('FileUploader', () => {
  it('should render the FileUploader component', () => {
    cy.mount(
      /*
       Since the component is using styled and styled depends on theme 
       which is accessible from/provided by the ThemeProvider
      */
      <ThemeProvider theme={NBTheme}>
        <FileUploader
          displayText={props.displayText}
          handleClickToUpload={props.handleClickToUpload}
          handleDrop={props.handleDrop}
          handleDragOver={props.handleDragOver}
          handleFileUpload={props.handleFileUpload}
          fileInputRef={props.fileInputRef}
          allowedFileType={props.allowedFileType}
        />
      </ThemeProvider>
    );
    cy.get('[data-cy="upload-area"]').should('be.visible');
    cy.get('[data-cy="upload-area"]').should('contain', 'Upload your file (.csv)');
  });
  it('checks that input element and the upload area are disabled', () => {
    cy.mount(
      <ThemeProvider theme={NBTheme}>
        <FileUploader
          displayText={props.displayText}
          handleClickToUpload={props.handleClickToUpload}
          handleDrop={props.handleDrop}
          handleDragOver={props.handleDragOver}
          handleFileUpload={props.handleFileUpload}
          fileInputRef={props.fileInputRef}
          allowedFileType={props.allowedFileType}
          disabled
        />
      </ThemeProvider>
    );
    cy.get('[data-cy="upload-area"] input').should('be.disabled');
    cy.get('[data-cy="upload-area"]').should('have.css', 'cursor', 'not-allowed');
  });
});
