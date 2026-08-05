import VisibleWhitespace from '../../src/components/VisibleWhitespace';
import { FormattingMarksContext } from '../../src/contexts/FormattingMarksContext';

describe('VisibleWhitespace Component', () => {
  describe('Without Formatting Marks', () => {
    it('should render normal string without marks', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={false}>
          <VisibleWhitespace value="hello world" />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', 'hello world');
    });

    it('should render empty string as nothing', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={false}>
          <VisibleWhitespace value="" />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', '');
    });

    it('should render non-strings via JSON.stringify', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={false}>
          <VisibleWhitespace value={123} />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', '123');
    });

    it('should render null correctly via JSON.stringify', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={false}>
          <VisibleWhitespace value={null} />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', 'null');
    });
  });

  describe('With Formatting Marks', () => {
    it('should render spaces as middle dots', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={true}>
          <VisibleWhitespace value="hello world " />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', 'hello·world·');
    });

    it('should render empty string as quotes', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={true}>
          <VisibleWhitespace value="" />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', '""');
    });

    it('should render tabs as arrows', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={true}>
          <VisibleWhitespace value={'data\tpoint'} />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', 'data→point');
    });

    it('should render newlines as pilcrow plus newline', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={true}>
          <VisibleWhitespace value={'line1\nline2'} />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', 'line1¶\nline2');
    });

    it('should render carriage returns as currency signs', () => {
      cy.mount(
        <FormattingMarksContext.Provider value={true}>
          <VisibleWhitespace value={'windows\r\n'} />
        </FormattingMarksContext.Provider>
      );
      cy.get('[data-cy="visible-whitespace"]').should('have.text', 'windows¤¶\n');
    });
  });
});
