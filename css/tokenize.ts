import Token, { IToken } from './token';

export function tokenize(str): IToken[] {
  const tokens = [];
  const token = new Token(str);
  let t: IToken;
  while (t = token.readNext()) {
    tokens.push(t);
  }
  return tokens;
}

export { TokenType } from './token';
export default tokenize;
