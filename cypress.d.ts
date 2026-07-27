import { mount } from 'cypress/react';
import type { MountReturn } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
