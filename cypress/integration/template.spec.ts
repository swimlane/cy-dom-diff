import { html } from '../../src/lib/matchers';
import { WORD } from '../../src/lib/regexps';

describe('html template tag', () => {
  it('generates a regex', () => {
    expect(html`<h1>Hello World</h1>`).to.be.instanceof(RegExp);
    expect(html`<h1>Hello World</h1>`).to.deep.equal(/^<h1>\n  Hello World\n<\/h1>\n$/);
    expect(html`<h1 class="a b c" >Hello World</h1>`).to.deep.equal(/^<h1 class="a b c">\n  Hello World\n<\/h1>\n$/);
    expect(html`<h1>Hello ${WORD}</h1>`).to.deep.equal(/^<h1>\n  Hello [\w\-]+\n<\/h1>\n$/);
  });
  
  it('cleans generated html', () => {
    expect(html`<h1 class="z y x">Hello World</h1>`).to.deep.equal(/^<h1 class="x y z">\n  Hello World\n<\/h1>\n$/);
  });

  it('has a pattern', () => {
    expect(html`<h1>Hello ${WORD}</h1>`.pattern).to.equal('<h1>\n  Hello __arg0__\n</h1>\n');
  });

  it('has matchers', () => {
    expect(html`<h1>Hello ${WORD}</h1>`.matchers).to.deep.equal([WORD]);
  });
});
