describe('test plugin:jssdk', () => {
  let task 
  before(function () {
    task = sdk.jssdk.signature({
      appid: 'wxe2aac4977ce6c0ad',
      jsApiList: ['uploadVoice'],
      openTagList: ['wx-open-launch-app']
    })
  });
  // sdk.cdn.res('default-avatar.png')
  it(`sdk.jssdk.signature`, (done) => {
    task.then(resp => {
      should(resp).is.equal(true)
      should(sdk.jssdk.config.appid).is.equal('wxe2aac4977ce6c0ad')
      should(sdk.jssdk.config.jsApiList).is.containDeep(['uploadVoice', 'closeWindow'])
      should(sdk.jssdk.config.openTagList).is.containDeep(['wx-open-launch-app'])
    }).then(done).catch(done)
  })
  it(`sdk.jssdk.share`, (done) => {
    sdk.jssdk.share({ title: 'HelloTitle' }).then(() => {
      const share = sdk.jssdk.share()
      should(share).is.Array()
      should(share[0].params.title).is.equal('HelloTitle')
      share[0].params.success.should.is.Function() // 分享回调函数
    }).then(done, done)
  })
})
