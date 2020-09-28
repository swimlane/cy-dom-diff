const { isJquery, isElement } = Cypress.dom;

export function getDom($el: any) {
  if (isJquery($el)) {
    return $el.html();
  }
  if (isElement($el)) {
    return $el.innerHTML;
  }
  return $el;  // TODO: errror
}