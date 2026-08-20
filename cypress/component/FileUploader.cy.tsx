import React from 'react';
import FileUploader from '../../src/components/FileUploader';
import { AllowedFileType } from '../../src/utils/internal_types';

const props: {
  id: string;
  displayText: string;
  handleClickToUpload: () => void;
  handleDrop: () => void;
  handleDragOver: () => void;
  handleFileUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  allowedFileType: AllowedFileType;
} = {
  id: 'someid',
  displayText: 'Upload your file (.tsv)',
  handleClickToUpload: () => {},
  handleDrop: () => {},
  handleDragOver: () => {},
  handleFileUpload: () => {},
  fileInputRef: React.createRef<HTMLInputElement | null>(),
  allowedFileType: '.tsv',
};

describe('FileUploader', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <FileUploader
        id={props.id}
        displayText={props.displayText}
        handleClickToUpload={props.handleClickToUpload}
        handleDrop={props.handleDrop}
        handleDragOver={props.handleDragOver}
        handleFileUpload={props.handleFileUpload}
        fileInputRef={props.fileInputRef}
        allowedFileType={props.allowedFileType}
      />
    );
    cy.get('[data-cy="someid-upload-area"]').should('be.visible');
    cy.get('[data-cy="someid-upload-area"]').should('contain', 'Upload your file (.tsv)');
    cy.get('[data-cy="someid-upload-input"]').should('have.attr', 'accept', '.tsv');
  });

  it('checks that input element and the upload area are disabled', () => {
    cy.mount(
      <FileUploader
        id={props.id}
        displayText={props.displayText}
        handleClickToUpload={props.handleClickToUpload}
        handleDrop={props.handleDrop}
        handleDragOver={props.handleDragOver}
        handleFileUpload={props.handleFileUpload}
        fileInputRef={props.fileInputRef}
        allowedFileType={props.allowedFileType}
        disabled
      />
    );
    cy.get('[data-cy="someid-upload-area"] input').should('be.disabled');
    cy.get('[data-cy="someid-upload-area"]').should('have.css', 'cursor', 'not-allowed');
  });

  it('renders the file selected view correctly', () => {
    cy.mount(
      <FileUploader
        id={props.id}
        displayText={props.displayText}
        handleClickToUpload={props.handleClickToUpload}
        handleDrop={props.handleDrop}
        handleDragOver={props.handleDragOver}
        handleFileUpload={props.handleFileUpload}
        fileInputRef={props.fileInputRef}
        allowedFileType={props.allowedFileType}
        uploadedFileName="test.csv"
      />
    );
    cy.get('svg[data-testid="InsertDriveFileIcon"]').should('be.visible');
    cy.get('svg[data-testid="CloudUploadIcon"]').should('not.exist');
    cy.get('[data-cy="someid-upload-area"]').should('contain', 'test.csv');
    cy.get('[data-cy="someid-upload-area"]').should('contain', 'Click to replace');
  });
});
