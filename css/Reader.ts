export default class Reader {
  private text: string;
  private idx = 0;
  private line = 0;
  private col = 0;

  constructor(text) {
    this.text = text || '';
  }

  next() {
    const char = this.text.charAt(this.idx++);
    if (char === '\n') {
      this.line += 1;
      this.col = 0;
    } else {
      this.col += 1;
    }
    return char;
  }

  peek() {
    return this.text.charAt(this.idx);
  }

  seek(offset: number): string {
    return this.text.charAt(this.idx + offset);
  }

  eof(offset = 0): boolean {
    return this.seek(offset) === '';
  }
}
