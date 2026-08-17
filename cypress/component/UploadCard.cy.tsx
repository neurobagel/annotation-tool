import UploadCard from '../../src/components/UploadCard';

const exampleFileName = 'ds003653_participant.tsv';

function MockPreviewComponent() {
  return <div data-cy="some-title-datatable">Preview Component</div>;
}

const props = {
  id: 'someid',
  title: 'some title',
  FileUploaderDisplayText: 'some display text',
  allowedFileType: '.tsv',
  uploadedFileName: exampleFileName,
  onFileUpload: () => {},
  previewComponent: <MockPreviewComponent />,
};

describe('UploadCard', () => {
  beforeEach(() => {
    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType={props.allowedFileType}
        uploadedFileName={props.uploadedFileName}
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
  });

  it('should render the component correctly', () => {
    cy.get('[data-cy="someid-upload-card"]').should('be.visible');
    cy.get('[data-cy="someid-upload-card"]').should('contain', 'some title');
    cy.get('[data-cy="someid-toggle-preview-button"]').should('be.visible');
  });

  it('should open the preview, and verify the data table preview component is rendered', () => {
    cy.get('[data-cy="someid-toggle-preview-button"]').click();

    cy.get('[data-cy="some-title-datatable"]').should('be.visible');
  });
  it('should not render preview button if uploadedFileName prop is null or empty string.', () => {
    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType={props.allowedFileType}
        uploadedFileName={''}
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
    cy.get('[data-cy="someid-toggle-preview-button"]').should('not.exist');

    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType={props.allowedFileType}
        uploadedFileName={null}
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
    cy.get('[data-cy="someid-toggle-preview-button"]').should('not.exist');
  });
  it('should show an error message and hide the preview button when an invalid JSON file is uploaded', () => {
    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType=".json"
        uploadedFileName=""
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from('{"invalidJson": '),
        fileName: 'bad.json',
        mimeType: 'application/json',
      },
      { force: true }
    );

    cy.get('[data-cy="someid-upload-text"]')
      .should('be.visible')
      .and('contain', 'Invalid JSON file uploaded. Please check the file for syntax errors.')
      .and('have.css', 'color', 'rgb(211, 47, 47)');
    cy.get('[data-cy="someid-error-icon"]').should('be.visible');
    cy.get('[data-cy="someid-upload-area"]').should('have.css', 'border-color', 'rgb(211, 47, 47)');
    cy.get('[data-cy="someid-toggle-preview-button"]').should('not.exist');
  });

  it('should show an error message and hide the preview button when a non-TSV file is uploaded to a TSV allowed uploader', () => {
    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType=".tsv"
        uploadedFileName=""
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from('col1\tcol2\nval1\tval2'),
        fileName: 'bad.txt',
        mimeType: 'text/plain',
      },
      { force: true }
    );

    cy.get('[data-cy="someid-upload-text"]')
      .should('be.visible')
      .and('contain', 'Invalid file type. Please upload a .tsv file.')
      .and('have.css', 'color', 'rgb(211, 47, 47)');
    cy.get('[data-cy="someid-error-icon"]').should('be.visible');
    cy.get('[data-cy="someid-upload-area"]').should('have.css', 'border-color', 'rgb(211, 47, 47)');
    cy.get('[data-cy="someid-toggle-preview-button"]').should('not.exist');
  });

  it('should show an error message when a TSV file with duplicate column names is uploaded', () => {
    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType=".tsv"
        uploadedFileName=""
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from('col1\tcol1\nval1\tval2'),
        fileName: 'dup.tsv',
        mimeType: 'text/tab-separated-values',
      },
      { force: true }
    );

    cy.get('[data-cy="someid-upload-text"]')
      .should('be.visible')
      .and(
        'contain',
        'The uploaded data table contains duplicate column names. Please ensure all column names are unique.'
      )
      .and('have.css', 'color', 'rgb(211, 47, 47)');
  });

  it('should show a warning message when a TSV file with empty columns and rows is uploaded', () => {
    cy.mount(
      <UploadCard
        id={props.id}
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType=".tsv"
        uploadedFileName="empty.tsv"
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );
    cy.get('input[type="file"]').selectFile(
      {
        // 2 headers, second is empty in data, plus an empty row
        contents: Cypress.Buffer.from('col1\tcol2\n\t\nval1\t\nval2\t'),
        fileName: 'empty.tsv',
        mimeType: 'text/tab-separated-values',
      },
      { force: true }
    );

    cy.get('[data-cy="someid-warning-text"]')
      .should('be.visible')
      .and('contain', 'Warning: The uploaded file contains 1 empty column and 1 empty row.')
      .and('have.css', 'color', 'rgb(237, 108, 2)');
  });
});
