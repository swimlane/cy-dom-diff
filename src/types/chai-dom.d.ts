declare namespace Chai {
  type DiffOptions = import('@open-wc/semantic-dom-diff/get-diffable-html').DiffOptions;
  
  interface Assertion {
    domMatch(re: RegExp, message?: string | DiffOptions): Assertion;
    domMatch(re: RegExp, message?: string, options?: DiffOptions): Assertion;
  }
}