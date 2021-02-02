const { isJquery, isElement } = Cypress.dom;

export const getDom = ($el: any) => {
  if (isJquery($el)) {
    return $el.html();
  }
  if (isElement($el)) {
    return $el.innerHTML;
  }
  return $el; // TODO: errror?
};

export const disambiguateArgs = (
  args: [
    string | Record<string, unknown> | undefined,
    Record<string, unknown> | undefined
  ]
): [string | undefined, Record<string, unknown> | undefined] => {
  if (args.length === 2) {
    return args as [string | undefined, Record<string, unknown> | undefined];
  }
  return typeof args[0] === 'object'
    ? [undefined, args[0]]
    : [args[0], undefined];
};
