import GoogleDriveUpload from '../../src/components/GoogleDriveUpload';

const props = {
  open: true,
  onClose: () => {},
  dataDictionary: {},
  appsScriptUrl: 'https://somecoolurl.com/exec',
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
        appsScriptUrl={props.appsScriptUrl}
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

    it('should handle file exists conflict by creating a new version', () => {
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

      cy.get('[data-cy="overwrite-confirm-button"]').should('be.visible');
      cy.get('[data-cy="new-filename-preview"]').should('be.visible').and('contain', 'conflict');

      cy.get('[data-cy="overwrite-confirm-button"]').click();
      cy.wait('@createFile').then((interception) => {
        const { body } = interception.request;
        const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        expect(parsedBody.checkExists).to.equal(false);
        // Not end without prefix
        expect(parsedBody.filename).to.not.equal('conflict.json');
      });

      cy.get('[data-cy="upload-success-alert"]').should('be.visible');
      cy.get('[data-cy="open-drive-file-button"]').should('be.visible');
    });

    it('should suggest a high-precision timestamp suffix on conflict', () => {
      // Set a fixed date time: 2026-02-10 12:00:00 UTC
      const now = new Date('2026-02-10T12:00:00.000Z').getTime();
      cy.clock(now);

      cy.intercept('POST', '**/exec', (req) => {
        const body = JSON.parse(req.body);
        if (body.action !== 'getSites') {
          req.reply({
            body: { status: 'conflict' },
          });
        }
      }).as('createFileConflict');

      cy.get('[data-cy="dataset-name-input"]').type('TimestampTest');
      cy.get('[data-cy="password-input"]').type('pass');
      cy.get('[data-cy="upload-button"]').click();

      cy.wait('@createFileConflict');

      cy.get('[data-cy="new-filename-preview"]').should('contain', '_20260210_120000');
    });

    it('should use custom suffix when provided', () => {
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
              body: { status: 'success', fileId: '67890' },
            });
          }
        }
      }).as('createFileCustom');

      cy.get('[data-cy="dataset-name-input"]').type('CustomSuffixTest');
      cy.get('[data-cy="password-input"]').type('pass');
      cy.get('[data-cy="upload-button"]').click();

      cy.wait('@createFileCustom');

      cy.get('[data-cy="custom-suffix-input"]').type('v2');
      cy.get('[data-cy="new-filename-preview"]').should('contain', '_v2');
      cy.get('[data-cy="overwrite-confirm-button"]').click();

      cy.wait('@createFileCustom').then((interception) => {
        const { body } = interception.request;
        const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        expect(parsedBody.checkExists).to.equal(false);
        expect(parsedBody.filename).to.contain('_v2.json');
      });

      cy.get('[data-cy="upload-success-alert"]').should('be.visible');
    });

    it('should only show info icon in initial state', () => {
      // Initial state: Info icon should be visible
      cy.get('[data-cy="upload-info-button"]').should('exist').and('be.visible');

      cy.intercept('POST', '**/exec', (req) => {
        const body = JSON.parse(req.body);
        if (body.action !== 'getSites') {
          req.reply({ body: { status: 'success', fileId: '123' } });
        }
      }).as('uploadSuccess');

      cy.get('[data-cy="dataset-name-input"]').type('InfoIconTest');
      cy.get('[data-cy="password-input"]').type('pass');
      cy.get('[data-cy="upload-button"]').click();
      cy.wait('@uploadSuccess');
      cy.get('[data-cy="upload-success-alert"]').should('be.visible');

      // Success state: Info icon should NOT be visible
      cy.get('[data-cy="upload-info-button"]').should('not.exist');
    });
  });
});
