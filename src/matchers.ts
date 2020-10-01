import { clean } from './lib/util';

function escape(source: RegExp | string) {
  if (source instanceof RegExp) return source.source;
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export class PatternRegExp extends RegExp {
  constructor(
    source: string,
    public readonly pattern: string,
    public readonly template: RegExp,
    public readonly matchers: any[]
  ) {
    super(source);
  }

  rec = function (this: PatternRegExp, b: string) {
    let pattern = this.pattern;
    const m = b.match(this.template);
    if (m) {
      m.shift();
      m.forEach((v, i) => {
        const s = this.matchers[i];
        const r = new RegExp(`^${s}$`);
        pattern = pattern.replace(`__arg${i}__`, r.test(v) ? v : `\${/${s}/}`);
      });
    }
    return pattern;
  };
}

export function html(strings: TemplateStringsArray, ...args: any[]): PatternRegExp {
  const result = [strings[0]];
  args.forEach((arg, i) => {
    result.push(`__arg${i}__`, strings[i + 1]);
  });
  const pattern = clean(result.join(''));
  let source = escape(pattern);
  let s0 = source;
  const matchers = args.map((arg, i) => {
    source = source.replace(`__arg${i}__`, escape(arg));
    s0 = s0.replace(`__arg${i}__`, '(.*)');
    return arg.source || arg;
  });
  return new PatternRegExp(`^${source}$`, pattern, new RegExp(s0), matchers);
}
