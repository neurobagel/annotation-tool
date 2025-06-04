import { mockColumns } from '~/utils/mocks';
import ColumnTypeCollapse from '../../src/components/ColumnTypeCollapse';
import ExpandableSection from '../../src/components/ExpandableSection';

// TestComponent to wrap ColumnTypeCollapse in an ExpandableSection since the linter doesn't like passing children as props
function TestComponent({ defaultExpanded }: { defaultExpanded: boolean }) {
  return (
    <ExpandableSection title="some title" defaultExpanded={defaultExpanded}>
      <ColumnTypeCollapse
        dataType={'Continuous' as 'Categorical' | 'Continuous' | null}
        standardizedVariable={{
          identifier: 'nb:ParticipantID',
          label: 'Subject ID',
        }}
        columns={mockColumns}
        onSelect={() => {}}
        selectedColumnId="1"
      />
    </ExpandableSection>
  );
}

describe('ColumnTypeCollapse', () => {
  it('renders the component correctly', () => {
    cy.mount(<TestComponent defaultExpanded />);
    cy.get('[data-cy="side-column-nav-bar-some title"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-some title-toggle-button"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-subject id"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-some title-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-subject id"]').should('not.be.visible');
  });
  it('renders the component correctly when defaultExpanded is false', () => {
    cy.mount(<TestComponent defaultExpanded={false} />);
    cy.get('[data-cy="side-column-nav-bar-subject id"]').should('not.be.visible');
  });
});
