import { describe, test } from 'mocha'
import { expect } from 'chai'
import * as qs from "./qs";

interface TestStruct {
  func: string
  args: any[]
  expect(req: any): void
}

const functions: TestStruct[] = [
  {
    func: 'stringify',
    args: [{a: 1, b: 2}],
    expect: val => expect(val).to.be.eq('a=1&b=2')
  },
  {
    func: 'stringify',
    args: [{ a: 1, arr: ['a', 'b'] }],
    expect: val => expect(val).to.be.eq('a=1&arr=%5B%22a%22%2C%22b%22%5D')
  },
  {
    func: 'parse',
    args: ['a=1&b=2'],
    expect: val => expect(val).to.be.include({a: "1", b: "2"})
  },
  {
    func: 'parse',
    args: ['a=1&arr=%5B%22a%22%2C%22b%22%5D'],
    expect: val => expect(val).to.be.include({a: "1"})
  }
]

describe('functions/path',
  () => functions.map(
    item => test(item.func,
      () => item.expect(qs[item.func](...item.args))
    )
  )
)