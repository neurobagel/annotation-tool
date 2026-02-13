import { useState } from 'react';
import GoogleDriveUpload from '../../src/components/GoogleDriveUpload';

const testProps = {
  open: true,
  onClose: () => {},
  dataDictionary: {},
  appsScriptUrl: 'https://somecoolurl.com/exec',
  config: 'some-config',
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
        open={testProps.open}
        onClose={testProps.onClose}
        dataDictionary={testProps.dataDictionary}
        appsScriptUrl={testProps.appsScriptUrl}
        config={testProps.config}
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

  it('should handle unconfigured backend script gracefully', () => {
    cy.mount(
      <GoogleDriveUpload
        open={testProps.open}
        onClose={testProps.onClose}
        dataDictionary={testProps.dataDictionary}
        appsScriptUrl=""
        config={testProps.config}
      />
    );

    cy.get('[data-cy="config-error-alert"]').should('be.visible');
    cy.get('[data-cy="upload-button"]').should('not.exist');
  });

  context('When the backend script is correctly configured', () => {
    it('should display error when site names cannot be fetched', () => {
      cy.intercept('POST', '**/exec', (req) => {
        const body = JSON.parse(req.body);
        if (body.action === 'getSites') {
          req.reply({ statusCode: 500, body: 'Internal Server Error' });
        }
      }).as('getSitesFail');

      cy.mount(
        <GoogleDriveUpload
          open={testProps.open}
          onClose={testProps.onClose}
          dataDictionary={testProps.dataDictionary}
          appsScriptUrl={testProps.appsScriptUrl}
          config={testProps.config}
        />
      );

      cy.wait('@getSitesFail');
      cy.get('[data-cy="upload-error-alert"]')
        .should('be.visible')
        .and('contain', 'Failed to fetch site names')
        .and('contain', '500');
    });

    it('should populate the site dropdown with fetched site names', () => {
      cy.get('[data-cy="site-select"]').click();
      cy.get('[role="listbox"]').within(() => {
        cy.contains('SiteA').should('be.visible');
        cy.contains('SiteB').should('be.visible');
      });
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

    it('should clear fields on close', () => {
      cy.clock();
      cy.get('[data-cy="dataset-name-input"]').type('SensitiveDataTest');
      cy.get('[data-cy="password-input"]').type('supersecret');

      cy.get('[data-cy="close-button"]').click();

      // Use a wrapper component to toggle visibility to verify state logic
      function Wrapper() {
        const [open, setOpen] = useState(true);
        return (
          <>
            <button data-cy="toggle-open" type="button" onClick={() => setOpen(true)}>
              Open
            </button>
            <GoogleDriveUpload
              dataDictionary={testProps.dataDictionary}
              appsScriptUrl={testProps.appsScriptUrl}
              open={open}
              onClose={() => setOpen(false)}
              config={testProps.config}
            />
          </>
        );
      }

      cy.mount(<Wrapper />);

      cy.get('[data-cy="dataset-name-input"]').type('SensitiveDataTest');
      cy.get('[data-cy="password-input"]').type('supersecret');

      cy.get('[data-cy="close-button"]').click();

      // Advance time to triggering the state clearing timeout (300ms)
      cy.tick(500);

      cy.get('[data-cy="toggle-open"]').click();

      cy.get('[data-cy="dataset-name-input"]').should('have.value', '');
      cy.get('[data-cy="password-input"]').should('have.value', '');
    });
  });
});
