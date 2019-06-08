import { describe, test } from 'mocha'
import { expect } from 'chai'
import * as path from "./path";

interface TestStruct {
  func: string
  args: any[]
  expect(req: any): void
}

const functions: TestStruct[] = [
  {
    func: 'isAbsolute',
    args: ['/c/d/e'],
    expect: val => expect(val).to.be.true
  },
  {
    func: 'resolvePath',
    args: ['a', 'b', 'c'],
    expect: val => expect(val).to.be.eq('/a/b/c')
  },
  {
    func: 'dirname',
    args: ['a/b/c.txt'],
    expect: val => expect(val).to.be.eq('a/b')
  },
  {
    func: 'basename',
    args: ['a/b/c/d.txt'],
    expect: val => expect(val).to.be.eq('d.txt')
  },
  {
    func: 'basename',
    args: ['a/b/c/d.txt', '.txt'],
    expect: val => expect(val).to.be.eq('d')
  },
  {
    func: 'extname',
    args: ['a/b/c/d.txt'],
    expect: val => expect(val).to.be.eq('.txt')
  }
]

describe('functions/path',
  () => functions.map(
    item => test(item.func,
      () => item.expect(path[item.func](...item.args))
    )
  )
)