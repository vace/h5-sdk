describe('test factory Res', () => {
  var res = new sdk.Res({ baseURL: 'api/', autoStart: true })

  it('res 配置检测', () => {
    res.baseURL.should.is.equal('api/')
  })

  it('res.on() 可以监听到各种事件', done => {
    const unbind = res.on('complete', progress => {
      should(progress.isComplete).is.equal(true)
      done()
      unbind()
    })
    res.add('../logo.png')
  })

  it('res.add(img) 需要返回promise', () => should(res.add('../logo.png')).be.a.Promise())
  it('res.start() 执行后将会被加载', done => {
    res.add('../logo.png').then(() => done())
  })
  it('res.add(path) 执行后将会返回img元素', done => {
    res.add('../logo.png').then((img) => {
      should(img).is.instanceof(Image)
      done()
    })
  })
  it('res.json(file) 执行后会返回json内容', done => {
    res.json('pack.json').then((json) => {
      should(json).have.keys('name', 'version', 'description')
      done()
    })
  })
  it('res.add(err).catch(err) 执行后会捕获错误详情', done => {
    res.add({ type: 'err', url: 'err' }).catch((err) => {
      should(err).is.a.Error()
      done()
    })
  })

  it('res.add([res1, res2, ..., res3]) 之后后会返回多个资源', done => {
    res.add([
      'pack.json',
      '../logo.png',
      { type: 'text', key: 'keytest', url: 'text.txt' },
      { type: 'js', url: 'javascript.js' },
      { type: 'css', url: 'css.css' },
      { type: 'blob', url: 'blob' },
      // remote
      'http://h5.ahmq.net/default-avatar.png',
    ]).then(list => {
      should(list).is.a.Array()
      should(list.length).is.equal(7)
      // 可以通过key直接读取内容
      should(res.get('keytest')).is.a.String()
      done()
      // console.log('res', list)
    })
  })
})

describe('test factory App', () => {
  var app
  before(function () {
    app = new sdk.App('apr79oyug6')
  });

  it('app.ready 返回 Promise', () => {
    const ready = app.ready()
    should(ready).be.a.Promise()
  })

  it('app.ready().then(app) 可接收到应用配置', (done) => {
    app.ready().then(app => {
      app.config.should.has.property('appid')
      done()
    }).catch(done)
  })

  it('app config check', () => {
    app.appid.should.is.equal('apr79oyug6')
  })

  it('app 访问 GET:Test.succ', (done) => {
    app.get('Test.succ', { name: 'vace' }).then((succ) => {
      should(succ).has.property('name')
      should(succ.name).is.equal('vace')
      done()
    }, done)
  })
  it('app 访问 GET:Test.succ 参数调整', (done) => {
    app.get({
      api: 'Test.succ',
      query: { name: 'vace' }
    }).then((succ) => {
      should(succ).has.property('name')
      should(succ.name).is.equal('vace')
      done()
    }, done)
  })
  it('app 访问 GET:Test.error 返回可捕获错误', (done) => {
    app.get('Test.err', { name: 'vace' }).catch((err) => {
      should(err.code).is.equal(-1)
      // 返回数据
      should(err.data.name).is.equal('vace')
      done()
    })
  })
  it('app 支持绝对路径访问', (done) => {
    app.get('/api/developer/httpbin', { name: 'vace' }).then((succ) => {
      should(succ).has.property('get')
      should(succ.get.name).is.equal('vace')
      done()
    }).catch(done)
  })

  it('app 支持signal参数以取消请求', (done) => {
    const controller = new AbortController()
    app.get({
      api: 'Test.succ',
      signal: controller.signal,
      query: { name: 'vace' }
    }).catch(err => {
      should(err).instanceOf(DOMException)
      done()
    })
    sdk.wait(5).then(() => controller.abort())
  })
})

