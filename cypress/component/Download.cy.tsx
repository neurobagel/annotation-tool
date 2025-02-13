import Download from '../../src/components/Download';

describe('Download', () => {
  it('should render correctly', () => {
    cy.mount(<Download />);
    cy.contains('Download');
  });
});
