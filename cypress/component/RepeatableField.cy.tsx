import { useState } from 'react';
import { RepeatableField } from '../../src/components/RepeatableField';

describe('RepeatableField', () => {
  it('should correctly remove the second item in a list of four', () => {
    const TestComponent = () => {
      const [values, setValues] = useState(['Author 1', 'Author 2', 'Author 3', 'Author 4']);
      return (
        <RepeatableField
          itemLabel="Author"
          values={values}
          onChange={setValues}
          dataCy="author-field"
        />
      );
    };

    cy.mount(<TestComponent />);

    cy.get('[data-cy^="author-field-input-"]').should('have.length', 4);
    cy.get('[data-cy="author-field-input-0"]').find('input').should('have.value', 'Author 1');
    cy.get('[data-cy="author-field-input-1"]').find('input').should('have.value', 'Author 2');
    cy.get('[data-cy="author-field-input-2"]').find('input').should('have.value', 'Author 3');
    cy.get('[data-cy="author-field-input-3"]').find('input').should('have.value', 'Author 4');

    cy.get('[data-cy="author-field-remove-1"]').click();

    cy.get('[data-cy^="author-field-input-"]').should('have.length', 3);
    cy.get('[data-cy="author-field-input-0"]').find('input').should('have.value', 'Author 1');
    cy.get('[data-cy="author-field-input-1"]').find('input').should('have.value', 'Author 3');
    cy.get('[data-cy="author-field-input-2"]').find('input').should('have.value', 'Author 4');
  });

  it('should not remove the last remaining item but clear its value instead', () => {
    const TestComponent = () => {
      const [values, setValues] = useState(['Only Author']);
      return (
        <RepeatableField
          itemLabel="Author"
          values={values}
          onChange={setValues}
          dataCy="author-field"
        />
      );
    };

    cy.mount(<TestComponent />);

    cy.get('[data-cy^="author-field-input-"]').should('have.length', 1);
    cy.get('[data-cy="author-field-input-0"]').find('input').should('have.value', 'Only Author');

    cy.get('[data-cy="author-field-remove-0"]').click();

    cy.get('[data-cy^="author-field-input-"]').should('have.length', 1);
    cy.get('[data-cy="author-field-input-0"]').find('input').should('have.value', '');
  });

  it('should add a new item to the list', () => {
    const TestComponent = () => {
      const [values, setValues] = useState(['Author 1']);
      return (
        <RepeatableField
          itemLabel="Author"
          values={values}
          onChange={setValues}
          dataCy="author-field"
        />
      );
    };

    cy.mount(<TestComponent />);

    cy.get('[data-cy^="author-field-input-"]').should('have.length', 1);

    cy.get('[data-cy="author-field-add"]').click();

    cy.get('[data-cy^="author-field-input-"]').should('have.length', 2);
    cy.get('[data-cy="author-field-input-1"]').find('input').should('have.value', '');
  });
});
