import { dom, diff, getDiffableHTML } from '@swimlane/dom-diff';

import unindent from 'strip-indent';

function f(s: string): string {
  return unindent(s).trim();
}

describe('diff', () => {
  it(`doesn't shows diff when there is none`, () => {
    expect(diff(dom`<div>Hello World</div>`, getDiffableHTML('<div>Hello World</div>'))).to.equal('');
  });

  it('shows diff in static portions', () => {
    expect(diff(dom`<div>Hello Earth</div>`, getDiffableHTML('<div>Hello World</div>'))).to.equal(f(`
       <div>
      -  Hello Earth
      +  Hello World
       </div>`));
  });

  it('returns empty string when regex matches', () => {
    expect(diff(dom`<div>Hello ${/[a-zA-Z]+/}</div>`, getDiffableHTML('<div>Hello World</div>'))).to.equal('');
  });

  it('shows diff in static regexp', () => {
    expect(diff(dom`<div>Hello ${/[a-zA-Z]+/}</div>`, getDiffableHTML('<div>Hello 123</div>'))).to.equal(f(`
       <div>
      -  Hello \${/[a-zA-Z]+/}
      +  Hello 123
       </div>`));
  });

  it('shows correct mismatch', () => {
    expect(diff(dom`<div>${/[a-zA-Z]+/}</div><div>${/[a-zA-Z]+/}</div>`, getDiffableHTML('<div>Hello</div><div>123</div>'))).to.equal(f(`
       <div>
         Hello
       </div>
       <div>
      -  \${/[a-zA-Z]+/}
      +  123
       </div>`));
  });
});