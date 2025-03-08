import UploadCard from '../../src/components/UploadCard';

const exampleFileName = 'ds003653_participant.tsv';
const exampleFilePath = `cypress/fixtures/examples/${exampleFileName}`;

function MockPreviewComponent() {
  return <div data-cy="some title-datatable">Preview Component</div>;
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

    cy.get('[data-cy="someid-upload-input"]').selectFile(exampleFilePath, { force: true });
  });

  it('should render the component correctly', () => {
    cy.get('[data-cy="someid-upload-card"]').should('be.visible');
    cy.get('[data-cy="someid-upload-card"]').should('contain', 'some title');
    cy.get('[data-cy="someid-upload-card"]').should('contain', 'some display text');
  });

  it('should open the preview, and verify the data table preview component is rendered', () => {
    cy.get('[data-cy="someid-uploaded-file-name"]').should('contain', exampleFileName);

    cy.get('[data-cy="someid-toggle-preview-button"]').click();

    cy.get('[data-cy="someid-toggle-preview-button"]').should('be.visible');
  });
});
