import Upload from '../../src/components/Upload';

describe('Upload', () => {
  it('should render correctly', () => {
    cy.mount(<Upload />);
    cy.contains('Upload');
  });
});
