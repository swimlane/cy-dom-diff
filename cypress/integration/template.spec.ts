import { dom } from '@swimlane/dom-diff';
import { WORD } from '@swimlane/cy-dom-diff';

describe('html template tag', () => {
  it('generates a regex', () => {
    expect(dom`<h1>Hello World</h1>`).to.be.instanceof(RegExp);
    expect(dom`<h1>Hello World</h1>`).to.deep.equal(/^<h1>\n  Hello World\n<\/h1>$/);
    expect(dom`<h1 class="a b c" >Hello World</h1>`).to.deep.equal(/^<h1\n  class="a b c"\n>\n  Hello World\n<\/h1>$/);
    expect(dom`<h1>Hello ${WORD}</h1>`).to.deep.equal(/^<h1>\n  Hello [\w\-]+\n<\/h1>$/);
  });
  
  it('cleans generated html', () => {
    expect(dom`<h1 class="z y x">Hello World</h1>`).to.deep.equal(/^<h1\n  class="x y z"\n>\n  Hello World\n<\/h1>$/);
  });

  it('has a pattern', () => {
    expect(dom`<h1>Hello ${WORD}</h1>`.pattern).to.equal('<h1>\n  Hello __arg0__\n</h1>');
  });

  it('has matchers', () => {
    expect(dom`<h1>Hello ${WORD}</h1>`.matchers).to.deep.equal([WORD]);
  });

  it('can generate from partial dom', () => { // TODO
    expect(dom`<td>Hello</td>`.pattern).to.deep.equal('<td>\n  Hello\n</td>');
  });

  it('bad html', () => { // TODO
    expect(dom`/>SADF &SDFsaedeflkj = <a s d>`.pattern).to.deep.equal('/>SADF &SDFsaedeflkj =<a\n  d\n  s\n></a>');
  });

  it('can generate from incomplete dom', () => {
    expect(dom`<div>Hello`.pattern).to.deep.equal('<div>\n  Hello\n</div>');
  });
});
