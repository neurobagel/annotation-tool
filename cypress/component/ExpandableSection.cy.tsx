import ColumnTypeCollapse from '../../src/components/ColumnTypeCollapse';
import ExpandableSection from '../../src/components/ExpandableSection';
import type { ColumnGroupColumn } from '../../src/hooks/useValueAnnotationColumns';

const mockColumnGroup: ColumnGroupColumn[] = [
  {
    id: '1',
    column: {
      id: '1',
      name: 'participant_id',
      allValues: [],
    },
  },
];

function TestComponent({ defaultExpanded }: { defaultExpanded: boolean }) {
  return (
    <ExpandableSection title="some title" defaultExpanded={defaultExpanded}>
      <ColumnTypeCollapse
        label="subject id"
        dataType="Continuous"
        columns={mockColumnGroup}
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
