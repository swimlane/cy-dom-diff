declare namespace Chai {
  type ProcessorOptions = import('@swimlane/dom-diff').ProcessorOptions;

  interface Assertion {
    domMatch(re: RegExp, message?: string | ProcessorOptions): Assertion;
    domMatch(
      re: RegExp,
      message?: string,
      options?: ProcessorOptions
    ): Assertion;
  }
}
