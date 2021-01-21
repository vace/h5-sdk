// import should from "demo/static/should"

describe('test function', () => {
  it('sdk.noop()', () => should(sdk.noop()).is.equal(undefined))
  it('sdk.always(1)', () => should(sdk.always(1)).is.equal(1))
  it('sdk.assign({}, {a: 1})', () => should(sdk.assign({}, { a: 1 })).deepEqual({a: 1}))
  it('sdk.keys({a: 1})', () => should(sdk.keys({ a: 1 })).deepEqual(['a']))

  it('sdk.isArray([])', () => should(sdk.isArray([])).is.equal(true))
  it('sdk.isNaN(NaN)', () => should(sdk.isNaN(NaN)).is.equal(true))
  it('sdk.isNumber(100)', () => should(sdk.isNumber(100)).is.equal(true))
  it('sdk.isString(`hello`)', () => should(sdk.isString(`hello`)).is.equal(true))
  it('sdk.isBoolean(false)', () => should(sdk.isBoolean(false)).is.equal(true))
  it('sdk.isArguments([])', () => should(sdk.isArguments([])).is.equal(false))
  it('sdk.isMap(new Map())', () => should(sdk.isMap(new Map())).is.equal(true))
  it('sdk.isError(new Error)', () => should(sdk.isError(new Error)).is.equal(true))
  it('sdk.isSet(new Set)', () => should(sdk.isSet(new Set)).is.equal(true))
  it('sdk.isRegExp(/is/)', () => should(sdk.isRegExp(/is/)).is.equal(true))
  it('sdk.isSymbol(Symbol())', () => should(sdk.isSymbol(Symbol())).is.equal(true))
  it('sdk.isDate(new Date())', () => should(sdk.isDate(new Date())).is.equal(true))
  it('sdk.isFile(new File)', () => should(sdk.isFile(new File([], 'd'))).is.equal(true))
  it('sdk.isBlob(new Blob)', () => should(sdk.isBlob(new Blob([]))).is.equal(true))
  
  it('sdk.isObject({})', () => should(sdk.isObject({})).is.equal(true))
  it('sdk.isHasOwn({a: 1}, "a")', () => should(sdk.isHasOwn({ a: 1 }, 'a')).is.equal(true))
  it('sdk.isFunction(sdk.noop)', () => should(sdk.isFunction(sdk.noop)).is.equal(true))
  it('sdk.isNull(null)', () => should(sdk.isNull(null)).is.equal(true))
  it('sdk.isUndefined(undefined)', () => should(sdk.isUndefined(undefined)).is.equal(true))
  it('sdk.isNullOrUndefined(void 0)', () => should(sdk.isNullOrUndefined(void 0)).is.equal(true))
  it('sdk.isDef(false)', () => should(sdk.isDef(false)).is.equal(true))
  it('sdk.isPlainObject({})', () => should(sdk.isPlainObject({})).is.equal(true))
  it('sdk.isAbsolute("/a")', () => should(sdk.isAbsolute('/a')).is.equal(true))
  it('sdk.isHttp("http://a.com")', () => should(sdk.isHttp("http://a.com")).is.equal(true))
  it('sdk.isPromise(new Promise(() => {}))', () => should(sdk.isPromise(new Promise(() => {}))).is.equal(true))
  it('sdk.isEmpty([])', () => should(sdk.isEmpty([])).is.equal(true))
  it('sdk.isEmpty({})', () => should(sdk.isEmpty({})).is.equal(true))
  it('sdk.isEmpty("")', () => should(sdk.isEmpty("")).is.equal(true))
  it('sdk.isBase64("data:image/svg;base64,AA")', () => should(sdk.isBase64("data:image/svg;base64,AA")).is.equal(true))
  it('sdk.isNative(encodeURI)', () => should(sdk.isNative(encodeURI)).is.equal(true))
  it('sdk.isWindow(window)', () => should(sdk.isWindow(window)).is.equal(true))
  it('sdk.isDocument(document)', () => should(sdk.isDocument(document)).is.equal(true))
  it('sdk.isFormData(new FormData)', () => should(sdk.isFormData(new FormData)).is.equal(true))
  it(`sdk.isNumeric('1.01')`, () => sdk.isNumeric('1.01').should.is.equal(true))
  it(`sdk.isNumeric('1.01x')`, () => sdk.isNumeric('1.01x').should.is.equal(false))
  it(`sdk.isNumeric('-0.88e')`, () => sdk.isNumeric('-0.88e').should.is.equal(false))
  it(`sdk.isNumeric('-0.88e1')`, () => sdk.isNumeric('-0.88e1').should.is.equal(true)) // 科学记数法


  it('sdk.range(6, 1, 5)', () => should(sdk.range(6, 1, 5)).is.equal(5))
  it('sdk.range(0, 1, 5)', () => should(sdk.range(0, 1, 5)).is.equal(1))
  it('sdk.range(2, 1, 5)', () => should(sdk.range(2, 1, 5)).is.equal(2))
  it('sdk.random(2, 2)', () => should(sdk.random(2, 2)).is.equal(2))
  it('sdk.random(2, 10)', () => should(sdk.random(2, 10)).is.greaterThan(1))

  it(`sdk.uid('prefix')`, () => sdk.uid('prefix').should.match(/^prefix\d+/))
  it(`sdk.uuid()`, () => sdk.uuid().should.match(/^.{8}-.{4}-.{4}-.{4}-.{12}$/))
  it(`sdk.randomstr(8)`, () => sdk.randomstr(8).should.have.length(8))
  it(`sdk.stringify({a: 1, b: 2})`, () => sdk.stringify({ a: 1, b: 2 }).should.equal('a=1&b=2'))
  it(`sdk.parse('a=1&b=2')`, () => sdk.parse('a=1&b=2').should.eql({a: '1', b: '2'}))
  it(`sdk.camelize('padding-left-top')`, () => sdk.camelize('padding-left-top').should.is.equal('paddingLeftTop'))
  it(`sdk.createURL('http://a.com', {key: 1})`, () => sdk.createURL('http://a.com', {key: 1}).should.is.equal('http://a.com?key=1'))
  it(`sdk.createURL('http://a.com?p=2', {key: 1})`, () => sdk.createURL('http://a.com?p=2', { key: 1 }).should.is.equal('http://a.com?p=2&key=1'))
  it(`sdk.createURL('http://a.com?p=2', 'key=1')`, () => sdk.createURL('http://a.com?p=2', 'key=1').should.is.equal('http://a.com?p=2&key=1'))
  it(`sdk.trim('  a b ')`, () => sdk.trim('  a b ').should.is.equal('a b'))
  it(`sdk.filterURL('http://a.com?p=2', ['p'])`, () => sdk.filterURL('http://a.com?p=2', ['p']).should.is.equal('http://a.com'))
  it(`sdk.filterURL('http://a.com?p=2&q=3', ['p'])`, () => sdk.filterURL('http://a.com?p=2&q=3', ['p']).should.is.equal('http://a.com?q=3'))
  it(`sdk.classnames('a', 'b')`, () => sdk.classnames('a', 'b').should.is.equal('a b'))
  it(`sdk.classnames({a: 1}, {b: 0})`, () => sdk.classnames({a: 1}, {b: 0}).should.is.equal('a'))
  it(`sdk.classnames({a: true, b: false}, 'c', ['d', 'e'])`, () => sdk.classnames({a: true, b: false}, 'c', ['d', 'e']).should.is.equal('a c d e'))
  it(`sdk.styles({zIndex: 1, left: 10})`, () => sdk.styles({zIndex: 1, left: 10}).should.is.equal('z-index:1;left:10px'))
  it(`sdk.styles(['zIndex', 1])`, () => sdk.styles(['zIndex', 1]).should.is.equal('z-index:1'))
  it(`sdk.styles({zIndex: 1, left: 10}, ['top', 10], 'bottom:0')`, () => sdk.styles({ zIndex: 1, left: 10 }, ['top', 10], 'bottom:0').should.is.equal('z-index:1;left:10px;top:10px;bottom:0'))
  it(`sdk.css('zIndex', 1)`, () => sdk.css('zIndex', 1).should.is.equal('z-index:1'))

  it(`sdk.getLength([1, 2])`, () => sdk.getLength([1, 2]).should.is.equal(2))
  it(`sdk.remove([1, 2, 3, 4], (v) => v % 2)`, () => sdk.remove([1, 2, 3, 4], (v) => v % 2).should.is.eql([1, 3]))
  it(`sdk.inArray(3, [1, 2, 3])`, () => sdk.inArray(3, [1, 2, 3]).should.is.equal(true))
  it(`sdk.uniqueArray([1, 2, 3, 1, 2, 3])`, () => sdk.uniqueArray([1, 2, 3, 1, 2, 3]).should.is.eql([1, 2, 3]))
  it(`sdk.map([1, 2, 3], v => v * 2)`, () => sdk.map([1, 2, 3], v => v * 2).should.is.eql([2, 4, 6]))
  it(`sdk.map({a: 1, b: 2, c: 3}, (v, k) => k + '=' + v)`, () => sdk.map({a: 1, b: 2, c: 3}, (v, k) => k + '=' + v).should.is.eql(['a=1', 'b=2', 'c=3']))
  it(`sdk.shuffle([1, 2, 3])`, () => sdk.shuffle([1, 2, 3]).should.is.containDeep([1, 2, 3]))
  it(`sdk.pick({a: 1, b: 2}, ['a'])`, () => should(sdk.pick({ a: 1, b: 2 }, ['a'])).have.property('a').not.property('b'))
  it(`sdk.compact([0,1,2,3, undefined, null, false, '', NaN])`, () => should(sdk.compact([0, 1, 2, 3, undefined, null, false, '', NaN])).eql([1, 2, 3]))
  it(`sdk.pluck([{name: 'Tom'}, {name: 'Peter'}], 'name')`, () => should(sdk.pluck([{ name: 'Tom' }, { name: 'Peter' }], 'name')).eql(['Tom', 'Peter']))

  it(`sdk.groupBy([{name: 'vace', num: 2}, {name: 'Ppp', num: 5}, {name: 'vace', num: 3}], val => val.name)`, () => {
    const group = sdk.groupBy([{ name: 'vace', num: 2 }, { name: 'Ppp', num: 5 }, { name: 'vace', num: 3 }], val => val.name)
    should(group.vace).length(2)
    should(group.Ppp).length(1)
  })
  it(`sdk.indexBy([{name: 'vace', num: 2}, {name: 'Ppp', num: 5}, {name: 'vace', num: 3}], val => val.name)`, () => {
    const index = sdk.indexBy([{ name: 'vace', num: 2 }, { name: 'Ppp', num: 5 }, { name: 'vace', num: 3 }], val => val.name)
    should(index.vace.name).eql('vace')
    should(index.Ppp.name).eql('Ppp')
  })

  it(`sdk.makeMark(['a', 'b', 'c'])`, () => {
    var mark = sdk.makeMark(['a', 'b', 'c'])
    should(mark.a).is.equal(true)
    should(mark.b).is.equal(true)
    should(mark.c).is.equal(true)
  })
  it(`sdk.makeMap(['a', 'b', 'c'])`, () => {
    var mark = sdk.makeMap(['a', 'b', 'c'])
    should(mark.a).is.equal('a')
    should(mark.b).is.equal('b')
    should(mark.c).is.equal('c')
  })
  
  it(`sdk.once(() => uuid++)`, () => {
    let uuid = 100
    const once = sdk.once(() => uuid++)
    once().should.is.equal(100)
    once().should.is.equal(100)
  })

  it(`sdk.before(3, () => uuid++)`, () => {
    let uuid = 100
    const fn = sdk.before(3, () => uuid++)
    fn().should.is.equal(100) // run once
    fn().should.is.equal(101) // run twice
    fn().should.is.equal(101) // return twice result
    fn().should.is.equal(101)
  })

  it(`sdk.after(3, () => uuid++)`, () => {
    let uuid = 100
    const fn = sdk.after(3, () => uuid++)
    should(fn()).is.equal(undefined) // run once
    should(fn()).is.equal(undefined) // run twice
    fn().should.is.equal(100) // start exec return result
    fn().should.is.equal(101) // exec
  })
  
  it(`sdk.throttle(() => 'ok', time)`, (done) => {
    let uuid = 100
    const fn = sdk.throttle(() => uuid++, 100)
    for (var i = 0; i < 10; i++) fn()
    should(fn()).is.equal(100)
    setTimeout(() => {
      should(fn()).is.equal(102)
      done()
    }, 300)
  })

  it(`sdk.debounce(() => 'ok', time)`, (done) => {
    let uuid = 100
    const fn = sdk.debounce(() => uuid++, 100)
    for (var i = 0; i < 10; i++) fn()
    should(fn()).is.equal(undefined)
    setTimeout(() => {
      should(fn()).is.equal(100)
      done()
    }, 300)
  })
  it(`sdk.memoize((key) => val)`, () => {
    let uuid = 100
    const refn = sdk.memoize(key => {
      return key + ' cached:' + uuid++
    })
    refn('key1').should.is.equal('key1 cached:100')
    refn('key1').should.is.equal('key1 cached:100')
    refn('key1').should.is.equal('key1 cached:100')
    refn('key2').should.is.equal('key2 cached:101')
  })
  it(`sdk.spread(() => {})`, () => {
    const rust = sdk.spread((a, b, c) => {
      should(a).is.equal(1)
      should(b).is.equal(2)
      should(c).is.equal(3)
    })
    rust([1, 2, 3, 4])
  })
  it(`sdk.toFunction(null)('hello')`, () => should(sdk.toFunction(null)('hello')).is.undefined())
  it(`sdk.toFunction(sdk.always)('hello')`, () => should(sdk.toFunction(sdk.always)('hello')).is.equal('hello'))
  it(`sdk.nextTick() is Promise`, () => should(sdk.nextTick()).is.Promise())
  it(`sdk.nextTick(fn) callnext`, (done) => sdk.nextTick(done))

  it(`sdk.unixtime()`, () => sdk.unixtime().should.is.equal(sdk.unixtime(Date.now() / 1000)))
  it(`sdk.timestamp()`, () => sdk.timestamp().should.is.equal(sdk.timestamp(Date.now())))
  it(`sdk.timeago()`, () => sdk.timeago().should.is.equal('刚刚'))
  it(`sdk.wait(200, 'test')`, (done) => {
    const task = sdk.wait(200, 'test')
    task.should.be.a.Promise()
    task.then((arg) => {
      should(arg).is.equal('test')
      done()
    })
  })
  it(`sdk.splitPath('/path/to/file.png')`, () => {
    const [abs, path, file, ext] = sdk.splitPath('/path/to/file.png')
    should(abs).is.equal('/')
    should(path).is.equal('path/to/')
    should(file).is.equal('file.png')
    should(ext).is.equal('.png')
  })
  it(`sdk.resolvePath('../../', 'a/b/c.png')`, () => sdk.resolvePath('/../../', 'a/b/c.png').should.is.equal('/a/b/c.png'))
  it(`sdk.dirname('a/b/c.png')`, () => sdk.dirname('a/b/c.png').should.is.equal('a/b'))
  it(`sdk.extname('a/b/c.png')`, () => sdk.extname('a/b/c.png').should.is.equal('.png'))
  it(`sdk.basename('a/b/c.png')`, () => sdk.basename('a/b/c.png').should.is.equal('c.png'))
  // it(`sdk.FUNCTION(PARAM)`, () => sdk.FUNCTION(PARAM).should.is.equal(true))
  // it(`sdk.FUNCTION(PARAM)`, () => sdk.FUNCTION(PARAM).should.is.equal(true))
  // it(`sdk.FUNCTION(PARAM)`, () => sdk.FUNCTION(PARAM).should.is.equal(true))
  // it(`sdk.FUNCTION(PARAM)`, () => sdk.FUNCTION(PARAM).should.is.equal(true))


  // template
  // it(`sdk.FUNCTION(PARAM)`, () => sdk.FUNCTION(PARAM).should.is.equal(true))
})
