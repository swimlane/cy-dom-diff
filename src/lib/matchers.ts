import { clean } from './util';

function escape(source: RegExp | string) {
  if (source instanceof RegExp) return source.source;
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export class PatternRegExp extends RegExp {
  constructor(
    source: string,
    public readonly pattern: string,
    public readonly matchers: any[]
  ) {
    super(source);
  }

  compare = function (this: PatternRegExp, left: string, right: string) {
    if (right.includes('__arg')) {
      const source = this.matchers.reduce((acc, m, i) => {
        return acc.replace(`__arg${i}__`, escape(m));
      }, escape(right));
      return new RegExp(source).test(left);
    }
    return left === right;
  }

  replace = function (this: PatternRegExp, str: string) {
    return this.matchers.reduce((acc, m, i) => {
      return str.replace(`__arg${i}__`, `\${${m}}`);
    }, str);
  }
}

export function html(strings: TemplateStringsArray, ...args: any[]): PatternRegExp {
  const result = [strings[0]];
  args.forEach((arg, i) => {
    result.push(`__arg${i}__`, strings[i + 1]);
  });
  const pattern = clean(result.join(''));
  const source = args.reduce((acc, arg, i) => {
    return acc.replace(`__arg${i}__`, escape(arg));
  }, escape(pattern));
  return new PatternRegExp(`^${source}$`, pattern, args);
}
