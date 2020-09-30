# cy-dom-diff

Dynamic Dom Diff in Cypress

## Installation and Setup

```bash
npm install --save-dev @swimlane/cy-dom-diff
```

Import the Cypress commands in cypress/support/index.js

```js
import '@swimlane/cy-dom-diff/commands';
```

## Usage

### Assertions

#### `domMatch`

```js
const TIME = /\d?\d:\d?\d\:\d?\d/;
const NUMBER = /[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/;

expect($el).domMatch(html`
    <span>The current time is:</span>
    <span class="clock">${TIME} ${/[AP]/}M</span>
    <span class="offset">${NUMBER}</span> hrs
  `);
```

```js
const TIME = /\d?\d:\d?\d\:\d?\d/;
const NUMBER = /[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/;

cy.get('#clock').should('domMatch', html`
    <span>The current time is:</span>
    <span class="clock">${TIME} ${/[AP]/}M</span>
    <span class="offset">${NUMBER}</span> hrs
  `);
```

### Commands

#### `domMatch`

```js
const TIME = /\d?\d:\d?\d\:\d?\d/;
const NUMBER = /[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/;

cy.get('#clock').domMatch(html`
    <span>The current time is:</span>
    <span class="clock">${TIME} ${/[AP]/}M</span>
    <span class="offset">${NUMBER}</span> hrs
  `);
```

#### `domDiff`

```js
const TIME = /\d?\d:\d?\d\:\d?\d/;
const NUMBER = /[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/;

cy.get('#clock').domDiff(html`
    <span>The current time is:</span>
    <span class="clock">${TIME} ${/[AP]/}M</span>
    <span class="offset">${NUMBER}</span> hrs
  `);
```

## Credits

`cy-dom-diff` is a Swimlane open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.