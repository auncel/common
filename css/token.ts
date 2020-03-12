import Reader from './Reader';

enum KeyChar {
  DOT = '.',
  AT = '@',
  HASH = '#',
  LEFTCURLYBRACES = '{',
  RIGHTCURLYBRACES = '}',
  COMMA = ',',
  SEMICOLON = ';',
  COLON = ':',
  SLASH = '/',
  ASTERISK = '*',
}

export enum TokenType {
  RightCrulyBracese = 'rightCrulyBracese',
  LeftCrulyBracese = 'leftCrulyBracese',
  AtRule = 'atRule',
  Selector = 'selector',
  Property = 'property',
  PropertyValue = 'propertyValue',
  Comment = 'comment',
}
// enum CharCode {
//   a = 97,
//   z = 122,
//   A = 65,
//   Z = 90,
//   dash = 45,
//   LeftParentheses = 40,
//   righParentheses = 41,
// }

export interface IToken {
  type: string;
  value: string;
}

function createToken(type: string, value: string): IToken {
  return { type, value };
}

export default class Token {
  private reader: Reader;

  constructor(cssContext) {
    this.reader = new Reader(cssContext);
  }

  isBeforeBlock() {
    let offset = 0;
    while (!this.reader.eof(offset)) {
      const char = this.reader.seek(offset);

      if (char === KeyChar.SEMICOLON
        || char === KeyChar.RIGHTCURLYBRACES) return false;

      if (char === KeyChar.LEFTCURLYBRACES) return true;

      offset++;
    }
    return false;
  }

  isComment() {
    const first = this.reader.peek();
    const second = this.reader.seek(1);
    return first === KeyChar.SLASH && second === KeyChar.ASTERISK;
  }

  isSpace(): boolean {
    return ' \t\n'.includes(this.reader.peek());
  }

  notLeftCurlyBraces(char: string): boolean {
    return char !== KeyChar.LEFTCURLYBRACES;
  }

  notBlockEnd(): boolean {
    return this.reader.peek() !== KeyChar.RIGHTCURLYBRACES;
  }

  notStatementEnd(): boolean {
    const char = this.reader.peek();
    return char !== KeyChar.SEMICOLON && char !== KeyChar.RIGHTCURLYBRACES;
  }

  notPropertyEnd(): boolean {
    const char = this.reader.peek();
    return char !== KeyChar.COLON && !this.isSpace();
  }


  notCommentEnd() {
    const last = this.reader.seek(2);
    const penultimate = this.reader.seek(1);
    return penultimate !== KeyChar.ASTERISK || last !== KeyChar.SLASH;
  }

  skipSpace() {
    while (!this.reader.eof() && this.isSpace()) {
      this.reader.next();
    }
  }

  readWhile(predicate: (char: string) => boolean) {
    const buff = [];
    while (!this.reader.eof() && predicate.call(this, this.reader.peek())) {
      buff.push(this.reader.next());
    }
    return buff.join('');
  }

  readRightCurlyBraces() {
    const rightCrulyBracse = this.reader.next();
    return createToken(TokenType.RightCrulyBracese, rightCrulyBracse);
  }

  readRLeftCurlyBraces() {
    const leftCrulyBracse = this.reader.next();
    return createToken(TokenType.LeftCrulyBracese, leftCrulyBracse);
  }
  readAtRule() {
    const ruleStr = this.readWhile(this.notLeftCurlyBraces);
    return createToken(TokenType.AtRule, ruleStr);
  }

  readSelector(): IToken {
    const selectorStr = this.readWhile(this.notLeftCurlyBraces);
    return createToken(TokenType.Selector, selectorStr);
  }

  readProperty(): IToken {
    const property = this.readWhile(this.notPropertyEnd);
    return createToken(TokenType.Property, property);
  }

  // FIXME: 对于最后一个属性值不能正常解析
  readPropertyValue() {
    this.reader.next(); // remove :
    const propertyValue = this.readWhile(this.notStatementEnd);
    if (this.reader.peek() === KeyChar.SEMICOLON) this.reader.next(); // remove ;
    return createToken(TokenType.PropertyValue, propertyValue);
  }
  readComment() {
    this.reader.next(); // remove /
    this.reader.next(); // remove *
    const comment = this.readWhile(this.notCommentEnd);
    this.reader.next(); // remove *
    this.reader.next(); // remove /
    return createToken(TokenType.Comment, comment);
  }
  readBlock() {
    while (this.notBlockEnd()) {
      this.skipSpace();
      const char = this.reader.peek();

      switch (char) {
        case KeyChar.SEMICOLON:
        case KeyChar.LEFTCURLYBRACES: {
          this.reader.next();
          break;
        }
        case KeyChar.COLON: {
          this.skipSpace();
          this.readPropertyValue();
        }
        case KeyChar.SEMICOLON: {
          break;
        }
        default: {
          this.skipSpace();
          this.readProperty();
        }
      }
    }
    return createToken('block', 'void');
  }

  public readNext(): IToken {
    this.skipSpace();

    if (this.reader.eof()) return null;
    const char = this.reader.peek();

    if (char === KeyChar.AT) {
      return this.readAtRule();
    } else if (char === KeyChar.LEFTCURLYBRACES) {
      return this.readRLeftCurlyBraces();
    } else if (char === KeyChar.RIGHTCURLYBRACES) {
      return this.readRightCurlyBraces();
    } else if (this.isBeforeBlock()) {
      return this.readSelector();
    } else if (char === KeyChar.COLON) {
      return this.readPropertyValue();
    } else if (this.isComment()) {
      return this.readComment();
    }
    return this.readProperty();
  }
}
