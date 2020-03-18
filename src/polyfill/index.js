/**
 * @function
 * @name Object.assign
 * @desc es5 `Object.assign` polyfill
 * @see {@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign|Document}
 */
import 'es6-object-assign/auto'

/**
 * @class
 * @name Promise
 * @classdesc es6 `Promise` polyfill
 * @see {@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise|Document}
 */
import 'es6-promise/auto'

/**
 * @function
 * @name fetch
 * @desc `window.fetch` polyfill
 * @see {@link https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API|Fetch_API}
 */
import 'whatwg-fetch'

// import './jweixin'

import './es6-array.js'

import './es6-collections.js'

// 修复 requestAnimationFrame
// import './raf.js'

// jweixin
import './jweixin-1.5.0'
