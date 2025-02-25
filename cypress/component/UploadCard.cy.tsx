import UploadCard from '../../src/components/UploadCard';

const exampleFileName = 'ds003653_participant.tsv';
const exampleFilePath = `examples/${exampleFileName}`;
function MockPreviewComponent() {
  return <div data-cy="some title-datatable">Preview Component</div>;
}

const props = {
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
        title={props.title}
        FileUploaderDisplayText={props.FileUploaderDisplayText}
        allowedFileType={props.allowedFileType}
        uploadedFileName={props.uploadedFileName}
        onFileUpload={props.onFileUpload}
        previewComponent={props.previewComponent}
      />
    );

    // Load the file from the fixtures folder
    cy.fixture(exampleFilePath, 'binary').then((fileContent) => {
      // Convert the binary content to a Blob
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'text/tab-separated-values');

      // Create a File object from the Blob
      const testFile = new File([blob], exampleFileName, { type: 'text/tab-separated-values' });

      // Simulate clicking the upload area
      cy.get('[data-cy="upload-area"]').click();

      // Trigger the file upload by selecting the file
      cy.get('input[type="file"]').then((input) => {
        // Cast input[0] to HTMLInputElement to access the files property
        const fileInput = input[0] as HTMLInputElement;

        // Create a DataTransfer object to simulate the file drop
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        fileInput.files = dataTransfer.files;

        // Trigger the change event manually
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });
  it('should render the component correctly', () => {
    cy.get('[data-cy="some title-upload-card"]').should('be.visible');
    cy.get('[data-cy="some title-upload-card"]').should('contain', 'some title');
    cy.get('[data-cy="some title-upload-card"]').should('contain', 'some display text');
  });
  it('should open the preview, and verify the data table preview component is rendered', () => {
    cy.get('[data-cy="some title-card-uploaded-file-name"]').should('contain', exampleFileName);

    cy.get('[data-cy="toggle-some title-card-preview"]').click();

    cy.get('[data-cy="toggle-some title-card-preview"]').should('be.visible');
  });
});
