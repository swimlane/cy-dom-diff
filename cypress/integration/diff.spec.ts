import { html } from '../../src/lib/matchers';
import { diff, clean } from '../../src/lib/util';

import unindent from 'unindent';

function f(s: string) {
  return unindent(s).trim();
}

describe('expect', () => {
  it('doesnt shows diff when there is none', () => {
    expect(diff(clean('<div>Hello World</div>'), html`<div>Hello World</div>`)).to.equal('');
  });

  it('shows diff in static portions', () => {
    expect(diff(clean('<div>Hello World</div>'), html`<div>Hello Earth</div>`).trim()).to.equal(f(`
       <div>
      -  Hello Earth
      +  Hello World
       </div>`));
  });

  it('returns empty string when regex matches', () => {
    expect(diff(clean('<div>Hello World</div>'), html`<div>Hello ${/[a-zA-Z]+/}</div>`).trim()).to.equal('');
  });

  it('shows diff in static regexp', () => {
    expect(diff(clean('<div>Hello 123</div>'), html`<div>Hello ${/[a-zA-Z]+/}</div>`).trim()).to.equal(f(`
       <div>
      -  Hello \${/[a-zA-Z]+/}
      +  Hello 123
       </div>`));
  });

  it('shows correct', () => {
    expect(diff(clean('<div>Hello</div><div>123</div>'), html`<div>${/[a-zA-Z]+/}</div><div>${/[a-zA-Z]+/}</div>`).trim()).to.equal(f(`
       <div>
         Hello
       </div>
       <div>
      -  \${/[a-zA-Z]+/}
      +  123
       </div>`));
  });
});