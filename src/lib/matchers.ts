import { clean } from './util';
import { createPatch } from 'diff';

function escape(source: RegExp | string) {
  if (source instanceof RegExp) return source.source;
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function formatPatch(text: string) {
  return text
    .replace(/^([^\n]+)\n([^\n]+)\n/m, '')
    .replace(/--- \t\n/g, '') // headers
    .replace(/\+\+\+ \t\n/g, '')
    .split('\n')
    .filter((x) => !x.includes('--- removed')) // Explanation
    .filter((x) => !x.includes('+++ added'))
    .filter((x) => !x.includes('@@ '))
    .filter((x) => !x.includes('No newline at end of file'))
    .join('\n')
    .replace(/\n+$/, '\n')
    .trim();
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
  };

  replace = function (this: PatternRegExp, str: string) {
    return this.matchers.reduce((acc, m, i) => {
      return acc.replace(`__arg${i}__`, `\${${m}}`);
    }, str);
  };

  diff = function (this: PatternRegExp, str: string) {
    const options = {
      comparator: (l: string, r: string) => this.compare(l, r),
    };

    const patch = createPatch('', this.pattern, str, '', '', options as any);
    return formatPatch(this.replace(patch));
  };
}

export function html(
  strings: TemplateStringsArray,
  ...args: any[]
): PatternRegExp {
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

export { html as dom };
