import { describe, test } from 'mocha'
import { expect } from 'chai'
import * as is from "./is";

interface TestStruct {
  func: string
  args: any[]
  expect(req: any): void
}

const functions: TestStruct[] = [
  {
    func: 'isArray',
    args: [[]],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isBoolean',
    args: [false],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isNull',
    args: [null],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isNullOrUndefined',
    args: [undefined],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isNumber',
    args: [100],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isString',
    args: ['ok'],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isSymbol',
    args: [Symbol('ok')],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isUndefined',
    args: [undefined],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isRegExp',
    args: [/\d/],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isObject',
    args: [{}],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isDate',
    args: ['20180909'],
    expect: val => expect(val).to.be.false
  },
  {
    func: 'isError',
    args: [new TypeError('err')],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isFunction',
    args: [() => {}],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isPrimitive',
    args: [100],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isHasOwn',
    args: [{a: 1}, 'a'],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isEmpty',
    args: [[]],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isHttp',
    args: ['http://ahmq.net'],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isBase64',
    args: ['data:image/jpg;base64,AEEE'],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isNative',
    args: [Math.round],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isWindow',
    args: ['window'],
    expect: val => expect(val).to.be.false
  },
  {
    func: 'isDocument',
    args: ['document'],
    expect: val => expect(val).to.be.false
  },
  {
    func: 'isPromise',
    args: [Promise.reject(0)],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'isFormData',
    args: ['FormData'],
    expect: val => expect(val).to.be.false
  },
  {
    func: 'isFile',
    args: ['file'],
    expect: val => expect(val).to.be.false
  },
  {
    func: 'isBlob',
    args: ['bolb'],
    expect: val => expect(val).to.be.false
  },
]

describe('functions/is',
  () => functions.map(
    item => test(item.func,
      () => item.expect(is[item.func](...item.args))
    )
  )
)