import { getDiffableHTML } from '@open-wc/semantic-dom-diff';

function escape(source: RegExp | string) {
  if (source instanceof RegExp) return source.source;
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function html(strings: TemplateStringsArray, ...args: any[]): RegExp {
  const result = [strings[0]];
  args.forEach((arg, i) => {
    result.push(`__arg${i}__`, strings[i + 1]);
  });
  let html = escape(getDiffableHTML(result.join('')));
  args.forEach((arg, i) => {
    html = html.replace(`__arg${i}__`, escape(arg));
  });
  return new RegExp(`^${html}$`);
}
