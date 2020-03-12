/* --------------------------------------------------------------------------*
 * Description:                                                              *
 *                                                                           *
 * File Created: Friday, 20th December 2019 10:03 pm                         *
 * Author: yidafu(dov-yih) (me@yidafu.dev)                                   *
 *                                                                           *
 * Last Modified: Friday, 20th December 2019 10:03 pm                        *
 * Modified By: yidafu(dov-yih) (me@yidafu.dev>)                             *
 *                                                                           *
 * Copyright 2019 - 2019 Mozilla Public License 2.0                          *
 *-------------------------------------------------------------------------- */


import './toJSON';

describe('Map to JSON', () => {
  test('Map only', () => {
    const map = new Map<string, string>([
      ['key-a', 'value-a'],
      ['key-b', 'value-b'],
    ]);
    const jsonStr = JSON.stringify(map);
    expect(jsonStr).toBe('{"key-a":"value-a","key-b":"value-b"}');
  });

  test('Map as value', () => {
    const map = new Map<string, string>([
      ['key-a', 'value-a'],
      ['key-b', 'value-b'],
    ]);
    const jsonStr = JSON.stringify({key: map});
    expect(jsonStr).toBe('{"key":{"key-a":"value-a","key-b":"value-b"}}');
  });

  
  test('nest Map', () => {
    const map = new Map<string, Map<string, string>>([
      ['key-a', new Map([['key-b', 'value-b']])],
    ]);
    const jsonStr = JSON.stringify({key: map});
    expect(jsonStr).toBe('{"key":{"key-a":{"key-b":"value-b"}}}');
  });
});


describe('Set to JSON', () => {
  test('Set only', () => {
    const set = new Set<string>(['aa', 'bb']);
    const jsonStr = JSON.stringify(set);
    expect(jsonStr).toBe('["aa","bb"]');
  });

  test('Set as value', () => {
    const set = new Set<string>(['aa', 'bb']);
    const jsonStr = JSON.stringify({key: set});
    expect(jsonStr).toBe('{"key":["aa","bb"]}');
  });

  test('nest Set', () => {
    const set = new Set<Set<string>>([new Set(['aa', 'bb']), new Set(['CC'])]);
    const jsonStr = JSON.stringify(set);
    expect(jsonStr).toBe('[["aa","bb"],["CC"]]');
  });
});