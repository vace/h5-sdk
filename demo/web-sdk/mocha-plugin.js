describe('test plugin:cdn', () => {
  // sdk.cdn.res('default-avatar.png')
  it(`sdk.cdn.res('default-avatar.png')`, () => {
    should(sdk.cdn.res('default-avatar.png')).is.equal('https://h5.ahmq.net/default-avatar.png')
  })

  it(`sdk.cdn.hue('default-avatar.png')计算平均色调`, (done) => {
    sdk.cdn.hue('default-avatar.png').then((res) => {
      should(res.RGB).is.equal('0xececec')
      done()
    })
  })
  
  it(`sdk.cdn.info('default-avatar.png')获取基本信息`, (done) => {
    sdk.cdn.info('default-avatar.png').then((res) => {
      should(res.FileSize.value).is.equal('9609')
      should(res.Format.value).is.equal('png')
      should(res.ImageHeight.value).is.equal('384')
      should(res.ImageWidth.value).is.equal('384')
      done()
    })
  })
})
