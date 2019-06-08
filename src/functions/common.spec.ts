import { describe, test } from 'mocha'
import { expect } from 'chai'
import * as common from "./common";

interface TestStruct {
  func: string
  args: any[]
  expect (req: any): void
}

const functions: TestStruct[] = [
  {
    func: 'camelize',
    args: ['padding-left'],
    expect: val => expect(val).to.be.eq('paddingLeft')
  },
  {
    func: 'alway',
    args: ['val'],
    expect: val => expect(val).to.be.eq('val')
  },
  {
    func: 'dasherize',
    args: ['paddingLeft'],
    expect: val => expect(val).to.be.eq('padding-left')
  },
  {
    func: 'uid',
    args: ['prefix'],
    expect: val => expect(val).to.be.eq('prefix1')
  },
  {
    func: 'uuid',
    args: [],
    expect: val => expect(val).have.lengthOf(36)
  },
  {
    func: 'randomstr',
    args: [8],
    expect: val => expect(val).have.lengthOf(8)
  }
]

describe('functions/common', 
  () => functions.map(
    item => test(item.func, 
      () => item.expect(common[item.func](...item.args))
    )
  )
)