describe('test factory Http', () => {
  const HTTP_BIN = 'https://api.ahmq.net/api/developer/httpbin'
  var http
  before(() => {
    http = new sdk.Http({
      baseURL: 'api/'
    })
  })
  it('http config check', () => {
    http.httpconfig.baseURL.should.is.equal('api/')
  })
  it('http request test', (done) => {
    http.get('pack.json').then(json => {
      should(json).have.keys('name', 'version', 'description')
      done()
    })
  })
  it('http request get', (done) => {
    http.get(HTTP_BIN, { getarg: 'test' }).then(reponse => {
      should(reponse.data.method).is.equal('GET')
      should(reponse.data.get.getarg).is.equal('test')
      done()
    }).catch(done)
  })
  it('http request post', (done) => {
    http.post(HTTP_BIN, { getarg: 'test' }).then(reponse => {
      should(reponse.data.method).is.equal('POST')
      should(reponse.data.post.getarg).is.equal('test')
      done()
    }).catch(done)
  })
  it('http request put', (done) => {
    http.put(HTTP_BIN, { getarg: 'test' }).then(reponse => {
      should(reponse.data.method).is.equal('PUT')
      should(reponse.data.post.getarg).is.equal('test')
      done()
    }).catch(done)
  })
  it('http request delete', (done) => {
    http.delete(HTTP_BIN, { getarg: 'delete' }).then(reponse => {
      should(reponse.data.method).is.equal('DELETE')
      should(reponse.data.get.getarg).is.equal('delete')
      done()
    }).catch(done)
  })
  it('http request patch', (done) => {
    http.patch(HTTP_BIN, { getarg: 'patch' }).then(reponse => {
      should(reponse.data.method).is.equal('PATCH')
      should(reponse.data.put.getarg).is.equal('patch')
      done()
    }).catch(done)
  })
  it('http request head', (done) => {
    http.head(HTTP_BIN, { getarg: 'head' }).then(reponse => {
      should(reponse.type).is.equal('cors')
      done()
    }).catch(done)
  })
  it('http request options', (done) => {
    http.options(HTTP_BIN, { getarg: 'options' }).then(reponse => {
      should(reponse.type).is.equal('cors')
      done()
    }).catch(done)
  })
  
  it('http request jsonp', (done) => {
    http.jsonp(HTTP_BIN, { getarg: 'test' }).then(reponse => {
      should(reponse.method).is.equal('GET')
      should(reponse.get.getarg).is.equal('test')
      done()
    }).catch(done)
  })

  it('http request jsonp', (done) => {
    http.jsonp({
      url: HTTP_BIN,
      query: { getarg: 'test' },
      showLoading: '加载中...',
      showError: true,
      showSuccess: '请求成功'
    }).then(reponse => {
      should(reponse.method).is.equal('GET')
      should(reponse.get.getarg).is.equal('test')
      done()
    }).catch(done)
  })

  it('http request abort signal', (done) => {
    const controller = new AbortController()
    http.get({
      url: HTTP_BIN,
      query: { getarg: 'test' },
      signal: controller.signal
    }).catch(err => {
      should(err).instanceOf(DOMException)
      done()
    })
    sdk.wait(5).then(() => controller.abort())
  })
})

describe('test factory Auth', () => {
  var auth, authhttp
  before(() => {
    sdk.Config.API_AUTH = 'https://api2.ahmq.net/'
    auth = new sdk.Auth({
      appid: 'wxe2aac4977ce6c0ad',
      platform: 'open',
      scope: 'snsapi_userinfo',
      type: 'user',
      env: ''
    })
    auth.login()
    authhttp = new sdk.Http({
      auth,
      baseURL: 'https://api2.ahmq.net/index/'
    })
    console.log(authhttp)
  })
  it('auth config check', () => {
    should(auth.appid).is.equal('wxe2aac4977ce6c0ad')
  })
  it('sdk.auth has instance', () => {
    should(sdk.auth && sdk.auth.appid).is.equal('wxe2aac4977ce6c0ad')
  })
  it('auth.user has appid', () => {
    should(sdk.user && sdk.user.appid).is.equal('wxe2aac4977ce6c0ad')
  })

  it('authhttp has user', () => {
    should(authhttp.auth).is.equal(auth)
  })

  it('authhttp send request', (done) => {
    authhttp.get('index').then(rep => {
      done()
    })
  })
})
