import { html } from '../../src/lib/matchers';
import { WORD } from '../../src/lib/regexps';

describe('html template tag', () => {
  it('generates a regex', () => {
    expect(html`<h1>Hello World</h1>`).to.be.instanceof(RegExp);
    expect(html`<h1>Hello World</h1>`.source).to.equal(/^<h1>\n  Hello World\n<\/h1>\n$/.source);
    expect(html`<h1>Hello World</h1>`.source).to.equal(/^<h1>\n  Hello World\n<\/h1>\n$/.source);
    expect(html`<h1>Hello ${WORD}</h1>`.source).to.equal(/^<h1>\n  Hello [\w\-]+\n<\/h1>\n$/.source);
  });
  
  it('cleans generated html', () => {
    expect(html`<h1 class="z y x">Hello World</h1>`.source).to.equal(/^<h1 class="x y z">\n  Hello World\n<\/h1>\n$/.source);
  });
});
