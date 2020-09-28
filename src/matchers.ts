import { getDiffableHTML } from '@open-wc/semantic-dom-diff';

function escape(source: RegExp | string) {
  if (source instanceof RegExp) return source.source;
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export class PatternRegExp extends RegExp {
  constructor(source: string, public readonly pattern: string) {
    super(source);
  }
}

export function html(strings: TemplateStringsArray, ...args: any[]): RegExp {
  const result = [strings[0]];
  args.forEach((arg, i) => {
    result.push(`__arg${i}__`, strings[i + 1]);
  });
  let pattern = getDiffableHTML(result.join(''));
  let source = escape(pattern);
  args.forEach((arg, i) => {
    source = source.replace(`__arg${i}__`, escape(arg));
    pattern = pattern.replace(`__arg${i}__`, `\${${arg}}`);
  });
  return new PatternRegExp(`^${source}$`, pattern);
}
