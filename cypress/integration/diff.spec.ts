import { html } from '@swimlane/cy-dom-diff';
import { clean } from '@swimlane/cy-dom-diff/lib/util';

import unindent from 'strip-indent';

function f(s: string): string {
  return unindent(s).trim();
}

describe('diff', () => {
  it(`doesn't shows diff when there is none`, () => {
    expect(html`<div>Hello World</div>`.diff(clean('<div>Hello World</div>'))).to.equal('');
  });

  it('shows diff in static portions', () => {
    expect(html`<div>Hello Earth</div>`.diff(clean('<div>Hello World</div>'))).to.equal(f(`
       <div>
      -  Hello Earth
      +  Hello World
       </div>`));
  });

  it('returns empty string when regex matches', () => {
    expect(html`<div>Hello ${/[a-zA-Z]+/}</div>`.diff(clean('<div>Hello World</div>'))).to.equal('');
  });

  it('shows diff in static regexp', () => {
    expect(html`<div>Hello ${/[a-zA-Z]+/}</div>`.diff(clean('<div>Hello 123</div>'))).to.equal(f(`
       <div>
      -  Hello \${/[a-zA-Z]+/}
      +  Hello 123
       </div>`));
  });

  it('shows correct mismatch', () => {
    expect(html`<div>${/[a-zA-Z]+/}</div><div>${/[a-zA-Z]+/}</div>`.diff(clean('<div>Hello</div><div>123</div>'))).to.equal(f(`
       <div>
         Hello
       </div>
       <div>
      -  \${/[a-zA-Z]+/}
      +  123
       </div>`));
  });
});