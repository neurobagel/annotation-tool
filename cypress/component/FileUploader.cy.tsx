import React from 'react';
import FileUploader from '../../src/components/FileUploader';

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
      <FileUploader
        displayText={props.displayText}
        handleClickToUpload={props.handleClickToUpload}
        handleDrop={props.handleDrop}
        handleDragOver={props.handleDragOver}
        handleFileUpload={props.handleFileUpload}
        fileInputRef={props.fileInputRef}
        allowedFileType={props.allowedFileType}
      />
    );
    cy.get('[data-cy="upload-area"]').should('be.visible');
    cy.get('[data-cy="upload-area"]').should('contain', 'Upload your file (.csv)');
  });
});
