import GoogleDriveUpload from '../../src/components/GoogleDriveUpload';

const props = {
  open: true,
  onClose: () => {},
  dataDictionary: {},
};

describe('GoogleDriveUpload', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/exec', (req) => {
      const body = JSON.parse(req.body);

      if (body.action === 'getSites') {
        req.reply({
          body: { status: 'success', sites: ['SiteA', 'SiteB'] },
        });
      }
    }).as('getSites');
    cy.mount(
      <GoogleDriveUpload
        open={props.open}
        onClose={props.onClose}
        dataDictionary={props.dataDictionary}
      />
    );

    cy.wait('@getSites');
  });

  it('should render the dialog when open is true', () => {
    cy.get('[data-cy="google-drive-upload-dialog"]').should('be.visible');
    cy.get('[data-cy="dataset-name-input"]').should('be.visible');
    cy.get('[data-cy="site-select"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="upload-button"]').should('be.visible');
    cy.get('[data-cy="user-name-input"]').should('be.visible');
    cy.get('[data-cy="user-email-input"]').should('be.visible');
    cy.get('[data-cy="user-notes-input"]').should('be.visible');
  });

  it('should handle missing configuration gracefully', () => {
    cy.mount(
      <GoogleDriveUpload
        open={props.open}
        onClose={props.onClose}
        dataDictionary={props.dataDictionary}
        appsScriptUrl=""
      />
    );

    cy.get('[data-cy="config-error-alert"]').should('be.visible');
    cy.get('[data-cy="upload-button"]').should('not.exist');
  });

  context('When Configured', () => {
    it('should fetch sites and populate the select', () => {
      cy.get('[data-cy="site-select"]').click();
      cy.get('[role="listbox"]').should('contain', 'SiteA');
      cy.get('[role="listbox"]').should('contain', 'SiteB');
      cy.get('[role="option"]').contains('SiteA').click();
    });

    it('should enable upload button only when required fields are filled', () => {
      cy.get('[data-cy="upload-button"]').should('be.disabled');

      cy.get('[data-cy="dataset-name-input"]').type('MyDataset');
      cy.get('[data-cy="upload-button"]').should('be.disabled');

      cy.get('[data-cy="password-input"]').type('password123');

      cy.get('[data-cy="upload-button"]').should('be.enabled');
    });

    it('should handle successful upload', () => {
      cy.intercept('POST', '**/exec', (req) => {
        const body = JSON.parse(req.body);
        if (body.action !== 'getSites') {
          req.reply({
            body: { status: 'success', fileId: '12345' },
          });
        }
      }).as('createFile');

      cy.get('[data-cy="dataset-name-input"]').type('SuccessDataset');
      cy.get('[data-cy="password-input"]').type('correctPass');
      cy.get('[data-cy="upload-button"]').click();

      cy.wait('@createFile').then((interception) => {
        const { body } = interception.request;
        // If body is string (text/plain), parse it. If object, use as is.
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        expect(parsed.filename).to.contain('SuccessDataset');
        expect(parsed.checkExists).to.equal(true);
      });

      cy.get('[data-cy="upload-success-alert"]').should('be.visible');
      cy.get('[data-cy="open-drive-file-button"]').should('be.visible');
    });

    it('should handle auth failure', () => {
      cy.intercept('POST', '**/exec', (req) => {
        const body = JSON.parse(req.body);
        if (body.action !== 'getSites') {
          req.reply({
            body: { status: 'auth_failed', message: 'Incorrect Password' },
          });
        }
      }).as('createFile');

      cy.get('[data-cy="dataset-name-input"]').type('AuthFailDataset');
      cy.get('[data-cy="password-input"]').type('wrong');
      cy.get('[data-cy="upload-button"]').click();

      cy.wait('@createFile');

      cy.get('[data-cy="upload-error-alert"]')
        .should('be.visible')
        .and('contain', 'Incorrect Password');
    });

    it('should handle file exists conflict and allow overwrite', () => {
      // Mock Conflict THEN Success (on retry)
      let conflictHit = false;
      cy.intercept('POST', '**/exec', (req) => {
        const body = JSON.parse(req.body);
        if (body.action !== 'getSites') {
          if (!conflictHit) {
            conflictHit = true;
            req.reply({
              body: { status: 'conflict' },
            });
          } else {
            req.reply({
              body: { status: 'success', fileId: '12345' },
            });
          }
        }
      }).as('createFile');
      cy.get('[data-cy="dataset-name-input"]').type('conflict');
      cy.get('[data-cy="password-input"]').type('correctPass');
      cy.get('[data-cy="upload-button"]').click();

      cy.wait('@createFile');

      cy.get('[data-cy="overwrite-dialog"]').should('be.visible');

      cy.get('[data-cy="overwrite-confirm-button"]').click();
      cy.wait('@createFile').then((interception) => {
        const { body } = interception.request;
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        expect(parsed.checkExists).to.equal(false);
      });

      cy.get('[data-cy="upload-success-alert"]').should('be.visible');
      cy.get('[data-cy="open-drive-file-button"]').should('be.visible');
    });
  });
});
