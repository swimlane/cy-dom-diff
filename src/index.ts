import { chaiDomMatch } from './assertion';
import './commands';

chai.use(chaiDomMatch);

export * from './regexps';
export * from './matchers';
