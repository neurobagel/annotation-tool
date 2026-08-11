/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://docs.cypress.io/app/references/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import '@cypress/code-coverage/support';
import { mount } from 'cypress/react';
// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import styles
import '../../src/index.css';
import useLocalStore from '../../src/stores/local';
import './commands';

// Globally disable the Tour Guide overlay in component tests by default
// Component tests can explicitly opt-in by calling useLocalStore.setState({ hasSeenColumnAnnotationTour: false })
beforeEach(() => {
  useLocalStore.setState({ hasSeenColumnAnnotationTour: true });
});

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Example use:
// cy.mount(<MyComponent />)
