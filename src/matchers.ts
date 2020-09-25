import { getDiffableHTML } from '@open-wc/semantic-dom-diff';
import beautify from 'js-beautify';

export const enum MatcherType {
  String = 'string',
  HTML = 'html',
  JSON = 'json',
  Text = 'text'
}

export class Matcher {
  public readonly re: RegExp;
  public readonly source: string;

  constructor(public readonly type: MatcherType, source: RegExp | string) {
    this.source = (source instanceof RegExp) ? source.source : source;
    this.re = new RegExp(`^${source}$`);
  }
}

function escape(source: RegExp | string) {
  if (source instanceof RegExp) return source.source;
  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function str(strings: TemplateStringsArray, ...args: any[]): Matcher {
  const result = [escape(strings[0])];
  args.forEach((arg, i) => {
    result.push(escape(arg), escape(strings[i + 1]));
  });
  return new Matcher(MatcherType.String, result.join(''));
}

export function html(strings: TemplateStringsArray, ...args: any[]): Matcher {
  const result = [strings[0]];
  args.forEach((arg, i) => {
    result.push(`__arg${i}__`, strings[i + 1]);
  });
  let html = escape(getDiffableHTML(result.join('')));
  args.forEach((arg, i) => {
    html = html.replace(`__arg${i}__`, escape(arg));
  });
  return new Matcher(MatcherType.HTML, html);
}

export function json(strings: TemplateStringsArray, ...args: any[]): Matcher {
  const result = [strings[0]];
  args.forEach((arg, i) => {
    result.push(`__arg${i}__`, strings[i + 1]);
  });
  let json = escape(beautify.js(result.join('')));
  args.forEach((arg, i) => {
    json = json.replace(`__arg${i}__`, escape(arg));
  });
  return new Matcher(MatcherType.JSON, json);
}