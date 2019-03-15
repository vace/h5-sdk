/*!==============================@preserve==================================
 * Version: v3.0.0
 * Create: 2019-3-15 00:34:00
 * Author: Vace(ocdo@qq.com)
 * ======================================================================== */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.sdk = {}));
}(this, function (exports) { 'use strict';

  /**
   * Code refactored from Mozilla Developer Network:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   */

  function assign(target, firstSource) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  }

  function polyfill() {
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: assign
      });
    }
  }

  var es6ObjectAssign = {
    assign: assign,
    polyfill: polyfill
  };
  var es6ObjectAssign_1 = es6ObjectAssign.assign;
  var es6ObjectAssign_2 = es6ObjectAssign.polyfill;

  var es6ObjectAssign$1 = /*#__PURE__*/Object.freeze({
    default: es6ObjectAssign,
    __moduleExports: es6ObjectAssign,
    assign: es6ObjectAssign_1,
    polyfill: es6ObjectAssign_2
  });

  var require$$0 = ( es6ObjectAssign$1 && es6ObjectAssign ) || es6ObjectAssign$1;

  require$$0.polyfill();

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var es6Promise = createCommonjsModule(function (module, exports) {
  /*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   v4.2.6+9869a4bc
   */

  (function (global, factory) {
  	module.exports = factory();
  }(commonjsGlobal, (function () {
  function objectOrFunction(x) {
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
  }

  function isFunction(x) {
    return typeof x === 'function';
  }



  var _isArray = void 0;
  if (Array.isArray) {
    _isArray = Array.isArray;
  } else {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = void 0;
  var customSchedulerFn = void 0;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var vertx = Function('return this')().require('vertx');
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = void 0;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;


    if (_state) {
      var callback = arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:

    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });

    promise.then(function(value){
      // value === 1
    });
    ```

    Instead of writing the above, your code now simply becomes the following:

    ```javascript
    let promise = Promise.resolve(1);

    promise.then(function(value){
      // value === 1
    });
    ```

    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve$1(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && typeof object === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(2);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var TRY_CATCH_ERROR = { error: null };

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      TRY_CATCH_ERROR.error = error;
      return TRY_CATCH_ERROR;
    }
  }

  function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
    try {
      then$$1.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then$$1) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then$$1, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return resolve(promise, value);
      }, function (reason) {
        return reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$1) {
    if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$1 === TRY_CATCH_ERROR) {
        reject(promise, TRY_CATCH_ERROR.error);
        TRY_CATCH_ERROR.error = null;
      } else if (then$$1 === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$1)) {
        handleForeignThenable(promise, maybeThenable, then$$1);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function resolve(promise, value) {
    if (promise === value) {
      reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;


    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = void 0,
        callback = void 0,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = void 0,
        error = void 0,
        succeeded = void 0,
        failed = void 0;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value.error = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        resolve(promise, value);
      }, function rejectPromise(reason) {
        reject(promise, reason);
      });
    } catch (e) {
      reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  var Enumerator = function () {
    function Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate(input);
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        reject(this.promise, validationError());
      }
    }

    Enumerator.prototype._enumerate = function _enumerate(input) {
      for (var i = 0; this._state === PENDING && i < input.length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
      var c = this._instanceConstructor;
      var resolve$$1 = c.resolve;


      if (resolve$$1 === resolve$1) {
        var _then = getThen(entry);

        if (_then === then && entry._state !== PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof _then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === Promise$1) {
          var promise = new c(noop);
          handleMaybeThenable(promise, entry, _then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function (resolve$$1) {
            return resolve$$1(entry);
          }), i);
        }
      } else {
        this._willSettleAt(resolve$$1(entry), i);
      }
    };

    Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
      var promise = this.promise;


      if (promise._state === PENDING) {
        this._remaining--;

        if (state === REJECTED) {
          reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        fulfill(promise, this._result);
      }
    };

    Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function (value) {
        return enumerator._settledAt(FULFILLED, i, value);
      }, function (reason) {
        return enumerator._settledAt(REJECTED, i, reason);
      });
    };

    return Enumerator;
  }();

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.

    Example:

    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];

    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```

    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:

    Example:

    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];

    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```

    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.

    Example:

    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });

    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });

    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```

    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:

    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });

    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });

    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```

    An example real-world use case is implementing timeouts:

    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```

    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:

    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });

    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```

    Instead of writing the above, your code now simply becomes the following:

    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));

    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```

    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject$1(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.

    Terminology
    -----------

    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.

    A promise can be in one of three states: pending, fulfilled, or rejected.

    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.

    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.


    Basic Usage:
    ------------

    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);

      // on failure
      reject(reason);
    });

    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```

    Advanced Usage:
    ---------------

    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.

    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();

        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }

    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```

    Unlike callbacks, promises are great composable primitives.

    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON

      return values;
    });
    ```

    @class Promise
    @param {Function} resolver
    Useful for tooling.
    @constructor
  */

  var Promise$1 = function () {
    function Promise(resolver) {
      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
     ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
     Chaining
    --------
     The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
     ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
     findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
     ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
     Assimilation
    ------------
     Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
     ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
     If the assimliated promise rejects, then the downstream promise will also reject.
     ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
     Simple Example
    --------------
     Synchronous Example
     ```javascript
    let result;
     try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
     Errback Example
     ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
     Promise Example;
     ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
     Advanced Example
    --------------
     Synchronous Example
     ```javascript
    let author, books;
     try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
     Errback Example
     ```js
     function foundBooks(books) {
     }
     function failure(reason) {
     }
     findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
     Promise Example;
     ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
     @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
    */

    /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
    ```js
    function findAuthor(){
    throw new Error('couldn't find that author');
    }
    // synchronous
    try {
    findAuthor();
    } catch(reason) {
    // something went wrong
    }
    // async with promises
    findAuthor().catch(function(reason){
    // something went wrong
    });
    ```
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
    */


    Promise.prototype.catch = function _catch(onRejection) {
      return this.then(null, onRejection);
    };

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves
    
      Synchronous example:
    
      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }
    
      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```
    
      Asynchronous example:
    
      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```
    
      @method finally
      @param {Function} callback
      @return {Promise}
    */


    Promise.prototype.finally = function _finally(callback) {
      var promise = this;
      var constructor = promise.constructor;

      if (isFunction(callback)) {
        return promise.then(function (value) {
          return constructor.resolve(callback()).then(function () {
            return value;
          });
        }, function (reason) {
          return constructor.resolve(callback()).then(function () {
            throw reason;
          });
        });
      }

      return promise.then(callback, callback);
    };

    return Promise;
  }();

  Promise$1.prototype.then = then;
  Promise$1.all = all;
  Promise$1.race = race;
  Promise$1.resolve = resolve$1;
  Promise$1.reject = reject$1;
  Promise$1._setScheduler = setScheduler;
  Promise$1._setAsap = setAsap;
  Promise$1._asap = asap;

  /*global self*/
  function polyfill() {
    var local = void 0;

    if (typeof commonjsGlobal !== 'undefined') {
      local = commonjsGlobal;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise$1;
  }

  // Strange compat..
  Promise$1.polyfill = polyfill;
  Promise$1.Promise = Promise$1;

  return Promise$1;

  })));




  });

  var es6Promise$1 = /*#__PURE__*/Object.freeze({
    default: es6Promise,
    __moduleExports: es6Promise
  });

  var require$$0$1 = ( es6Promise$1 && es6Promise ) || es6Promise$1;

  var auto = require$$0$1.polyfill();

  var fetch_umd = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    factory(exports);
  }(commonjsGlobal, (function (exports) {
    var support = {
      searchParams: 'URLSearchParams' in self,
      iterable: 'Symbol' in self && 'iterator' in Symbol,
      blob:
        'FileReader' in self &&
        'Blob' in self &&
        (function() {
          try {
            new Blob();
            return true
          } catch (e) {
            return false
          }
        })(),
      formData: 'FormData' in self,
      arrayBuffer: 'ArrayBuffer' in self
    };

    function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    if (support.arrayBuffer) {
      var viewClasses = [
        '[object Int8Array]',
        '[object Uint8Array]',
        '[object Uint8ClampedArray]',
        '[object Int16Array]',
        '[object Uint16Array]',
        '[object Int32Array]',
        '[object Uint32Array]',
        '[object Float32Array]',
        '[object Float64Array]'
      ];

      var isArrayBufferView =
        ArrayBuffer.isView ||
        function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
        };
    }

    function normalizeName(name) {
      if (typeof name !== 'string') {
        name = String(name);
      }
      if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name')
      }
      return name.toLowerCase()
    }

    function normalizeValue(value) {
      if (typeof value !== 'string') {
        value = String(value);
      }
      return value
    }

    // Build a destructive iterator for the value list
    function iteratorFor(items) {
      var iterator = {
        next: function() {
          var value = items.shift();
          return {done: value === undefined, value: value}
        }
      };

      if (support.iterable) {
        iterator[Symbol.iterator] = function() {
          return iterator
        };
      }

      return iterator
    }

    function Headers(headers) {
      this.map = {};

      if (headers instanceof Headers) {
        headers.forEach(function(value, name) {
          this.append(name, value);
        }, this);
      } else if (Array.isArray(headers)) {
        headers.forEach(function(header) {
          this.append(header[0], header[1]);
        }, this);
      } else if (headers) {
        Object.getOwnPropertyNames(headers).forEach(function(name) {
          this.append(name, headers[name]);
        }, this);
      }
    }

    Headers.prototype.append = function(name, value) {
      name = normalizeName(name);
      value = normalizeValue(value);
      var oldValue = this.map[name];
      this.map[name] = oldValue ? oldValue + ', ' + value : value;
    };

    Headers.prototype['delete'] = function(name) {
      delete this.map[normalizeName(name)];
    };

    Headers.prototype.get = function(name) {
      name = normalizeName(name);
      return this.has(name) ? this.map[name] : null
    };

    Headers.prototype.has = function(name) {
      return this.map.hasOwnProperty(normalizeName(name))
    };

    Headers.prototype.set = function(name, value) {
      this.map[normalizeName(name)] = normalizeValue(value);
    };

    Headers.prototype.forEach = function(callback, thisArg) {
      for (var name in this.map) {
        if (this.map.hasOwnProperty(name)) {
          callback.call(thisArg, this.map[name], name, this);
        }
      }
    };

    Headers.prototype.keys = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push(name);
      });
      return iteratorFor(items)
    };

    Headers.prototype.values = function() {
      var items = [];
      this.forEach(function(value) {
        items.push(value);
      });
      return iteratorFor(items)
    };

    Headers.prototype.entries = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
      });
      return iteratorFor(items)
    };

    if (support.iterable) {
      Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
    }

    function consumed(body) {
      if (body.bodyUsed) {
        return Promise.reject(new TypeError('Already read'))
      }
      body.bodyUsed = true;
    }

    function fileReaderReady(reader) {
      return new Promise(function(resolve, reject) {
        reader.onload = function() {
          resolve(reader.result);
        };
        reader.onerror = function() {
          reject(reader.error);
        };
      })
    }

    function readBlobAsArrayBuffer(blob) {
      var reader = new FileReader();
      var promise = fileReaderReady(reader);
      reader.readAsArrayBuffer(blob);
      return promise
    }

    function readBlobAsText(blob) {
      var reader = new FileReader();
      var promise = fileReaderReady(reader);
      reader.readAsText(blob);
      return promise
    }

    function readArrayBufferAsText(buf) {
      var view = new Uint8Array(buf);
      var chars = new Array(view.length);

      for (var i = 0; i < view.length; i++) {
        chars[i] = String.fromCharCode(view[i]);
      }
      return chars.join('')
    }

    function bufferClone(buf) {
      if (buf.slice) {
        return buf.slice(0)
      } else {
        var view = new Uint8Array(buf.byteLength);
        view.set(new Uint8Array(buf));
        return view.buffer
      }
    }

    function Body() {
      this.bodyUsed = false;

      this._initBody = function(body) {
        this._bodyInit = body;
        if (!body) {
          this._bodyText = '';
        } else if (typeof body === 'string') {
          this._bodyText = body;
        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
          this._bodyBlob = body;
        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
          this._bodyFormData = body;
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this._bodyText = body.toString();
        } else if (support.arrayBuffer && support.blob && isDataView(body)) {
          this._bodyArrayBuffer = bufferClone(body.buffer);
          // IE 10-11 can't handle a DataView body.
          this._bodyInit = new Blob([this._bodyArrayBuffer]);
        } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
          this._bodyArrayBuffer = bufferClone(body);
        } else {
          this._bodyText = body = Object.prototype.toString.call(body);
        }

        if (!this.headers.get('content-type')) {
          if (typeof body === 'string') {
            this.headers.set('content-type', 'text/plain;charset=UTF-8');
          } else if (this._bodyBlob && this._bodyBlob.type) {
            this.headers.set('content-type', this._bodyBlob.type);
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
          }
        }
      };

      if (support.blob) {
        this.blob = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return Promise.resolve(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(new Blob([this._bodyArrayBuffer]))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as blob')
          } else {
            return Promise.resolve(new Blob([this._bodyText]))
          }
        };

        this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
          } else {
            return this.blob().then(readBlobAsArrayBuffer)
          }
        };
      }

      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      };

      if (support.formData) {
        this.formData = function() {
          return this.text().then(decode)
        };
      }

      this.json = function() {
        return this.text().then(JSON.parse)
      };

      return this
    }

    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

    function normalizeMethod(method) {
      var upcased = method.toUpperCase();
      return methods.indexOf(upcased) > -1 ? upcased : method
    }

    function Request(input, options) {
      options = options || {};
      var body = options.body;

      if (input instanceof Request) {
        if (input.bodyUsed) {
          throw new TypeError('Already read')
        }
        this.url = input.url;
        this.credentials = input.credentials;
        if (!options.headers) {
          this.headers = new Headers(input.headers);
        }
        this.method = input.method;
        this.mode = input.mode;
        this.signal = input.signal;
        if (!body && input._bodyInit != null) {
          body = input._bodyInit;
          input.bodyUsed = true;
        }
      } else {
        this.url = String(input);
      }

      this.credentials = options.credentials || this.credentials || 'same-origin';
      if (options.headers || !this.headers) {
        this.headers = new Headers(options.headers);
      }
      this.method = normalizeMethod(options.method || this.method || 'GET');
      this.mode = options.mode || this.mode || null;
      this.signal = options.signal || this.signal;
      this.referrer = null;

      if ((this.method === 'GET' || this.method === 'HEAD') && body) {
        throw new TypeError('Body not allowed for GET or HEAD requests')
      }
      this._initBody(body);
    }

    Request.prototype.clone = function() {
      return new Request(this, {body: this._bodyInit})
    };

    function decode(body) {
      var form = new FormData();
      body
        .trim()
        .split('&')
        .forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split('=');
            var name = split.shift().replace(/\+/g, ' ');
            var value = split.join('=').replace(/\+/g, ' ');
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
      return form
    }

    function parseHeaders(rawHeaders) {
      var headers = new Headers();
      // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
      // https://tools.ietf.org/html/rfc7230#section-3.2
      var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
      preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          headers.append(key, value);
        }
      });
      return headers
    }

    Body.call(Request.prototype);

    function Response(bodyInit, options) {
      if (!options) {
        options = {};
      }

      this.type = 'default';
      this.status = options.status === undefined ? 200 : options.status;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = 'statusText' in options ? options.statusText : 'OK';
      this.headers = new Headers(options.headers);
      this.url = options.url || '';
      this._initBody(bodyInit);
    }

    Body.call(Response.prototype);

    Response.prototype.clone = function() {
      return new Response(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(this.headers),
        url: this.url
      })
    };

    Response.error = function() {
      var response = new Response(null, {status: 0, statusText: ''});
      response.type = 'error';
      return response
    };

    var redirectStatuses = [301, 302, 303, 307, 308];

    Response.redirect = function(url, status) {
      if (redirectStatuses.indexOf(status) === -1) {
        throw new RangeError('Invalid status code')
      }

      return new Response(null, {status: status, headers: {location: url}})
    };

    exports.DOMException = self.DOMException;
    try {
      new exports.DOMException();
    } catch (err) {
      exports.DOMException = function(message, name) {
        this.message = message;
        this.name = name;
        var error = Error(message);
        this.stack = error.stack;
      };
      exports.DOMException.prototype = Object.create(Error.prototype);
      exports.DOMException.prototype.constructor = exports.DOMException;
    }

    function fetch(input, init) {
      return new Promise(function(resolve, reject) {
        var request = new Request(input, init);

        if (request.signal && request.signal.aborted) {
          return reject(new exports.DOMException('Aborted', 'AbortError'))
        }

        var xhr = new XMLHttpRequest();

        function abortXhr() {
          xhr.abort();
        }

        xhr.onload = function() {
          var options = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders() || '')
          };
          options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
          var body = 'response' in xhr ? xhr.response : xhr.responseText;
          resolve(new Response(body, options));
        };

        xhr.onerror = function() {
          reject(new TypeError('Network request failed'));
        };

        xhr.ontimeout = function() {
          reject(new TypeError('Network request failed'));
        };

        xhr.onabort = function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        };

        xhr.open(request.method, request.url, true);

        if (request.credentials === 'include') {
          xhr.withCredentials = true;
        } else if (request.credentials === 'omit') {
          xhr.withCredentials = false;
        }

        if ('responseType' in xhr && support.blob) {
          xhr.responseType = 'blob';
        }

        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });

        if (request.signal) {
          request.signal.addEventListener('abort', abortXhr);

          xhr.onreadystatechange = function() {
            // DONE (success or failure)
            if (xhr.readyState === 4) {
              request.signal.removeEventListener('abort', abortXhr);
            }
          };
        }

        xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
      })
    }

    fetch.polyfill = true;

    if (!self.fetch) {
      self.fetch = fetch;
      self.Headers = Headers;
      self.Request = Request;
      self.Response = Response;
    }

    exports.Headers = Headers;
    exports.Request = Request;
    exports.Response = Response;
    exports.fetch = fetch;

    Object.defineProperty(exports, '__esModule', { value: true });

  })));
  });

  unwrapExports(fetch_umd);

  /* eslint-disable */
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  if (!Array.prototype.find) {
    /**
     * @name Array.prototype.find
     * 补丁，`Array.prototype.find`兼容
     */
    Object.defineProperty(Array.prototype, 'find', {
      value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      }
    });
  }

  // Production steps of ECMA-262, Edition 5, 15.4.4.17
  // Reference: http://es5.github.io/#x15.4.4.17
  if (!Array.prototype.some) {
    /**
     * @name Array.prototype.some
     * 补丁，`Array.prototype.some`兼容
     */
    Array.prototype.some = function (fun/*, thisArg*/) {

      if (this == null) {
        throw new TypeError('Array.prototype.some called on null or undefined');
      }

      if (typeof fun !== 'function') {
        throw new TypeError();
      }

      var t = Object(this);
      var len = t.length >>> 0;

      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t && fun.call(thisArg, t[i], i, t)) {
          return true;
        }
      }

      return false;
    };
  }

  if (!Array.prototype.every) {
    /**
     * @name Array.prototype.every
     * 补丁，`Array.prototype.every`兼容
     */
    Array.prototype.every = function (fun /*, thisArg */) {

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== 'function')
        throw new TypeError();

      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t && !fun.call(thisArg, t[i], i, t))
          return false;
      }

      return true;
    };
  }

  var es6Collections = createCommonjsModule(function (module, exports) {
  /* eslint-disable */

  (function (exports) {
    //shared pointer
    var i;
    //shortcuts
    var defineProperty = Object.defineProperty, is = function (a, b) { return (a === b) || (a !== a && b !== b) };


    //Polyfill global objects
    if (typeof WeakMap == 'undefined') {
      /**
       * @class
       * @name WeakMap
       * @classdesc 补丁，`WeakMap` 数据结构
       * @see {@link https://github.com/WebReflection/es6-collections/blob/master/index.js|github}
       */
      exports.WeakMap = createCollection({
        // WeakMap#delete(key:void*):boolean
        'delete': sharedDelete,
        // WeakMap#clear():
        clear: sharedClear,
        // WeakMap#get(key:void*):void*
        get: sharedGet,
        // WeakMap#has(key:void*):boolean
        has: mapHas,
        // WeakMap#set(key:void*, value:void*):void
        set: sharedSet
      }, true);
    }

    if (typeof Map == 'undefined' || typeof ((new Map).values) !== 'function' || !(new Map).values().next) {
      /**
       * @class
       * @name Map
       * @classdesc 补丁，`Map` 数据结构
       * @see {@link https://github.com/WebReflection/es6-collections/blob/master/index.js|github}
       */
      exports.Map = createCollection({
        // WeakMap#delete(key:void*):boolean
        'delete': sharedDelete,
        //:was Map#get(key:void*[, d3fault:void*]):void*
        // Map#has(key:void*):boolean
        has: mapHas,
        // Map#get(key:void*):boolean
        get: sharedGet,
        // Map#set(key:void*, value:void*):void
        set: sharedSet,
        // Map#keys(void):Iterator
        keys: sharedKeys,
        // Map#values(void):Iterator
        values: sharedValues,
        // Map#entries(void):Iterator
        entries: mapEntries,
        // Map#forEach(callback:Function, context:void*):void ==> callback.call(context, key, value, mapObject) === not in specs`
        forEach: sharedForEach,
        // Map#clear():
        clear: sharedClear
      });
    }

    if (typeof Set == 'undefined' || typeof ((new Set).values) !== 'function' || !(new Set).values().next) {
      /**
       * @class
       * @name Set
       * @classdesc 补丁，`Set` 数据结构
       * @see {@link https://github.com/WebReflection/es6-collections/blob/master/index.js|github}
       */
      exports.Set = createCollection({
        // Set#has(value:void*):boolean
        has: setHas,
        // Set#add(value:void*):boolean
        add: sharedAdd,
        // Set#delete(key:void*):boolean
        'delete': sharedDelete,
        // Set#clear():
        clear: sharedClear,
        // Set#keys(void):Iterator
        keys: sharedValues, // specs actually say "the same function object as the initial value of the values property"
        // Set#values(void):Iterator
        values: sharedValues,
        // Set#entries(void):Iterator
        entries: setEntries,
        // Set#forEach(callback:Function, context:void*):void ==> callback.call(context, value, index) === not in specs
        forEach: sharedForEach
      });
    }

    if (typeof WeakSet == 'undefined') {
      /**
       * @class
       * @name WeakSet
       * @classdesc 补丁，`WeakSet` 数据结构
       * @see {@link https://github.com/WebReflection/es6-collections/blob/master/index.js|github}
       */
      exports.WeakSet = createCollection({
        // WeakSet#delete(key:void*):boolean
        'delete': sharedDelete,
        // WeakSet#add(value:void*):boolean
        add: sharedAdd,
        // WeakSet#clear():
        clear: sharedClear,
        // WeakSet#has(value:void*):boolean
        has: setHas
      }, true);
    }


    /**
     * ES6 collection constructor
     * @return {Function} a collection class
     */
    function createCollection(proto, objectOnly) {
      function Collection(a) {
        if (!this || !(this instanceof Collection)) return new Collection(a);
        this._keys = [];
        this._values = [];
        this._itp = []; // iteration pointers
        this.objectOnly = objectOnly;

        //parse initial iterable argument passed
        if (a) init.call(this, a);
      }

      //define size for non object-only collections
      if (!objectOnly) {
        defineProperty(proto, 'size', {
          get: sharedSize
        });
      }

      //set prototype
      proto.constructor = Collection;
      Collection.prototype = proto;

      return Collection;
    }


    /** parse initial iterable argument passed */
    function init(a) {
      //init Set argument, like `[1,2,3,{}]`
      if (this.add)
        a.forEach(this.add, this);
      //init Map argument like `[[1,2], [{}, 4]]`
      else
        a.forEach(function (a) { this.set(a[0], a[1]); }, this);
    }


    /** delete */
    function sharedDelete(key) {
      if (this.has(key)) {
        this._keys.splice(i, 1);
        this._values.splice(i, 1);
        // update iteration pointers
        this._itp.forEach(function (p) { if (i < p[0]) p[0]--; });
      }
      // Aurora here does it while Canary doesn't
      return -1 < i;
    }
    function sharedGet(key) {
      return this.has(key) ? this._values[i] : undefined;
    }

    function has(list, key) {
      if (this.objectOnly && key !== Object(key))
        throw new TypeError("Invalid value used as weak collection key");
      //NaN or 0 passed
      if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) { }
      else i = list.indexOf(key);
      return -1 < i;
    }

    function setHas(value) {
      return has.call(this, this._values, value);
    }

    function mapHas(value) {
      return has.call(this, this._keys, value);
    }

    /** @chainable */
    function sharedSet(key, value) {
      this.has(key) ?
        this._values[i] = value
        :
        this._values[this._keys.push(key) - 1] = value
        ;
      return this;
    }

    /** @chainable */
    function sharedAdd(value) {
      if (!this.has(value)) this._values.push(value);
      return this;
    }

    function sharedClear() {
      (this._keys || 0).length =
        this._values.length = 0;
    }

    /** keys, values, and iterate related methods */
    function sharedKeys() {
      return sharedIterator(this._itp, this._keys);
    }

    function sharedValues() {
      return sharedIterator(this._itp, this._values);
    }

    function mapEntries() {
      return sharedIterator(this._itp, this._keys, this._values);
    }

    function setEntries() {
      return sharedIterator(this._itp, this._values, this._values);
    }

    function sharedIterator(itp, array, array2) {
      var p = [0], done = false;
      itp.push(p);
      return {
        next: function () {
          var v, k = p[0];
          if (!done && k < array.length) {
            v = array2 ? [array[k], array2[k]] : array[k];
            p[0]++;
          } else {
            done = true;
            itp.splice(itp.indexOf(p), 1);
          }
          return { done: done, value: v };
        }
      };
    }

    function sharedSize() {
      return this._values.length;
    }

    function sharedForEach(callback, context) {
      var it = this.entries();
      for (; ;) {
        var r = it.next();
        if (r.done) break;
        callback.call(context, r.value[1], r.value[0], this);
      }
    }

  })(typeof commonjsGlobal != 'undefined' ? commonjsGlobal : window);
  });

  var raf = createCommonjsModule(function (module, exports) {
  /* eslint-disable */
  (function (exports) {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !exports.requestAnimationFrame; ++x) {
      exports.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      exports.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!exports.requestAnimationFrame)
      /**
       * @function
       * @name requestAnimationFrame
       * @desc 处理`requestAnimationFrame`的兼容补丁
       */
      exports.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = exports.setTimeout(function () { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!exports.cancelAnimationFrame)
      /**
       * @function
       * @name cancelAnimationFrame
       * @desc 处理`cancelAnimationFrame`的兼容补丁
       */
      exports.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
  })(typeof commonjsGlobal != 'undefined' ? commonjsGlobal : window);
  });

  !function(e, n) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function() {
      return n(e)
    }) : n(e, !0);
  } (window,
  function(o, e) {
    if (!o.jWeixin) {
      var n, c = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest",
        openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
        startSearchBeacons: "startMonitoringBeacons",
        stopSearchBeacons: "stopMonitoringBeacons",
        onSearchBeacons: "onBeaconsInRange",
        consumeAndShareCard: "consumedShareCard",
        openAddress: "editAddress"
      },
      a = function() {
        var e = {};
        for (var n in c) e[c[n]] = n;
        return e
      } (),
      i = o.document,
      t = i.title,
      r = navigator.userAgent.toLowerCase(),
      s = navigator.platform.toLowerCase(),
      d = !(!s.match("mac") && !s.match("win")),
      u = -1 != r.indexOf("wxdebugger"),
      l = -1 != r.indexOf("micromessenger"),
      p = -1 != r.indexOf("android"),
      f = -1 != r.indexOf("iphone") || -1 != r.indexOf("ipad"),
      m = (n = r.match(/micromessenger\/(\d+\.\d+\.\d+)/) || r.match(/micromessenger\/(\d+\.\d+)/)) ? n[1] : "",
      g = {
        initStartTime: L(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0
      },
      h = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        isPreVerifyOk: 1,
        systemType: f ? 1 : p ? 2 : -1,
        clientVersion: m,
        url: encodeURIComponent(location.href)
      },
      v = {},
      S = {
        _completes: []
      },
      y = {
        state: 0,
        data: {}
      };
      O(function() {
        g.initEndTime = L();
      });
      var I = !1,
      _ = [],
      w = {
        config: function(e) {
          B("config", v = e);
          var t = !1 !== v.check;
          O(function() {
            if (t) M(c.config, {
              verifyJsApiList: C(v.jsApiList)
            },
            function() {
              S._complete = function(e) {
                g.preVerifyEndTime = L(),
                y.state = 1,
                y.data = e;
              },
              S.success = function(e) {
                h.isPreVerifyOk = 0;
              },
              S.fail = function(e) {
                S._fail ? S._fail(e) : y.state = -1;
              };
              var t = S._completes;
              return t.push(function() { !
                function(e) {
                  if (! (d || u || v.debug || m < "6.0.2" || h.systemType < 0)) {
                    var i = new Image;
                    h.appId = v.appId,
                    h.initTime = g.initEndTime - g.initStartTime,
                    h.preVerifyTime = g.preVerifyEndTime - g.preVerifyStartTime,
                    w.getNetworkType({
                      isInnerInvoke: !0,
                      success: function(e) {
                        h.networkType = e.networkType;
                        var n = "https://open.weixin.qq.com/sdk/report?v=" + h.version + "&o=" + h.isPreVerifyOk + "&s=" + h.systemType + "&c=" + h.clientVersion + "&a=" + h.appId + "&n=" + h.networkType + "&i=" + h.initTime + "&p=" + h.preVerifyTime + "&u=" + h.url;
                        i.src = n;
                      }
                    });
                  }
                } ();
              }),
              S.complete = function(e) {
                for (var n = 0,
                i = t.length; n < i; ++n) t[n]();
                S._completes = [];
              },
              S
            } ()),
            g.preVerifyStartTime = L();
            else {
              y.state = 1;
              for (var e = S._completes,
              n = 0,
              i = e.length; n < i; ++n) e[n]();
              S._completes = [];
            }
          }),
          w.invoke || (w.invoke = function(e, n, i) {
            o.WeixinJSBridge && WeixinJSBridge.invoke(e, x(n), i);
          },
          w.on = function(e, n) {
            o.WeixinJSBridge && WeixinJSBridge.on(e, n);
          });
        },
        ready: function(e) {
          0 != y.state ? e() : (S._completes.push(e), !l && v.debug && e());
        },
        error: function(e) {
          m < "6.0.2" || ( - 1 == y.state ? e(y.data) : S._fail = e);
        },
        checkJsApi: function(e) {
          M("checkJsApi", {
            jsApiList: C(e.jsApiList)
          },
          (e._complete = function(e) {
            if (p) {
              var n = e.checkResult;
              n && (e.checkResult = JSON.parse(n));
            }
            e = function(e) {
              var n = e.checkResult;
              for (var i in n) {
                var t = a[i];
                t && (n[t] = n[i], delete n[i]);
              }
              return e
            } (e);
          },
          e));
        },
        onMenuShareTimeline: function(e) {
          P(c.onMenuShareTimeline, {
            complete: function() {
              M("shareTimeline", {
                title: e.title || t,
                desc: e.title || t,
                img_url: e.imgUrl || "",
                link: e.link || location.href,
                type: e.type || "link",
                data_url: e.dataUrl || ""
              },
              e);
            }
          },
          e);
        },
        onMenuShareAppMessage: function(n) {
          P(c.onMenuShareAppMessage, {
            complete: function(e) {
              "favorite" === e.scene ? M("sendAppMessage", {
                title: n.title || t,
                desc: n.desc || "",
                link: n.link || location.href,
                img_url: n.imgUrl || "",
                type: n.type || "link",
                data_url: n.dataUrl || ""
              }) : M("sendAppMessage", {
                title: n.title || t,
                desc: n.desc || "",
                link: n.link || location.href,
                img_url: n.imgUrl || "",
                type: n.type || "link",
                data_url: n.dataUrl || ""
              },
              n);
            }
          },
          n);
        },
        onMenuShareQQ: function(e) {
          P(c.onMenuShareQQ, {
            complete: function() {
              M("shareQQ", {
                title: e.title || t,
                desc: e.desc || "",
                img_url: e.imgUrl || "",
                link: e.link || location.href
              },
              e);
            }
          },
          e);
        },
        onMenuShareWeibo: function(e) {
          P(c.onMenuShareWeibo, {
            complete: function() {
              M("shareWeiboApp", {
                title: e.title || t,
                desc: e.desc || "",
                img_url: e.imgUrl || "",
                link: e.link || location.href
              },
              e);
            }
          },
          e);
        },
        onMenuShareQZone: function(e) {
          P(c.onMenuShareQZone, {
            complete: function() {
              M("shareQZone", {
                title: e.title || t,
                desc: e.desc || "",
                img_url: e.imgUrl || "",
                link: e.link || location.href
              },
              e);
            }
          },
          e);
        },
        updateTimelineShareData: function(e) {
          M("updateTimelineShareData", {
            title: e.title,
            link: e.link,
            imgUrl: e.imgUrl
          },
          e);
        },
        updateAppMessageShareData: function(e) {
          M("updateAppMessageShareData", {
            title: e.title,
            desc: e.desc,
            link: e.link,
            imgUrl: e.imgUrl
          },
          e);
        },
        startRecord: function(e) {
          M("startRecord", {},
          e);
        },
        stopRecord: function(e) {
          M("stopRecord", {},
          e);
        },
        onVoiceRecordEnd: function(e) {
          P("onVoiceRecordEnd", e);
        },
        playVoice: function(e) {
          M("playVoice", {
            localId: e.localId
          },
          e);
        },
        pauseVoice: function(e) {
          M("pauseVoice", {
            localId: e.localId
          },
          e);
        },
        stopVoice: function(e) {
          M("stopVoice", {
            localId: e.localId
          },
          e);
        },
        onVoicePlayEnd: function(e) {
          P("onVoicePlayEnd", e);
        },
        uploadVoice: function(e) {
          M("uploadVoice", {
            localId: e.localId,
            isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
          },
          e);
        },
        downloadVoice: function(e) {
          M("downloadVoice", {
            serverId: e.serverId,
            isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
          },
          e);
        },
        translateVoice: function(e) {
          M("translateVoice", {
            localId: e.localId,
            isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
          },
          e);
        },
        chooseImage: function(e) {
          M("chooseImage", {
            scene: "1|2",
            count: e.count || 9,
            sizeType: e.sizeType || ["original", "compressed"],
            sourceType: e.sourceType || ["album", "camera"]
          },
          (e._complete = function(e) {
            if (p) {
              var n = e.localIds;
              try {
                n && (e.localIds = JSON.parse(n));
              } catch(e) {}
            }
          },
          e));
        },
        getLocation: function(e) {},
        previewImage: function(e) {
          M(c.previewImage, {
            current: e.current,
            urls: e.urls
          },
          e);
        },
        uploadImage: function(e) {
          M("uploadImage", {
            localId: e.localId,
            isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
          },
          e);
        },
        downloadImage: function(e) {
          M("downloadImage", {
            serverId: e.serverId,
            isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
          },
          e);
        },
        getLocalImgData: function(e) { ! 1 === I ? (I = !0, M("getLocalImgData", {
            localId: e.localId
          },
          (e._complete = function(e) {
            if (I = !1, 0 < _.length) {
              var n = _.shift();
              wx.getLocalImgData(n);
            }
          },
          e))) : _.push(e);
        },
        getNetworkType: function(e) {
          M("getNetworkType", {},
          (e._complete = function(e) {
            e = function(e) {
              var n = e.errMsg;
              e.errMsg = "getNetworkType:ok";
              var i = e.subtype;
              if (delete e.subtype, i) e.networkType = i;
              else {
                var t = n.indexOf(":"),
                o = n.substring(t + 1);
                switch (o) {
                case "wifi":
                case "edge":
                case "wwan":
                  e.networkType = o;
                  break;
                default:
                  e.errMsg = "getNetworkType:fail";
                }
              }
              return e
            } (e);
          },
          e));
        },
        openLocation: function(e) {
          M("openLocation", {
            latitude: e.latitude,
            longitude: e.longitude,
            name: e.name || "",
            address: e.address || "",
            scale: e.scale || 28,
            infoUrl: e.infoUrl || ""
          },
          e);
        },
        getLocation: function(e) {
          M(c.getLocation, {
            type: (e = e || {}).type || "wgs84"
          },
          (e._complete = function(e) {
            delete e.type;
          },
          e));
        },
        hideOptionMenu: function(e) {
          M("hideOptionMenu", {},
          e);
        },
        showOptionMenu: function(e) {
          M("showOptionMenu", {},
          e);
        },
        closeWindow: function(e) {
          M("closeWindow", {},
          e = e || {});
        },
        hideMenuItems: function(e) {
          M("hideMenuItems", {
            menuList: e.menuList
          },
          e);
        },
        showMenuItems: function(e) {
          M("showMenuItems", {
            menuList: e.menuList
          },
          e);
        },
        hideAllNonBaseMenuItem: function(e) {
          M("hideAllNonBaseMenuItem", {},
          e);
        },
        showAllNonBaseMenuItem: function(e) {
          M("showAllNonBaseMenuItem", {},
          e);
        },
        scanQRCode: function(e) {
          M("scanQRCode", {
            needResult: (e = e || {}).needResult || 0,
            scanType: e.scanType || ["qrCode", "barCode"]
          },
          (e._complete = function(e) {
            if (f) {
              var n = e.resultStr;
              if (n) {
                var i = JSON.parse(n);
                e.resultStr = i && i.scan_code && i.scan_code.scan_result;
              }
            }
          },
          e));
        },
        openAddress: function(e) {
          M(c.openAddress, {},
          (e._complete = function(e) {
            var n; (n = e).postalCode = n.addressPostalCode,
            delete n.addressPostalCode,
            n.provinceName = n.proviceFirstStageName,
            delete n.proviceFirstStageName,
            n.cityName = n.addressCitySecondStageName,
            delete n.addressCitySecondStageName,
            n.countryName = n.addressCountiesThirdStageName,
            delete n.addressCountiesThirdStageName,
            n.detailInfo = n.addressDetailInfo,
            delete n.addressDetailInfo,
            e = n;
          },
          e));
        },
        openProductSpecificView: function(e) {
          M(c.openProductSpecificView, {
            pid: e.productId,
            view_type: e.viewType || 0,
            ext_info: e.extInfo
          },
          e);
        },
        addCard: function(e) {
          for (var n = e.cardList,
          i = [], t = 0, o = n.length; t < o; ++t) {
            var r = n[t],
            a = {
              card_id: r.cardId,
              card_ext: r.cardExt
            };
            i.push(a);
          }
          M(c.addCard, {
            card_list: i
          },
          (e._complete = function(e) {
            var n = e.card_list;
            if (n) {
              for (var i = 0,
              t = (n = JSON.parse(n)).length; i < t; ++i) {
                var o = n[i];
                o.cardId = o.card_id,
                o.cardExt = o.card_ext,
                o.isSuccess = !!o.is_succ,
                delete o.card_id,
                delete o.card_ext,
                delete o.is_succ;
              }
              e.cardList = n,
              delete e.card_list;
            }
          },
          e));
        },
        chooseCard: function(e) {
          M("chooseCard", {
            app_id: v.appId,
            location_id: e.shopId || "",
            sign_type: e.signType || "SHA1",
            card_id: e.cardId || "",
            card_type: e.cardType || "",
            card_sign: e.cardSign,
            time_stamp: e.timestamp + "",
            nonce_str: e.nonceStr
          },
          (e._complete = function(e) {
            e.cardList = e.choose_card_info,
            delete e.choose_card_info;
          },
          e));
        },
        openCard: function(e) {
          for (var n = e.cardList,
          i = [], t = 0, o = n.length; t < o; ++t) {
            var r = n[t],
            a = {
              card_id: r.cardId,
              code: r.code
            };
            i.push(a);
          }
          M(c.openCard, {
            card_list: i
          },
          e);
        },
        consumeAndShareCard: function(e) {
          M(c.consumeAndShareCard, {
            consumedCardId: e.cardId,
            consumedCode: e.code
          },
          e);
        },
        chooseWXPay: function(e) {
          M(c.chooseWXPay, V(e), e);
        },
        openEnterpriseRedPacket: function(e) {
          M(c.openEnterpriseRedPacket, V(e), e);
        },
        startSearchBeacons: function(e) {
          M(c.startSearchBeacons, {
            ticket: e.ticket
          },
          e);
        },
        stopSearchBeacons: function(e) {
          M(c.stopSearchBeacons, {},
          e);
        },
        onSearchBeacons: function(e) {
          P(c.onSearchBeacons, e);
        },
        openEnterpriseChat: function(e) {
          M("openEnterpriseChat", {
            useridlist: e.userIds,
            chatname: e.groupName
          },
          e);
        },
        launchMiniProgram: function(e) {
          M("launchMiniProgram", {
            targetAppId: e.targetAppId,
            path: function(e) {
              if ("string" == typeof e && 0 < e.length) {
                var n = e.split("?")[0],
                i = e.split("?")[1];
                return n += ".html",
                void 0 !== i ? n + "?" + i: n
              }
            } (e.path),
            envVersion: e.envVersion
          },
          e);
        },
        openBusinessView: function(e) {
          M("openBusinessView", {
            businessType: e.businessType,
            queryString: e.queryString || "",
            envVersion: e.envVersion
          },
          (e._complete = function(n) {
            if (p) {
              var e = n.extraData;
              if (e) try {
                n.extraData = JSON.parse(e);
              } catch(e) {
                n.extraData = {};
              }
            }
          },
          e));
        },
        miniProgram: {
          navigateBack: function(e) {
            e = e || {},
            O(function() {
              M("invokeMiniProgramAPI", {
                name: "navigateBack",
                arg: {
                  delta: e.delta || 1
                }
              },
              e);
            });
          },
          navigateTo: function(e) {
            O(function() {
              M("invokeMiniProgramAPI", {
                name: "navigateTo",
                arg: {
                  url: e.url
                }
              },
              e);
            });
          },
          redirectTo: function(e) {
            O(function() {
              M("invokeMiniProgramAPI", {
                name: "redirectTo",
                arg: {
                  url: e.url
                }
              },
              e);
            });
          },
          switchTab: function(e) {
            O(function() {
              M("invokeMiniProgramAPI", {
                name: "switchTab",
                arg: {
                  url: e.url
                }
              },
              e);
            });
          },
          reLaunch: function(e) {
            O(function() {
              M("invokeMiniProgramAPI", {
                name: "reLaunch",
                arg: {
                  url: e.url
                }
              },
              e);
            });
          },
          postMessage: function(e) {
            O(function() {
              M("invokeMiniProgramAPI", {
                name: "postMessage",
                arg: e.data || {}
              },
              e);
            });
          },
          getEnv: function(e) {
            O(function() {
              e({
                miniprogram: "miniprogram" === o.__wxjs_environment
              });
            });
          }
        }
      },
      T = 1,
      k = {};
      return i.addEventListener("error",
      function(e) {
        if (!p) {
          var n = e.target,
          i = n.tagName,
          t = n.src;
          if ("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) if ( - 1 != t.indexOf("wxlocalresource://")) {
            e.preventDefault(),
            e.stopPropagation();
            var o = n["wx-id"];
            if (o || (o = T++, n["wx-id"] = o), k[o]) return;
            k[o] = !0,
            wx.ready(function() {
              wx.getLocalImgData({
                localId: t,
                success: function(e) {
                  n.src = e.localData;
                }
              });
            });
          }
        }
      },
      !0),
      i.addEventListener("load",
      function(e) {
        if (!p) {
          var n = e.target,
          i = n.tagName;
          n.src;
          if ("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) {
            var t = n["wx-id"];
            t && (k[t] = !1);
          }
        }
      },
      !0),
      e && (o.wx = o.jWeixin = w),
      w
    }
    function M(n, e, i) {
      o.WeixinJSBridge ? WeixinJSBridge.invoke(n, x(e),
      function(e) {
        A(n, e, i);
      }) : B(n, i);
    }
    function P(n, i, t) {
      o.WeixinJSBridge ? WeixinJSBridge.on(n,
      function(e) {
        t && t.trigger && t.trigger(e),
        A(n, e, i);
      }) : B(n, t || i);
    }
    function x(e) {
      return (e = e || {}).appId = v.appId,
      e.verifyAppId = v.appId,
      e.verifySignType = "sha1",
      e.verifyTimestamp = v.timestamp + "",
      e.verifyNonceStr = v.nonceStr,
      e.verifySignature = v.signature,
      e
    }
    function V(e) {
      return {
        timeStamp: e.timestamp + "",
        nonceStr: e.nonceStr,
        package: e.package,
        paySign: e.paySign,
        signType: e.signType || "SHA1"
      }
    }
    function A(e, n, i) {
      "openEnterpriseChat" == e && (n.errCode = n.err_code),
      delete n.err_code,
      delete n.err_desc,
      delete n.err_detail;
      var t = n.errMsg;
      t || (t = n.err_msg, delete n.err_msg, t = function(e, n) {
        var i = e,
        t = a[i];
        t && (i = t);
        var o = "ok";
        if (n) {
          var r = n.indexOf(":");
          "confirm" == (o = n.substring(r + 1)) && (o = "ok"),
          "failed" == o && (o = "fail"),
          -1 != o.indexOf("failed_") && (o = o.substring(7)),
          -1 != o.indexOf("fail_") && (o = o.substring(5)),
          "access denied" != (o = (o = o.replace(/_/g, " ")).toLowerCase()) && "no permission to execute" != o || (o = "permission denied"),
          "config" == i && "function not exist" == o && (o = "ok"),
          "" == o && (o = "fail");
        }
        return n = i + ":" + o
      } (e, t), n.errMsg = t),
      (i = i || {})._complete && (i._complete(n), delete i._complete),
      t = n.errMsg || "",
      v.debug && !i.isInnerInvoke && alert(JSON.stringify(n));
      var o = t.indexOf(":");
      switch (t.substring(o + 1)) {
      case "ok":
        i.success && i.success(n);
        break;
      case "cancel":
        i.cancel && i.cancel(n);
        break;
      default:
        i.fail && i.fail(n);
      }
      i.complete && i.complete(n);
    }
    function C(e) {
      if (e) {
        for (var n = 0,
        i = e.length; n < i; ++n) {
          var t = e[n],
          o = c[t];
          o && (e[n] = o);
        }
        return e
      }
    }
    function B(e, n) {
      if (! (!v.debug || n && n.isInnerInvoke)) {
        var i = a[e];
        i && (e = i),
        n && n._complete && delete n._complete,
        console.log('"' + e + '",', n || "");
      }
    }
    function L() {
      return (new Date).getTime()
    }
    function O(e) {
      l && (o.WeixinJSBridge ? e() : i.addEventListener && i.addEventListener("WeixinJSBridgeReady", e, !1));
    }
  });

  /**
   * @function
   * @name Object.assign
   * @desc es5 `Object.assign` polyfill
   * @see {@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign|Document}
   */

  /**
   * 字符串转驼峰
   * @example
   * camelize('padding-left') // paddingLeft
   * @export
   * @param {string} str
   * @returns {string}
   */
  function camelize(str) {
      return str.replace(/-+(.)?/g, function (match, chr) { return chr ? chr.toUpperCase() : ''; });
  }
  function noop() { }
  /**
   * 将驼峰字符串转换为 dasherize格式
   * @example
   * sdk.dasherize('paddingLeft') // padding-left
   * @export
   * @param {string} str
   * @returns {string}
   */
  function dasherize(str) {
      return str.replace(/::/g, '/')
          .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
          .replace(/([a-z\d])([A-Z])/g, '$1_$2')
          .replace(/_/g, '-')
          .toLowerCase();
  }
  /**
   * 返回一个延迟执行的`Promise`，可通过cancel取消此请求
   * @example
   * const waitTask = wait(100)
   * waitTask.cancel(new Error('选择取消此操作'))
   * @export
   * @param {number} ms
   * @param {*} arg
   * @returns {Promise<any>}
   */
  function wait(ms, arg) {
      var cancel;
      var _next = new Promise(function (resolve, reject) {
          var timeoutId = setTimeout(resolve, Math.max(ms, 0), arg);
          cancel = function (reason) {
              clearTimeout(timeoutId);
              reject(reason);
          };
      });
      _next.cancel = cancel;
      return _next;
  }
  var _uid = 0;
  /**
   * 生成下一个全局唯一Id
   * @export
   * @param {string} [prefix=''] 前缀
   * @returns {string}
   */
  function uid(prefix) {
      if (prefix === void 0) { prefix = ''; }
      return "" + prefix + ++_uid;
  }
  /**
   * 生成36位uuid
   * @returns {string}
   */
  function uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0; // eslint-disable-line
          var v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
          return v.toString(16);
      });
  }
  /**
   * 生成随机字符串
   * @param {number} [len=8]
   * @returns {string}
   */
  function randomstr(len) {
      if (len === void 0) { len = 8; }
      var str = '', repeat = Math.ceil(len / 8);
      while (repeat--) {
          str += Math.random().toString(36).slice(2);
      }
      return str.slice(0, len).toUpperCase();
  }

  /**
   * @module sdk
   */
  var ua = navigator.userAgent.toLowerCase();
  /**
   * @const
   * @type {boolean}
   * 是否为移动设备
   */
  var isMobile = !!ua.match(/mobile/);
  /**
   * @const
   * @type {boolean}
   * 是否为ios设备（ipad产品或者iphone）
   */
  var isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
  /**
   * @const
   * @type {boolean}
   * 是否为安卓设备
   */
  var isAndroid = -1 !== ua.indexOf('android');
  /**
   * @const
   * @type {boolean}
   * 是否在微信浏览器中
   */
  var isWechat = -1 !== ua.indexOf('micromessenger');
  var WEBP_SUPPORT_PROMISE;
  /**
   * 检测当前环境是否支持解析webp格式图片
   * @returns {Promise<boolean>}
   */
  function checkSupportWebp() {
      if (!WEBP_SUPPORT_PROMISE) {
          WEBP_SUPPORT_PROMISE = new Promise(function (resolve, reject) {
              var webP = document.createElement('img');
              webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA' + 'iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
              webP.onload = webP.onerror = function () {
                  var WEBP_SUPPORT_FLAG = webP.height === 2;
                  WEBP_SUPPORT_FLAG ? resolve() : reject();
              };
          });
      }
      return WEBP_SUPPORT_PROMISE;
  }

  var global$1 = window;
  var location$1 = global$1.location;
  var document$1 = global$1.document;
  var wx$1 = global$1.wx;
  var fetch$1 = global$1.fetch;
  var WeixinJSBridge$1 = global$1.WeixinJSBridge;
  // 降级访问
  var addEventListener = global$1.addEventListener || (function (evt, callback) { return global$1.attachEvent('on' + evt, callback); });
  var removeEventListener = global$1.removeEventListener;
  var performance$1 = global$1.performance || {};

  /**
   * 监听事件
   * @param {HTMLElement} element
   * @param {string} event
   * @param {EventListener} callback
   * @returns {Function} 解绑函数
   */
  function addListener(element, event, callback) {
      element.addEventListener(event, callback, false);
      return function unbind() {
          element.removeEventListener(event, callback, false);
      };
  }
  var domready = /comp|inter|loaded/.test(document$1.readyState) ? Promise.resolve(true) : new Promise(function (resolve) {
      var onDocumentLoaded = function () {
          unbind1();
          unbind2();
          resolve();
      };
      var unbind1 = addListener(document$1, 'DOMContentLoaded', onDocumentLoaded);
      var unbind2 = addListener(document$1, 'load', onDocumentLoaded);
  });

  /**
   * @const
   * @type {RegExp}
   * @default
   * 是否为http匹配的正则表达式，存在//www.example.com的情况
   */
  var regexHttp = /^(https?:|s?ftp:)?\/\/\S+$/i;
  /**
   * @const
   * @type {RegExp}
   * @default
   * base64匹配的正则表达式
   */
  var regexBase64 = /^data:(.+);base64,/i;
  /**
   * @const
   * @type {RegExp}
   * @default
   * 是否为数字的正则表达式(正数、负数、和小数)
   */
  var regexNumber = /^(\-|\+)?\d+(\.\d+)?$/;
  /**
   * @const
   * @type {RegExp}
   * @default
   * 是否为电话号码的正则表达式
   */
  var regexMobile = /^1[3-9]\d{9}$/;
  /**
   * @const
   * @type {RegExp}
   * @default
   * 是否为中文的正则表达式
   */
  var regexChinese = /^[\u0391-\uFFE5]+$/;
  /**
   * @const
   * @type {RegExp}
   * @default
   * 使用正则匹配和分割目录
   */
  var regexSplitPath = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

  /**
   * @module sdk
   */
  /**
   * 预判目标是否为指定类型，根据toString判断
   * @param {string} type
   * @returns {boolean}
   */
  var is = function (type) {
      return function typeIs(val) {
          return Object.prototype.toString.call(val).toLowerCase() === ("[object " + type + "]").toLowerCase();
      };
  };
  // (type: string) => (val: any) => Object.prototype.toString.call(val).toLowerCase() === `[object ${type}]`.toLowerCase()
  /**
   * 判断目标值类型是否为数组
   * @param {any} arr
   * @returns {boolean}
   */
  var isArray = is('Array');
  /**
   * 判断目标值类型是否为布尔值
   * @param {any} arg
   * @returns {boolean}
   */
  var isBoolean = is('Boolean');
  /**
   * 判断目标值类型是否为null
   * @param {any} arg
   * @returns {boolean}
   */
  var isNull = is('null');
  /**
   * 判断目标值类型是否为null 或者 undefined
   * @param {any} arg
   * @returns {boolean}
   */
  var isNullOrUndefined = function (arg) { return arg == null; };
  /**
   * 判断目标值类型是否为number
   * @param {any} arg
   * @returns {boolean}
   */
  var isNumber = is('number');
  /**
   * 判断目标值类型是否为string
   * @param {any} arg
   * @returns {boolean}
   */
  var isString = is('string');
  /**
   * 判断目标值类型是否为symbol
   * @param {any} arg
   * @returns {boolean}
   */
  var isSymbol = is('symbol');
  /**
   * 判断目标值类型是否为undefined
   * @param {any} arg
   * @returns {boolean}
   */
  var isUndefined = is('undefined');
  /**
   * 判断目标值类型是否为正则表达式
   * @param {any} arg
   * @returns {boolean}
   */
  var isRegExp = is('regexp');
  /**
   * 判断目标值类型是否为对象，排除null
   * @param {any} arg
   * @returns {boolean}
   */
  var isObject = function (arg) { return typeof arg === 'object' && arg !== null; };
  /**
   * 判断目标值类型是否为Date
   * @param {any} arg
   * @returns {boolean}
   */
  var isDate = is('date');
  var _typeError = is('error');
  /**
   * 判断目标值类型是否为Error
   * @param {any} arg
   * @returns {boolean}
   */
  var isError = function (e) { return (isObject(e) && _typeError(e)) || e instanceof Error; };
  /**
   * 判断目标值类型是否为Function
   * @param {any} arg
   * @returns {boolean}
   */
  var isFunction = is('function');
  /**
   * 判断目标值类型是否为Primitive，包含（boolean,number,string,symbol,undefiend,null）
   * @param {any} arg
   * @returns {boolean}
   */
  function isPrimitive(arg) {
      return arg === null ||
          typeof arg === 'boolean' ||
          typeof arg === 'number' ||
          typeof arg === 'string' ||
          typeof arg === 'symbol' || // ES6 symbol
          typeof arg === 'undefined';
  }
  /**
   * hasOwnProperty的快速写法
   * @param {any} obj 目标对象
   * @param {string} prop 属性键名
   * @returns {boolean}
   */
  function isHasOwn(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  /**
   * 值是否为空，空值为 null, undefined, false, '', []
   * @param {any} value
   * @returns {boolean}
   */
  function isEmpty(value) {
      return isNullOrUndefined(value) || value === false || (isString(value) && value === '') || (isArray(value) && !value.length);
  }
  /**
   * 判断一个string是否为有效的http链接
   * @param {string} str 待检测文本
   * @returns {boolean}
   */
  function isHttp(str) {
      return regexHttp.test(str);
  }
  /**
   * 判断字符串是否为base64格式
   * @param {string} string
   * @returns {boolean}
   */
  function isBase64(string) {
      return isString(string) && regexBase64.test(string);
  }
  /**
   * 是否为原生类，用于判断一些原生的属性，如 isNative(window.fetch)
   * @param {any} Ctor
   * @returns {boolean}
   */
  function isNative(Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }
  /**
   * 检测对象是否为window
   * @param {any} obj 等待检测对象
   * @returns {boolean}
   */
  function isWindow(obj) {
      return obj != null && obj == obj.window;
  }
  /**
   * 检测对象是否为Document
   * @param {any} obj 等待检测对象
   * @returns {boolean}
   */
  function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
  }
  /**
   * 检测是否为Promise对象
   * @returns {boolean} 是否为promise
   */
  function isPromise(obj) {
      return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  }
  /**
   * 检测是否为formdata对象
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }
  /**
   * 检测是否为File对象
   * @param {Object} val The value to test
   * @returns {boolean}
   */
  var isFile = is('file');
  /**
   * 检测是否为Bolb对象
   * @param {Object} val The value to test
   * @returns {boolean}
   */
  var isBlob = is('blob');

  /* eslint-disable */
  /**
   * @module sdk
   */
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function (filename) {
      return splitPathRe.exec(filename).slice(1);
  };
  /**
   * 是否为绝对路径
   * @param {string} path 路径名称
   * @returns {boolean}
   */
  function isAbsolute(path) {
      return path.charAt(0) === '/';
  }
  /**
   * 把一个路径或路径片段的序列解析为一个绝对路径
   * @param {string} to 初始路径
   * @param {string} from 相对路径
   * @returns {string}
   */
  function resolvePath() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var resolvedPath = '', resolvedAbsolute = false;
      for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? args[i] : '/';
          if (!path) {
              continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      // Normalize the path
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
          return !!p;
      }), !resolvedAbsolute).join('/');
      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  }
  /**
   * 返回一个 path 的目录名，类似于 Unix 中的 dirname 命令。
   * @example
   * sdk.dirname('/foo/bar/baz/asdf/quux'); // 返回 /foo/bar/baz/asdf
   * @param {string} path
   * @returns {string}
   */
  function dirname(path) {
      var result = splitPath(path), root = result[0], dir = result[1];
      if (!root && !dir) {
          // No dirname whatsoever
          return '.';
      }
      if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
      }
      return root + dir;
  }
  /**
   * 返回一个 path 的最后一部分，类似于 Unix 中的 basename 命令
   * @example
   * sdk.basename('/foo/bar/quux.html'); // 返回 'quux.html'
   * @param {string} path 文件路径
   * @param {string} ext 可选的文件扩展名
   * @returns {string}
   */
  function basename(path, ext) {
      var f = splitPath(path)[2];
      // make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
          f = f.substr(0, f.length - ext.length);
      }
      return f;
  }
  /**
   * 回 path 的扩展名，即从 path 的最后一部分中的最后一个
   * @example
   * sdk.extname('index.html'); // 返回 .html
   * @param {string} path
   * @returns {string}
   */
  function extname(path) {
      return splitPath(path)[3];
  }
  function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
              parts.splice(i, 1);
          }
          else if (last === '..') {
              parts.splice(i, 1);
              up++;
          }
          else if (up) {
              parts.splice(i, 1);
              up--;
          }
      }
      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
          for (; up--; up) {
              parts.unshift('..');
          }
      }
      return parts;
  }
  function filter(xs, f) {
      if (xs.filter)
          return xs.filter(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
          if (f(xs[i], i, xs))
              res.push(xs[i]);
      }
      return res;
  }

  /**
   * @module sdk
   */
  // https://github.com/jashkenas/underscore/blob/master/underscore.js
  /*
  https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
  想象每天上班大厦底下的电梯。把电梯完成一次运送，类比为一次函数的执行和响应。假设电梯有两种运行策略 throttle 和 debounce ，超时设定为15秒，不考虑容量限制。
  throttle 策略的电梯。保证如果电梯第一个人进来后，15秒后准时运送一次，不等待。如果没有人，则待机。
  debounce 策略的电梯。如果电梯里有人进来，等待15秒。如果又人进来，15秒等待重新计时，直到15秒超时，开始运送。
  */
  /**
   * 获取当前时间点的毫秒数
   * @function
   * @returns {number}
   */
  var now = Date.now || function () {
      return new Date().getTime();
  };
  /**
   * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
   *
   * @param  {function}   func      传入函数
   * @param  {number}     wait      表示时间窗口的间隔
   * @return {function}             返回客户调用函数
   */
  function throttle(func, wait) {
      var ctx, args, rtn, timeoutID, last = 0;
      return function throttled() {
          ctx = this;
          args = arguments;
          var delta = now() - last;
          if (!timeoutID)
              if (delta >= wait)
                  call();
              else
                  timeoutID = setTimeout(call, wait - delta);
          return rtn;
      };
      function call() {
          timeoutID = 0;
          last = now();
          rtn = func.apply(ctx, args);
          ctx = null;
          args = null;
      }
  }
  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   *
   * @param  {function} func        传入函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
   * @return {function}             返回客户调用函数
   */
  function debounce(func, wait, immediate) {
      if (wait === void 0) { wait = 100; }
      if (immediate === void 0) { immediate = false; }
      var timeout, args, context, timestamp, result;
      function later() {
          var last = now() - timestamp;
          if (last < wait && last >= 0) {
              timeout = setTimeout(later, wait - last);
          }
          else {
              timeout = null;
              if (!immediate) {
                  result = func.apply(context, args);
                  context = args = null;
              }
          }
      }
      var debounced = function () {
          context = this;
          args = arguments;
          timestamp = now();
          var callNow = immediate && !timeout;
          if (!timeout)
              timeout = setTimeout(later, wait);
          if (callNow) {
              result = func.apply(context, args);
              context = args = null;
          }
          return result;
      };
      debounced.clear = function () {
          if (timeout) {
              clearTimeout(timeout);
              timeout = null;
          }
      };
      debounced.flush = function () {
          if (timeout) {
              result = func.apply(context, args);
              context = args = null;
              clearTimeout(timeout);
              timeout = null;
          }
      };
      return debounced;
  }
  /**
   * 生成min-max之间的小数
   * @example
   * sdk.random(0, 100) // 生成0 - 100之间的整数
   * sdk.random(0, 100) / 100 // 生成 0.00 - 1.00 之间的小数
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns {number}
   */
  function random(min, max) {
      if (max == null) {
          max = min;
          min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
  }
  /**
   * 打乱数组
   *
   * @export
   * @template T
   * @param {T[]} array 需要打乱的数组
   * @returns {T[]} 打乱后的数组
   */
  function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = random(i);
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }
  /**
   * 遍历对象或者数组
   * @param {ArrayOrObject} obj 需要遍历的对象
   * @param {Function} iteratee 回调函数
   * @param {any} context 作用域
   * @returns {ArrayOrObject} 源对象obj
   */
  function each(obj, iteratee, context) {
      // 作用域绑定
      if (context) {
          iteratee = iteratee.bind(context);
      }
      var i, length;
      if (isArray(obj)) {
          for (i = 0, length = obj.length; i < length; i++) {
              iteratee(obj[i], i, obj);
          }
      }
      else {
          var keys = Object.keys(obj);
          for (i = 0, length = keys.length; i < length; i++) {
              iteratee(obj[keys[i]], keys[i], obj);
          }
      }
      return obj;
  }
  /**
   * @example
   * sdk.pick({a: 1, b: 2, c: 3}, ['a', 'b']) // {a: 1, b: 2}
   * sdk.pick({a: 1, b: 2, c: 3}, {a: 'aa', b: 'bb'}) // {aa: 1, bb: 2}
   * @param obj 对象
   * @param map 文本
   */
  function pick(obj, map) {
      var res = {};
      each(map, function (value, key) {
          res[value] = typeof key === 'string' ? obj[key] : obj[value];
      });
      return res;
  }
  /**
   * 创建一个会缓存 func 结果的函数。 如果提供了 hasher，就用 hasher 的返回值作为 key 缓存函数的结果。 默认情况下用第一个参数作为缓存的 key。 func 在调用时 this 会绑定在缓存函数上。
   * @param {any} func 计算函数体
   * @param {any} hasher 可选的函数缓存key
   * @returns {Function}
   */
  function memoize(func, hasher) {
      var memoized = function (key) {
          var cache = memoized.cache;
          var address = '' + (hasher ? hasher.apply(this, arguments) : key);
          if (!cache.has(address))
              cache.set(address, func.apply(this, arguments));
          return cache.get(address);
      };
      memoized.cache = new Map();
      return memoized;
  }

  /**
   * @module sdk
   */
  function encodePrimitive(value) {
      var out = value;
      if (isBoolean(value))
          out = value ? 'true' : 'false';
      // fxied json mode
      else if (isObject(value))
          out = JSON.stringify(value);
      return encodeURIComponent(out);
  }
  /**
   * 通过遍历给定的 obj 对象的自身属性，生成 URL 查询字符串
   * 如果子对象为json格式，将会使用JSON.stringify(value)序列化
   * @example
   * sdk.stringify({name: 'vace', age: 18, json: {a: 1}}) // name=vace&age=18&json={a:1}
   * @param {Object} obj 要序列化成 URL 查询字符串的对象
   * @param {string} sep 用于界定查询字符串中的键值对的子字符串。默认为 '&'
   * @param {string} eq 用于界定查询字符串中的键与值的子字符串。默认为 '='
   * @param {string} name 进一步序列化查询字符串
   * @returns {string}
   */
  function stringify(obj, sep, eq) {
      if (sep === void 0) { sep = '&'; }
      if (eq === void 0) { eq = '='; }
      if (isString(obj))
          return obj;
      var res = [];
      each(obj, function (value, key) { return res.push(key + eq + encodePrimitive(value)); });
      return res.join(sep);
  }
  /**
   * 通过 URL 查询字符串，生成键值格式
   * @example
   * sdk.parse('name=vace&age=18') // {name:'vace', age: '18'}
   * @param {string} qs
   * @param {string} sep 用于界定查询字符串中的键值对的子字符串。默认为 '&'
   * @param {string} eq 用于界定查询字符串中的键与值的子字符串。默认为 '='
   */
  function parse(qs, sep, eq) {
      if (sep === void 0) { sep = '&'; }
      if (eq === void 0) { eq = '='; }
      var obj = {};
      if (typeof qs !== 'string' || !qs) {
          return obj;
      }
      var regexp = /\+/g;
      var qsSplit = qs.split(sep);
      var len = qsSplit.length;
      for (var i = 0; i < len; ++i) {
          var x = qsSplit[i].replace(regexp, '%20'), idx = x.indexOf(eq), kstr, vstr, k, v;
          if (idx >= 0) {
              kstr = x.substr(0, idx);
              vstr = x.substr(idx + 1);
          }
          else {
              kstr = x;
              vstr = '';
          }
          k = decodeURIComponent(kstr);
          v = decodeURIComponent(vstr);
          if (!isHasOwn(obj, k)) {
              obj[k] = v;
          }
          else if (isArray(obj[k])) {
              obj[k].push(v);
          }
          else {
              obj[k] = [obj[k], v];
          }
      }
      return obj;
  }

  var indexMapZh = '秒_分钟_小时_天_周_月_年'.split('_');
  // build-in locales: en & zh_CN
  var zh_CN = function (number, index) {
      if (index === 0)
          return ['刚刚', '片刻后'];
      var unit = indexMapZh[toInt(index / 2)];
      return [number + unit + '前', number + unit + '后'];
  };
  // second, minute, hour, day, week, month, year(365 days)
  var SEC_ARRAY = [60, 60, 24, 7, 365 / 7 / 12, 12];
  var SEC_ARRAY_LEN = 6;
  // change f into int, remove Decimal. just for code compression
  function toInt(f) {
      return Math.floor(f);
  }
  // format the diff second to *** time ago, with setting locale
  function formatDiff(diff) {
      var i = 0;
      var agoin = diff < 0 ? 1 : 0; // timein or timeago
      diff = Math.abs(diff);
      for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++) {
          diff /= SEC_ARRAY[i];
      }
      diff = toInt(diff);
      i *= 2;
      if (diff > (i === 0 ? 9 : 1))
          i += 1;
      return zh_CN(diff, i)[agoin].replace('%s', '' + diff);
  }
  // calculate the diff second between date to be formated an now date.
  /**
   * 美化表示Unix时间戳，注意参数为时间戳
   * @param {number} unixTime 允许`Date`类型参数
   * @returns {string} 美化后的时间描述，如“3小时前”
   */
  function timeago(unixTime) {
      if (unixTime instanceof Date)
          unixTime = unixTime.getTime() / 1000;
      var diff = Date.now() / 1000 - unixTime;
      return formatDiff(diff);
  }
  // 需要替换的正则表达式
  var REPLACE_REGEX = /(Y|M|D|H|I|S|T)/ig;
  /**
   * 格式化时间点
   * @param {number} unixTime  unix时间戳
   * @param {string} [format='Y-M-D H:i:s'] 格式化格式
   * @returns {string} 符合条件的时间点
   */
  function unixFormat(unixTime, format) {
      if (format === void 0) { format = 'Y-M-D H:i:s'; }
      var time = new Date(unixTime * 1000);
      var conf = {
          Y: time.getFullYear(),
          M: pad(time.getMonth() + 1),
          D: pad(time.getDate()),
          H: pad(time.getHours()),
          I: pad(time.getMinutes()),
          S: pad(time.getSeconds()),
          T: time.getTime()
      };
      return format.replace(REPLACE_REGEX, function (key) { return conf[key.toUpperCase()]; });
  }
  function pad(num) {
      return num < 10 ? "0" + num : num.toString();
  }

  /* eslint-disable */
  /**
   * @function
   * @module $
   * @name Event
   * @desc $.Event zepto event插件
   * @see {@link https://zeptojs.bootcss.com/#event|完整文档}
   */
  function install ($) {
    //     Zepto.js
    //     (c) 2010-2016 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    var _zid = 1, undefined$1,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function (obj) { return typeof obj == 'string' },
      handlers = {},
      specialEvents = {},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

    function zid(element) {
      return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
      event = parse(event);
      if (event.ns) var matcher = matcherFor(event.ns);
      return (handlers[zid(element)] || []).filter(function (handler) {
        return handler
          && (!event.e || handler.e == event.e)
          && (!event.ns || matcher.test(handler.ns))
          && (!fn || zid(handler.fn) === zid(fn))
          && (!selector || handler.sel == selector)
      })
    }
    function parse(event) {
      var parts = ('' + event).split('.');
      return { e: parts[0], ns: parts.slice(1).sort().join(' ') }
    }
    function matcherFor(ns) {
      return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eventCapture(handler, captureSetting) {
      return handler.del &&
        (!focusinSupported && (handler.e in focus)) ||
        !!captureSetting
    }

    function realEvent(type) {
      return hover[type] || (focusinSupported && focus[type]) || type
    }

    function add(element, events, fn, customData, selector, delegator, capture) {
      var id = zid(element), set = (handlers[id] || (handlers[id] = []));
      events.split(/\s/).forEach(function (event) {
        if (event == 'ready') return $(document).ready(fn)
        var handler = parse(event);
        handler.fn = fn;
        handler.sel = selector;
        // emulate mouseenter, mouseleave
        if (handler.e in hover) fn = function (e) {
          var related = e.relatedTarget;
          if (!related || (related !== this && !$.contains(this, related)))
            return handler.fn.apply(this, arguments)
        };
        handler.del = delegator;
        var callback = delegator || fn;
        handler.proxy = function (e) {
          e = compatible(e);
          if (e.isImmediatePropagationStopped()) return
          // fixed https://github.com/madrobby/zepto/pull/1319
          e.customData = customData;
          var result = callback.apply(element, e._args == undefined$1 ? [e] : [e].concat(e._args));
          if (result === false) e.preventDefault(), e.stopPropagation();
          return result
        };
        handler.i = set.length;
        set.push(handler);
        if ('addEventListener' in element)
          element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
      });
    }
    function remove(element, events, fn, selector, capture) {
      var id = zid(element)
        ; (events || '').split(/\s/).forEach(function (event) {
          findHandlers(element, event, fn, selector).forEach(function (handler) {
            delete handlers[id][handler.i];
            if ('removeEventListener' in element)
              element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
          });
        });
    }

    $.event = { add: add, remove: remove };

    $.proxy = function (fn, context) {
      var args = (2 in arguments) && slice.call(arguments, 2);
      if (isFunction(fn)) {
        var proxyFn = function () { return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) };
        proxyFn._zid = zid(fn);
        return proxyFn
      } else if (isString(context)) {
        if (args) {
          args.unshift(fn[context], fn);
          return $.proxy.apply(null, args)
        } else {
          return $.proxy(fn[context], fn)
        }
      } else {
        throw new TypeError("expected function")
      }
    };

    $.fn.bind = function (event, data, callback) {
      return this.on(event, data, callback)
    };
    $.fn.unbind = function (event, callback) {
      return this.off(event, callback)
    };
    $.fn.one = function (event, selector, data, callback) {
      return this.on(event, selector, data, callback, 1)
    };

    var returnTrue = function () { return true },
      returnFalse = function () { return false },
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      };

    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event);

        $.each(eventMethods, function (name, predicate) {
          var sourceMethod = source[name];
          event[name] = function () {
            this[predicate] = returnTrue;
            return sourceMethod && sourceMethod.apply(source, arguments)
          };
          event[predicate] = returnFalse;
        });

        try {
          event.timeStamp || (event.timeStamp = Date.now());
        } catch (ignored) { }

        if (source.defaultPrevented !== undefined$1 ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
            source.getPreventDefault && source.getPreventDefault())
          event.isDefaultPrevented = returnTrue;
      }
      return event
    }

    function createProxy(event) {
      var key, proxy = { originalEvent: event };
      for (key in event)
        if (!ignoreProperties.test(key) && event[key] !== undefined$1) proxy[key] = event[key];

      return compatible(proxy, event)
    }

    $.fn.delegate = function (selector, event, callback) {
      return this.on(event, selector, callback)
    };
    $.fn.undelegate = function (selector, event, callback) {
      return this.off(event, selector, callback)
    };

    $.fn.live = function (event, callback) {
      $(document.body).delegate(this.selector, event, callback);
      return this
    };
    $.fn.die = function (event, callback) {
      $(document.body).undelegate(this.selector, event, callback);
      return this
    };

    $.fn.on = function (event, selector, data, callback, one) {
      var autoRemove, delegator, $this = this;
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.on(type, selector, data, fn, one);
        });
        return $this
      }

      if (!isString(selector) && !isFunction(callback) && callback !== false)
        callback = data, data = selector, selector = undefined$1;
      if (callback === undefined$1 || data === false)
        callback = data, data = undefined$1;

      if (callback === false) callback = returnFalse;

      return $this.each(function (_, element) {
        if (one) autoRemove = function (e) {
          remove(element, e.type, callback);
          return callback.apply(this, arguments)
        };

        if (selector) delegator = function (e) {
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match && match !== element) {
            evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element });
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
          }
        };

        add(element, event, callback, data, selector, delegator || autoRemove);
      })
    };
    $.fn.off = function (event, selector, callback) {
      var $this = this;
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.off(type, selector, fn);
        });
        return $this
      }

      if (!isString(selector) && !isFunction(callback) && callback !== false)
        callback = selector, selector = undefined$1;

      if (callback === false) callback = returnFalse;

      return $this.each(function () {
        remove(this, event, callback, selector);
      })
    };

    $.fn.trigger = function (event, args) {
      event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event);
      event._args = args;
      return this.each(function () {
        // handle focus(), blur() by calling them directly
        if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
        // items in the collection might not be DOM elements
        else if ('dispatchEvent' in this) this.dispatchEvent(event);
        else $(this).triggerHandler(event, args);
      })
    };

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function (event, args) {
      var e, result;
      this.each(function (i, element) {
        e = createProxy(isString(event) ? $.Event(event) : event);
        e._args = args;
        e.target = element;
        $.each(findHandlers(element, event.type || event), function (i, handler) {
          result = handler.proxy(e);
          if (e.isImmediatePropagationStopped()) return false
        });
      });
      return result
    }

      // shortcut methods for `.bind(event, fn)` for each event type
      ; ('focusin focusout focus blur load resize scroll unload click dblclick ' +
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
        'change select keydown keypress keyup error').split(' ').forEach(function (event) {
          $.fn[event] = function (callback) {
            return (0 in arguments) ?
              this.bind(event, callback) :
              this.trigger(event)
          };
        });

    $.Event = function (type, props) {
      if (!isString(type)) props = type, type = props.type;
      var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
      if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
      event.initEvent(type, bubbles, true);
      return compatible(event)
    };

  }

  /* eslint-disable */

  /**
   * @function
   * @module $
   * @name Form
   * @desc $.form zepto插件，用于序列化表单输入
   * @see {@link https://zeptojs.bootcss.com/#form|完整文档}
   */
  function install$1 ($) {
    $.fn.serializeArray = function () {
      var name, type, result = [],
        add = function (value) {
          if (value.forEach) return value.forEach(add)
          result.push({ name: name, value: value });
        };
      if (this[0]) $.each(this[0].elements, function (_, field) {
        type = field.type, name = field.name;
        if (name && field.nodeName.toLowerCase() != 'fieldset' &&
          !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
          ((type != 'radio' && type != 'checkbox') || field.checked))
          add($(field).val());
      });
      return result
    };

    $.fn.serialize = function () {
      var result = [];
      this.serializeArray().forEach(function (elm) {
        result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
      });
      return result.join('&')
    };

    $.fn.submit = function (callback) {
      if (0 in arguments) this.bind('submit', callback);
      else if (this.length) {
        var event = $.Event('submit');
        this.eq(0).trigger(event);
        if (!event.isDefaultPrevented()) this.get(0).submit();
      }
      return this
    };
  }

  /* eslint-disable */

  /**
   * @function
   * @module $
   * @name fxMethods
   * @desc $.form fx插件
   * @see {@link https://zeptojs.bootcss.com/#fx_methods|完整文档}
   */
  function install$2 ($) {
    // https://github.com/madrobby/zepto/blob/master/src/fx_methods.js

    var document = window.document,
      origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle;

    function anim(el, speed, opacity, scale, callback) {
      if (typeof speed == 'function' && !callback) callback = speed, speed = undefined;
      var props = { opacity: opacity };
      if (scale) {
        props.scale = scale;
        el.css($.fx.cssPrefix + 'transform-origin', '0 0');
      }
      return el.animate(props, speed, null, callback)
    }

    function hide(el, speed, scale, callback) {
      return anim(el, speed, 0, scale, function () {
        origHide.call($(this));
        callback && callback.call(this);
      })
    }

    $.fn.show = function (speed, callback) {
      origShow.call(this);
      if (speed === undefined) speed = 0;
      else this.css('opacity', 0);
      return anim(this, speed, 1, '1,1', callback)
    };

    $.fn.hide = function (speed, callback) {
      if (speed === undefined) return origHide.call(this)
      else return hide(this, speed, '0,0', callback)
    };

    $.fn.toggle = function (speed, callback) {
      if (speed === undefined || typeof speed == 'boolean')
        return origToggle.call(this, speed)
      else return this.each(function () {
        var el = $(this);
        el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
      })
    };

    $.fn.fadeTo = function (speed, opacity, callback) {
      return anim(this, speed, opacity, null, callback)
    };

    $.fn.fadeIn = function (speed, callback) {
      var target = this.css('opacity');
      if (target > 0) this.css('opacity', 0);
      else target = 1;
      return origShow.call(this).fadeTo(speed, target, callback)
    };

    $.fn.fadeOut = function (speed, callback) {
      return hide(this, speed, null, callback)
    };

    $.fn.fadeToggle = function (speed, callback) {
      return this.each(function () {
        var el = $(this);
        el[
          (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
        ](speed, callback);
      })
    };

  }

  /* eslint-disable */

  /**
   * @function
   * @module $
   * @name Fx
   * @desc $.fx 动画插件
   * @see {@link https://zeptojs.bootcss.com/#fx|完整文档}
   */
  function install$3 ($) {
    // https://github.com/madrobby/zepto/blob/master/src/fx.js
    var prefix = '', eventPrefix,
      vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
      testEl = document.createElement('div'),
      supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
      transform,
      transitionProperty, transitionDuration, transitionTiming, transitionDelay,
      animationName, animationDuration, animationTiming, animationDelay,
      cssReset = {};

    function dasherize(str) { return str.replace(/([A-Z])/g, '-$1').toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

    if (testEl.style.transform === undefined) $.each(vendors, function (vendor, event) {
      if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
        prefix = '-' + vendor.toLowerCase() + '-';
        eventPrefix = event;
        return false
      }
    });

    // small code
    var transition = 'transition';
    var animation = 'animation';

    transform = prefix + 'transform';
    cssReset[transitionProperty = prefix + transition + '-property'] =
      cssReset[transitionDuration = prefix + transition + '-duration'] =
      cssReset[transitionDelay = prefix + transition + '-delay'] =
      cssReset[transitionTiming = prefix + transition + '-timing-function'] =
      cssReset[animationName = prefix + animation + '-name'] =
      cssReset[animationDuration = prefix + animation + '-duration'] =
      cssReset[animationDelay = prefix + animation + '-delay'] =
      cssReset[animationTiming = prefix + animation + '-timing-function'] = '';

    $.fx = {
      off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
      speeds: { _default: 400, fast: 200, slow: 600 },
      cssPrefix: prefix,
      transitionEnd: normalizeEvent('TransitionEnd'),
      animationEnd: normalizeEvent('AnimationEnd')
    };

    $.fn.animate = function (properties, duration, ease, callback, delay) {
      if ($.isFunction(duration))
        callback = duration, ease = undefined, duration = undefined;
      if ($.isFunction(ease))
        callback = ease, ease = undefined;
      if ($.isPlainObject(duration))
        ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration;
      if (duration) duration = (typeof duration == 'number' ? duration :
        ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000;
      if (delay) delay = parseFloat(delay) / 1000;
      return this.anim(properties, duration, ease, callback, delay)
    };

    $.fn.anim = function (properties, duration, ease, callback, delay) {
      var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false;

      if (duration === undefined) duration = $.fx.speeds._default / 1000;
      if (delay === undefined) delay = 0;
      if ($.fx.off) duration = 0;

      if (typeof properties == 'string') {
        // keyframe animation
        cssValues[animationName] = properties;
        cssValues[animationDuration] = duration + 's';
        cssValues[animationDelay] = delay + 's';
        cssValues[animationTiming] = (ease || 'linear');
        endEvent = $.fx.animationEnd;
      } else {
        cssProperties = [];
        // CSS transitions
        for (key in properties)
          if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') ';
          else cssValues[key] = properties[key], cssProperties.push(dasherize(key));

        if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
        if (duration > 0 && typeof properties === 'object') {
          cssValues[transitionProperty] = cssProperties.join(', ');
          cssValues[transitionDuration] = duration + 's';
          cssValues[transitionDelay] = delay + 's';
          cssValues[transitionTiming] = (ease || 'linear');
        }
      }

      wrappedCallback = function (event) {
        if (typeof event !== 'undefined') {
          if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
          $(event.target).unbind(endEvent, wrappedCallback);
        } else
          $(this).unbind(endEvent, wrappedCallback); // triggered by setTimeout

        fired = true;
        $(this).css(cssReset);
        callback && callback.call(this);
      };
      if (duration > 0) {
        this.bind(endEvent, wrappedCallback);
        // transitionEnd is not always firing on older Android phones
        // so make sure it gets fired
        setTimeout(function () {
          if (fired) return
          wrappedCallback.call(that);
        }, ((duration + delay) * 1000) + 25);
      }

      // trigger page reflow so new elements can animate
      this.size() && this.get(0).clientLeft;

      this.css(cssValues);

      if (duration <= 0) setTimeout(function () {
        that.each(function () { wrappedCallback.call(this); });
      }, 0);

      return this
    };

    testEl = null;

  }

  /* eslint-disable */

  /**
   * @deprecated 推荐使用 Hammer.js代替。
   * @function
   * @module $
   * @name Touch
   * @desc $.touch 手势识别插件
   * @see {@link https://zeptojs.bootcss.com/#touch|完整文档}
   */
  function install$4 ($) {
    /**
   * zepto Touch 
   * from: https://github.com/madrobby/zepto/blob/master/src/touch.js
   */


    //     Zepto.js
    //     (c) 2010-2016 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    var touch = {},
      touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
      longTapDelay = 750,
      gesture,
      down, up, move,
      eventMap,
      initialized = false;

    function swipeDirection(x1, x2, y1, y2) {
      return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    function longTap() {
      longTapTimeout = null;
      if (touch.last) {
        touch.el.trigger('longTap');
        touch = {};
      }
    }

    function cancelLongTap() {
      if (longTapTimeout) clearTimeout(longTapTimeout);
      longTapTimeout = null;
    }

    function cancelAll() {
      if (touchTimeout) clearTimeout(touchTimeout);
      if (tapTimeout) clearTimeout(tapTimeout);
      if (swipeTimeout) clearTimeout(swipeTimeout);
      if (longTapTimeout) clearTimeout(longTapTimeout);
      touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
      touch = {};
    }

    function isPrimaryTouch(event) {
      return (event.pointerType == 'touch' ||
        event.pointerType == event.MSPOINTER_TYPE_TOUCH)
        && event.isPrimary
    }

    function isPointerEventType(e, type) {
      return (e.type == 'pointer' + type ||
        e.type.toLowerCase() == 'mspointer' + type)
    }

    // helper function for tests, so they check for different APIs
    function unregisterTouchEvents() {
      if (!initialized) return
      $(document).off(eventMap.down, down)
        .off(eventMap.up, up)
        .off(eventMap.move, move)
        .off(eventMap.cancel, cancelAll);
      $(window).off('scroll', cancelAll);
      cancelAll();
      initialized = false;
    }

    function setup(__eventMap) {
      var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType;

      unregisterTouchEvents();

      eventMap = (__eventMap && ('down' in __eventMap)) ? __eventMap :
        ('ontouchstart' in document ?
          {
            'down': 'touchstart', 'up': 'touchend',
            'move': 'touchmove', 'cancel': 'touchcancel'
          } :
          'onpointerdown' in document ?
            {
              'down': 'pointerdown', 'up': 'pointerup',
              'move': 'pointermove', 'cancel': 'pointercancel'
            } :
            'onmspointerdown' in document ?
              {
                'down': 'MSPointerDown', 'up': 'MSPointerUp',
                'move': 'MSPointerMove', 'cancel': 'MSPointerCancel'
              } : false);

      // No API availables for touch events
      if (!eventMap) {
        // 桌面端部分事件处理
        if ('onclick' in document) {
          var proxyMap = ['doubleTap', 'tap', 'singleTap', 'longTap'];
          proxyMap.forEach(function (eventName) {
            $.fn[eventName] = function (callback) {
              return this.on('click', callback)
            };
          });
        }

        return
      }

      if ('MSGesture' in window) {
        gesture = new MSGesture();
        gesture.target = document.body;

        $(document)
          .bind('MSGestureEnd', function (e) {
            var swipeDirectionFromVelocity =
              e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
            if (swipeDirectionFromVelocity) {
              touch.el.trigger('swipe');
              touch.el.trigger('swipe' + swipeDirectionFromVelocity);
            }
          });
      }

      down = function (e) {
        if ((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0];
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined;
          touch.y2 = undefined;
        }
        now = Date.now();
        delta = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode);
        touchTimeout && clearTimeout(touchTimeout);
        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
        touch.last = now;
        longTapTimeout = setTimeout(longTap, longTapDelay);
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      };

      move = function (e) {
        if ((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0];
        cancelLongTap();
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
      };

      up = function (e) {
        if ((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap();

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
          (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function () {
            if (touch.el) {
              touch.el.trigger('swipe');
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
            }
            touch = {};
          }, 0);

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function () {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap');
              event.cancelTouch = cancelAll;
              // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
              if (touch.el) touch.el.trigger(event);

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap');
                touch = {};
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function () {
                  touchTimeout = null;
                  if (touch.el) touch.el.trigger('singleTap');
                  touch = {};
                }, 250);
              }
            }, 0);
          } else {
            touch = {};
          }
        deltaX = deltaY = 0;
      };

      $(document).on(eventMap.up, up)
        .on(eventMap.down, down)
        .on(eventMap.move, move);

      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      $(document).on(eventMap.cancel, cancelAll);

      // scrolling the window indicates intention of the user
      // to scroll, not tap or swipe, so cancel all ongoing events
      $(window).on('scroll', cancelAll);

      initialized = true;
    }
  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
      'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (eventName) {
        $.fn[eventName] = function (callback) { return this.on(eventName, callback) };
      });

    $.touch = { setup: setup };

    $(document).ready(setup);
  }

  /**
   * @class
   * @name Zepto
   * @classdesc 此插件 全局引入zepto，可通过 `$`,`sdk.$`,`Zepto`的方式获取使用
   * @see {@link https://zeptojs.bootcss.com/|中文文档}
   * @see {@link https://github.com/madrobby/zepto|Github}
   */

  var undefined$1, key, classList, emptyArray = [], concat = emptyArray.concat, filter$1 = emptyArray.filter, slice = emptyArray.slice,
    document$2 = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = ['after', 'prepend', 'before', 'append'],
    table = document$2.createElement('table'),
    tableRow = document$2.createElement('tr'),
    containers = {
      'tr': document$2.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document$2.createElement('div')
    },
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    uniq,
    tempParent = document$2.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray$1 = Array.isArray ||
      function (object) { return object instanceof Array };

  zepto.matches = function (element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.matches || element.webkitMatchesSelector ||
      element.mozMatchesSelector || element.oMatchesSelector ||
      element.matchesSelector;
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent;
    if (temp) (parent = tempParent).appendChild(element);
    match = ~zepto.qsa(parent, selector).indexOf(element);
    temp && tempParent.removeChild(element);
    return match
  };

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || 'object'
  }

  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }

  function likeArray(obj) {
    var length = !!obj && 'length' in obj && obj.length,
      type = exports.$.type(obj);

    return 'function' != type && !isWindow(obj) && (
      'array' == type || length === 0 ||
      (typeof length == 'number' && length > 0 && (length - 1) in obj)
    )
  }

  function compact(array) { return filter$1.call(array, function (item) { return item != null }) }
  function flatten(array) { return array.length > 0 ? exports.$.fn.concat.apply([], array) : array }
  uniq = function (array) { return filter$1.call(array, function (item, idx) { return array.indexOf(item) == idx }) };

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == 'number' && !cssNumber[dasherize(name)]) ? value + 'px' : value
  }

  function defaultDisplay(nodeName) {
    var element, display;
    if (!elementDisplay[nodeName]) {
      element = document$2.createElement(nodeName);
      document$2.body.appendChild(element);
      display = getComputedStyle(element, '').getPropertyValue("display");
      element.parentNode.removeChild(element);
      display == "none" && (display = "block");
      elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      exports.$.map(element.childNodes, function (node) { if (node.nodeType == 1) return node })
  }

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0;
    for (i = 0; i < len; i++) this[i] = dom[i];
    this.length = len;
    this.selector = selector || '';
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overridden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function (html, name, properties) {
    var dom, nodes, container;

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = exports.$(document$2.createElement(RegExp.$1));

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
      if (name === undefined$1) name = fragmentRE.test(html) && RegExp.$1;
      if (!(name in containers)) name = '*';

      container = containers[name];
      container.innerHTML = '' + html;
      dom = exports.$.each(slice.call(container.childNodes), function () {
        container.removeChild(this);
      });
    }

    if (isPlainObject(properties)) {
      nodes = exports.$(dom);
      exports.$.each(properties, function (key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value);
        else nodes.attr(key, value);
      });
    }

    return dom
  };

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overridden in plugins.
  zepto.Z = function (dom, selector) {
    return new Z(dom, selector)
  };

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overridden in plugins.
  zepto.isZ = function (object) {
    return object instanceof zepto.Z
  };

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overridden in plugins.
  zepto.init = function (selector, context) {
    var dom;
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim();
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined$1) return exports.$(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document$2, selector);
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return exports.$(document$2).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray$1(selector)) dom = compact(selector);
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null;
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined$1) return exports.$(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document$2, selector);
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  };

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  exports.$ = function (selector, context) {
    return zepto.init(selector, context)
  };

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray$1(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {};
        if (isArray$1(source[key]) && !isArray$1(target[key]))
          target[key] = [];
        extend(target[key], source[key], deep);
      }
      else if (source[key] !== undefined$1) target[key] = source[key];
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  exports.$.extend = function (target) {
    var deep, args = slice.call(arguments, 1);
    if (typeof target == 'boolean') {
      deep = target;
      target = args.shift();
    }
    args.forEach(function (arg) { extend(target, arg, deep); });
    return target
  };

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overridden in plugins.
  zepto.qsa = function (element, selector) {
    var found,
      maybeID = selector[0] == '#',
      maybeClass = !maybeID && selector[0] == '.',
      nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
      isSimple = simpleSelectorRE.test(nameOnly);
    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
      ((found = element.getElementById(nameOnly)) ? [found] : []) :
      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
        slice.call(
          isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
            maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
              element.getElementsByTagName(selector) : // Or a tag
            element.querySelectorAll(selector) // Or it's not simple, and we need to query all
        )
  };

  function filtered(nodes, selector) {
    return selector == null ? exports.$(nodes) : exports.$(nodes).filter(selector)
  }

  exports.$.contains = document$2.documentElement.contains ?
    function (parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function (parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    };

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value) {
    var klass = node.className || '',
      svg = klass && klass.baseVal !== undefined$1;

    if (value === undefined$1) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value);
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        (value == "false" ? false :
          value == "null" ? null :
            +value + "" == value ? +value :
              /^[\[\{]/.test(value) ? exports.$.parseJSON(value) :
                value)
        : value
    } catch (e) {
      return value
    }
  }

  exports.$.type = type;
  exports.$.isFunction = isFunction;
  exports.$.isWindow = isWindow;
  exports.$.isArray = isArray$1;
  exports.$.isPlainObject = isPlainObject;

  exports.$.isEmptyObject = function (obj) {
    var name;
    for (name in obj) return false
    return true
  };

  exports.$.isNumeric = function (val) {
    var num = Number(val), type = typeof val;
    return val != null && type != 'boolean' &&
      (type != 'string' || val.length) &&
      !isNaN(num) && isFinite(num) || false
  };

  exports.$.inArray = function (elem, array, i) {
    return emptyArray.indexOf.call(array, elem, i)
  };

  exports.$.camelCase = camelize;
  exports.$.trim = function (str) {
    return str == null ? "" : String.prototype.trim.call(str)
  };

  // plugin compatibility
  exports.$.uuid = 0;
  exports.$.support = {};
  exports.$.expr = {};
  exports.$.noop = function () { };

  exports.$.map = function (elements, callback) {
    var value, values = [], i, key;
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i);
        if (value != null) values.push(value);
      }
    else
      for (key in elements) {
        value = callback(elements[key], key);
        if (value != null) values.push(value);
      }
    return flatten(values)
  };

  exports.$.each = function (elements, callback) {
    var i, key;
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  };

  exports.$.grep = function (elements, callback) {
    return filter$1.call(elements, callback)
  };

  if (window.JSON) exports.$.parseJSON = JSON.parse;

  // Populate the class2type map
  exports.$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

  // Define methods that will be available on all
  // Zepto collections
  exports.$.fn = {
    constructor: zepto.Z,
    length: 0,

    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    concat: function () {
      var i, value, args = [];
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i];
        args[i] = zepto.isZ(value) ? value.toArray() : value;
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function (fn) {
      return exports.$(exports.$.map(this, function (el, i) { return fn.call(el, i, el) }))
    },
    slice: function () {
      return exports.$(slice.apply(this, arguments))
    },

    ready: function (callback) {
      // don't use "interactive" on IE <= 10 (it can fired premature)
      if (document$2.readyState === "complete" ||
        (document$2.readyState !== "loading" && !document$2.documentElement.doScroll))
        setTimeout(function () { callback(exports.$); }, 0);
      else {
        var handler = function () {
          document$2.removeEventListener("DOMContentLoaded", handler, false);
          window.removeEventListener("load", handler, false);
          callback(exports.$);
        };
        document$2.addEventListener("DOMContentLoaded", handler, false);
        window.addEventListener("load", handler, false);
      }
      return this
    },
    get: function (idx) {
      return idx === undefined$1 ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function () { return this.get() },
    size: function () {
      return this.length
    },
    remove: function () {
      return this.each(function () {
        if (this.parentNode != null)
          this.parentNode.removeChild(this);
      })
    },
    each: function (callback) {
      emptyArray.every.call(this, function (el, idx) {
        return callback.call(el, idx, el) !== false
      });
      return this
    },
    filter: function (selector) {
      if (isFunction(selector)) return this.not(this.not(selector))
      return exports.$(filter$1.call(this, function (element) {
        return zepto.matches(element, selector)
      }))
    },
    add: function (selector, context) {
      return exports.$(uniq(this.concat(exports.$(selector, context))))
    },
    is: function (selector) {
      return typeof selector == 'string' ? this.length > 0 && zepto.matches(this[0], selector) :
        selector && this.selector == selector.selector
    },
    not: function (selector) {
      var nodes = [];
      if (isFunction(selector) && selector.call !== undefined$1)
        this.each(function (idx) {
          if (!selector.call(this, idx)) nodes.push(this);
        });
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : exports.$(selector);
        this.forEach(function (el) {
          if (excludes.indexOf(el) < 0) nodes.push(el);
        });
      }
      return exports.$(nodes)
    },
    has: function (selector) {
      return this.filter(function () {
        return isObject(selector) ?
          exports.$.contains(this, selector) :
          exports.$(this).find(selector).size()
      })
    },
    eq: function (idx) {
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function () {
      var el = this[0];
      return el && !isObject(el) ? el : exports.$(el)
    },
    last: function () {
      var el = this[this.length - 1];
      return el && !isObject(el) ? el : exports.$(el)
    },
    find: function (selector) {
      var result, $this = this;
      if (!selector) result = exports.$();
      else if (typeof selector == 'object')
        result = exports.$(selector).filter(function () {
          var node = this;
          return emptyArray.some.call($this, function (parent) {
            return exports.$.contains(parent, node)
          })
        });
      else if (this.length == 1) result = exports.$(zepto.qsa(this[0], selector));
      else result = this.map(function () { return zepto.qsa(this, selector) });
      return result
    },
    closest: function (selector, context) {
      var nodes = [], collection = typeof selector == 'object' && exports.$(selector);
      this.each(function (_, node) {
        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
          node = node !== context && !isDocument(node) && node.parentNode;
        if (node && nodes.indexOf(node) < 0) nodes.push(node);
      });
      return exports.$(nodes)
    },
    parents: function (selector) {
      var ancestors = [], nodes = this;
      while (nodes.length > 0)
        nodes = exports.$.map(nodes, function (node) {
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node
          }
        });
      return filtered(ancestors, selector)
    },
    parent: function (selector) {
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function (selector) {
      return filtered(this.map(function () { return children(this) }), selector)
    },
    contents: function () {
      return this.map(function () { return this.contentDocument || slice.call(this.childNodes) })
    },
    siblings: function (selector) {
      return filtered(this.map(function (i, el) {
        return filter$1.call(children(el.parentNode), function (child) { return child !== el })
      }), selector)
    },
    empty: function () {
      return this.each(function () { this.innerHTML = ''; })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function (property) {
      return exports.$.map(this, function (el) { return el[property] })
    },
    show: function () {
      return this.each(function () {
        this.style.display == "none" && (this.style.display = '');
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName);
      })
    },
    replaceWith: function (newContent) {
      return this.before(newContent).remove()
    },
    wrap: function (structure) {
      var func = isFunction(structure);
      if (this[0] && !func)
        var dom = exports.$(structure).get(0),
          clone = dom.parentNode || this.length > 1;

      return this.each(function (index) {
        exports.$(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        );
      })
    },
    wrapAll: function (structure) {
      if (this[0]) {
        exports.$(this[0]).before(structure = exports.$(structure));
        var children;
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first();
        exports.$(structure).append(this);
      }
      return this
    },
    wrapInner: function (structure) {
      var func = isFunction(structure);
      return this.each(function (index) {
        var self = exports.$(this), contents = self.contents(),
          dom = func ? structure.call(this, index) : structure;
        contents.length ? contents.wrapAll(dom) : self.append(dom);
      })
    },
    unwrap: function () {
      this.parent().each(function () {
        exports.$(this).replaceWith(exports.$(this).children());
      });
      return this
    },
    clone: function () {
      return this.map(function () { return this.cloneNode(true) })
    },
    hide: function () {
      return this.css("display", "none")
    },
    toggle: function (setting) {
      return this.each(function () {
        var el = exports.$(this)
          ; (setting === undefined$1 ? el.css("display") == "none" : setting) ? el.show() : el.hide();
      })
    },
    prev: function (selector) { return exports.$(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function (selector) { return exports.$(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function (html) {
      return 0 in arguments ?
        this.each(function (idx) {
          var originHtml = this.innerHTML;
          exports.$(this).empty().append(funcArg(this, html, idx, originHtml));
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function (text) {
      return 0 in arguments ?
        this.each(function (idx) {
          var newText = funcArg(this, text, idx, this.textContent);
          this.textContent = newText == null ? '' : '' + newText;
        }) :
        (0 in this ? this.pluck('textContent').join("") : null)
    },
    attr: function (name, value) {
      var result;
      return (typeof name == 'string' && !(1 in arguments)) ?
        (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined$1) :
        this.each(function (idx) {
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key]);
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
        })
    },
    removeAttr: function (name) {
      return this.each(function () {
      this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
        setAttribute(this, attribute);
      }, this);
      })
    },
    prop: function (name, value) {
      name = propMap[name] || name;
      return (typeof name == 'string' && !(1 in arguments)) ?
        (this[0] && this[0][name]) :
        this.each(function (idx) {
          if (isObject(name)) for (key in name) this[propMap[key] || key] = name[key];
          else this[name] = funcArg(this, value, idx, this[name]);
        })
    },
    removeProp: function (name) {
      name = propMap[name] || name;
      return this.each(function () { delete this[name]; })
    },
    data: function (name, value) {
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName);

      return data !== null ? deserializeValue(data) : undefined$1
    },
    val: function (value) {
      if (0 in arguments) {
        if (value == null) value = "";
        return this.each(function (idx) {
          this.value = funcArg(this, value, idx, this.value);
        })
      } else {
        return this[0] && (this[0].multiple ?
          exports.$(this[0]).find('option').filter(function () { return this.selected }).pluck('value') :
          this[0].value)
      }
    },
    offset: function (coordinates) {
      if (coordinates) return this.each(function (index) {
        var $this = exports.$(this),
          coords = funcArg(this, coordinates, index, $this.offset()),
          parentOffset = $this.offsetParent().offset(),
          props = {
            top: coords.top - parentOffset.top,
            left: coords.left - parentOffset.left
          };

        if ($this.css('position') == 'static') props['position'] = 'relative';
        $this.css(props);
      })
      if (!this.length) return null
      if (document$2.documentElement !== this[0] && !exports.$.contains(document$2.documentElement, this[0]))
        return { top: 0, left: 0 }
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function (property, value) {
      if (arguments.length < 2) {
        var element = this[0];
        if (typeof property == 'string') {
          if (!element) return
          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
        } else if (isArray$1(property)) {
          if (!element) return
          var props = {};
          var computedStyle = getComputedStyle(element, '');
          exports.$.each(property, function (_, prop) {
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop));
          });
          return props
        }
      }

      var css = '';
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function () { this.style.removeProperty(dasherize(property)); });
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value);
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function () { this.style.removeProperty(dasherize(key)); });
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
      }

      return this.each(function () { this.style.cssText += ';' + css; })
    },
    index: function (element) {
      return element ? this.indexOf(exports.$(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function (name) {
      if (!name) return false
      return emptyArray.some.call(this, function (el) {
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function (name) {
      if (!name) return this
      return this.each(function (idx) {
        if (!('className' in this)) return
        classList = [];
        var cls = className(this), newName = funcArg(this, name, idx, cls);
        newName.split(/\s+/g).forEach(function (klass) {
          if (!exports.$(this).hasClass(klass)) classList.push(klass);
        }, this);
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
      })
    },
    removeClass: function (name) {
      return this.each(function (idx) {
        if (!('className' in this)) return
        if (name === undefined$1) return className(this, '')
        classList = className(this);
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
          classList = classList.replace(classRE(klass), " ");
        });
        className(this, classList.trim());
      })
    },
    toggleClass: function (name, when) {
      if (!name) return this
      return this.each(function (idx) {
        var $this = exports.$(this), names = funcArg(this, name, idx, className(this));
        names.split(/\s+/g).forEach(function (klass) {
          (when === undefined$1 ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass);
        });
      })
    },
    scrollTop: function (value) {
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0];
      if (value === undefined$1) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function () { this.scrollTop = value; } :
        function () { this.scrollTo(this.scrollX, value); })
    },
    scrollLeft: function (value) {
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0];
      if (value === undefined$1) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function () { this.scrollLeft = value; } :
        function () { this.scrollTo(value, this.scrollY); })
    },
    position: function () {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top -= parseFloat(exports.$(elem).css('margin-top')) || 0;
      offset.left -= parseFloat(exports.$(elem).css('margin-left')) || 0;

      // Add offsetParent borders
      parentOffset.top += parseFloat(exports.$(offsetParent[0]).css('border-top-width')) || 0;
      parentOffset.left += parseFloat(exports.$(offsetParent[0]).css('border-left-width')) || 0;

      // Subtract the two offsets
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function () {
      return this.map(function () {
        var parent = this.offsetParent || document$2.body;
        while (parent && !rootNodeRE.test(parent.nodeName) && exports.$(parent).css("position") == "static")
          parent = parent.offsetParent;
        return parent
      })
    }
  };

  // for now
  exports.$.fn.detach = exports.$.fn.remove

    // Generate the `width` and `height` functions
    ;['width', 'height'].forEach(function (dimension) {
      var dimensionProperty =
        dimension.replace(/./, function (m) { return m[0].toUpperCase() });

      exports.$.fn[dimension] = function (value) {
        var offset, el = this[0];
        if (value === undefined$1) return isWindow(el) ? el['inner' + dimensionProperty] :
          isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
            (offset = this.offset()) && offset[dimension]
        else return this.each(function (idx) {
          el = exports.$(this);
          el.css(dimension, funcArg(this, value, idx, el[dimension]()));
        })
      };
    });

  function traverseNode(node, fun) {
    fun(node);
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun);
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function (operator, operatorIndex) {
    var inside = operatorIndex % 2; //=> prepend, append

    exports.$.fn[operator] = function () {
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = exports.$.map(arguments, function (arg) {
        var arr = [];
        argType = type(arg);
        if (argType == "array") {
          arg.forEach(function (el) {
            if (el.nodeType !== undefined$1) return arr.push(el)
            else if (exports.$.zepto.isZ(el)) return arr = arr.concat(el.get())
            arr = arr.concat(zepto.fragment(el));
          });
          return arr
        }
        return argType == "object" || arg == null ?
          arg : zepto.fragment(arg)
      }),
        parent, copyByClone = this.length > 1;
      if (nodes.length < 1) return this

      return this.each(function (_, target) {
        parent = inside ? target : target.parentNode;

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
          operatorIndex == 1 ? target.firstChild :
            operatorIndex == 2 ? target :
              null;

        var parentInDocument = exports.$.contains(document$2.documentElement, parent);

        nodes.forEach(function (node) {
          if (copyByClone) node = node.cloneNode(true);
          else if (!parent) return exports.$(node).remove()

          parent.insertBefore(node, target);
          if (parentInDocument) traverseNode(node, function (el) {
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
              (!el.type || el.type === 'text/javascript') && !el.src) {
              var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
              target['eval'].call(target, el.innerHTML);
            }
          });
        });
      })
    };

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    exports.$.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
      exports.$(html)[operator](this);
      return this
    };
  });

  zepto.Z.prototype = Z.prototype = exports.$.fn;

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq;
  zepto.deserializeValue = deserializeValue;
  exports.$.zepto = zepto;

  var Zepto = exports.$;

  // install zepto plugins

  install(Zepto);
  install$1(Zepto);
  install$2(Zepto);
  install$3(Zepto);
  install$4(Zepto);

  // 安装到全局变量
  if (typeof jQuery === 'undefined' && typeof window !== 'undefined') {
    if (!window.Zepto) window.$ = window.Zepto = exports.$;
  }

  var $$1 = exports.$;

  // import EventEmiiter from 'eventemitter3'

  /**
   * @namespace store
   * @desc 本地存储操作库store.js
   */

  /**
   * 设置缓存
   * @memberof store
   * @function set
   * @param {string} key 缓存键名称
   * @param {any} val 设置缓存值
   * @returns {any}
   */

  /**
   * 获取本地缓存
   * @memberof store
   * @function get
   * @param {string} key 缓存键名称
   * @param {any} defaultValue 未命中时的默认返回值
   * @returns {any}
   */

  /**
   * 获取所有的缓存
   * @memberof store
   * @function getAll
   * @returns {Object}
   */

  /**
   * 删除指定缓存
   * @memberof store
   * @function remove
   * @param {string} key 缓存键名称
   * @returns {any}
   */

  /**
   * 清空所有缓存
   * @memberof store
   * @function clear
   * @returns {any}
   */

  /**
   * 是否存在某项缓存
   * @memberof store
   * @function has
   * @param {string} key 缓存键名称
   * @returns {boolean}
   */

  /**
   * 是否存在某项缓存
   * @memberof store
   * @function forEach
   * @param {callback} val 读取所有缓存，并调用回调
   * @returns {boolean}
   */

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  var Method;
  (function (Method) {
      Method["GET"] = "GET";
      Method["DELETE"] = "DELETE";
      Method["HEAD"] = "HEAD";
      Method["OPTIONS"] = "OPTIONS";
      Method["POST"] = "POST";
      Method["PUT"] = "PUT";
      Method["PATCH"] = "PATCH";
  })(Method || (Method = {}));
  var ContentType;
  (function (ContentType) {
      ContentType["UrlEncode"] = "application/x-www-form-urlencoded;charset=utf-8";
      ContentType["JSON"] = "application/json;charset=utf-8";
  })(ContentType || (ContentType = {}));
  var Http = /** @class */ (function () {
      function Http(_option) {
          this.option = Object.assign({}, Http.option, _option);
      }
      Object.defineProperty(Http, "instance", {
          get: function () {
              if (!this._instance) {
                  this._instance = new Http();
              }
              return this._instance;
          },
          enumerable: true,
          configurable: true
      });
      Http.prototype.get = function (url, params) {
          return this.request({ url: url, method: Method.GET, params: params });
      };
      Http.prototype.delete = function (url, params) {
          return this.request({ url: url, method: Method.DELETE, params: params });
      };
      Http.prototype.head = function (url, params) {
          return this.request({ url: url, method: Method.HEAD, params: params });
      };
      Http.prototype.options = function (url, params) {
          return this.request({ url: url, method: Method.OPTIONS, params: params });
      };
      Http.prototype.post = function (url, data) {
          return this.request({ url: url, method: Method.POST, data: data });
      };
      Http.prototype.put = function (url, data) {
          return this.request({ url: url, method: Method.PUT, data: data });
      };
      Http.prototype.patch = function (url, data) {
          return this.request({ url: url, method: Method.PATCH, data: data });
      };
      Http.prototype.request = function (option) {
          var config = Object.assign({}, option, this.option);
          var method = config.method, mode = config.mode, cache = config.cache, credentials = config.credentials, redirect = config.redirect, referrer = config.referrer, baseURL = config.baseURL, timeout = config.timeout, transformRequest = config.transformRequest, transformResponse = config.transformResponse, responseType = config.responseType, validateStatus = config.validateStatus;
          var headers = new Headers(config.headers);
          var url = config.url, params = config.params, data = config.data, body = config.body;
          // get
          if (method === Method.GET || method === Method.HEAD || method === Method.DELETE || method === Method.OPTIONS) {
              body = void 0; // clear body
              if (params) { // 参数组合
                  url += (url.indexOf('?') === -1 ? '?' : '&') + (isString(params) ? params : stringify(params));
              }
          }
          else {
              var StrContentType = 'content-type';
              body = data || body;
              // 根据 content type 处理body
              var contentType = headers.get(StrContentType);
              // 上传文件
              if (isFormData(body)) {
                  headers.delete(StrContentType);
              }
              else if (isString(body)) {
                  contentType = ContentType.UrlEncode;
              }
              else if (isObject(body)) {
                  if (contentType === ContentType.UrlEncode) {
                      body = stringify(body);
                  }
                  else {
                      body = JSON.stringify(body);
                  }
              }
              if (contentType)
                  headers.set(StrContentType, contentType);
          }
          // 设置了根路径
          if (baseURL && !isAbsolute(url) && !isHttp(url)) {
              url = "" + baseURL + url;
          }
          var _option = {
              url: url, method: method, headers: headers, body: body, mode: mode, cache: cache, credentials: credentials, redirect: redirect, referrer: referrer
          };
          // 通过处理函数，返回新的配置文件
          if (typeof transformRequest === 'function') {
              transformRequest.call(this, _option);
          }
          // 解析uri和配置
          var _fetchUri = _option.url, _fetchOptions = __rest(_option
          // TODO timeout
          , ["url"]);
          // TODO timeout
          return fetch(_fetchUri, _fetchOptions).then(function (response) {
              var status = response.status, statusText = response.statusText;
              if (typeof validateStatus === 'function' && !validateStatus(status)) {
                  return Promise.reject(new Error(statusText + " - STATUS: " + status));
              }
              // 自定义处理函数
              if (typeof transformResponse === 'function') {
                  return transformResponse(response);
              }
              // 默认使用指定类型处理
              if (responseType) {
                  return response[responseType]();
              }
              return response;
          });
      };
      Http.option = {
          baseURL: '',
          timeout: 0,
          // headers: {
          //   'X-Requested-With': 'XMLHttpRequest'
          // },
          credentials: 'include',
          // transformRequest: ,
          // transformResponse,
          // params: {},
          // data,
          responseType: 'json',
          validateStatus: function (status) {
              return status >= 200 && status < 300;
          }
      };
      return Http;
  }());

  var assign$1 = make_assign();
  var create = make_create();
  var trim = make_trim();
  var Global = (typeof window !== 'undefined' ? window : commonjsGlobal);

  var util = {
  	assign: assign$1,
  	create: create,
  	trim: trim,
  	bind: bind,
  	slice: slice$1,
  	each: each$1,
  	map: map,
  	pluck: pluck,
  	isList: isList,
  	isFunction: isFunction$1,
  	isObject: isObject$1,
  	Global: Global
  };

  function make_assign() {
  	if (Object.assign) {
  		return Object.assign
  	} else {
  		return function shimAssign(obj, props1, props2, etc) {
  			for (var i = 1; i < arguments.length; i++) {
  				each$1(Object(arguments[i]), function(val, key) {
  					obj[key] = val;
  				});
  			}			
  			return obj
  		}
  	}
  }

  function make_create() {
  	if (Object.create) {
  		return function create(obj, assignProps1, assignProps2, etc) {
  			var assignArgsList = slice$1(arguments, 1);
  			return assign$1.apply(this, [Object.create(obj)].concat(assignArgsList))
  		}
  	} else {
  		var F = function() {}; // eslint-disable-line no-inner-declarations
  		return function create(obj, assignProps1, assignProps2, etc) {
  			var assignArgsList = slice$1(arguments, 1);
  			F.prototype = obj;
  			return assign$1.apply(this, [new F()].concat(assignArgsList))
  		}
  	}
  }

  function make_trim() {
  	if (String.prototype.trim) {
  		return function trim(str) {
  			return String.prototype.trim.call(str)
  		}
  	} else {
  		return function trim(str) {
  			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  		}
  	}
  }

  function bind(obj, fn) {
  	return function() {
  		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
  	}
  }

  function slice$1(arr, index) {
  	return Array.prototype.slice.call(arr, index || 0)
  }

  function each$1(obj, fn) {
  	pluck(obj, function(val, key) {
  		fn(val, key);
  		return false
  	});
  }

  function map(obj, fn) {
  	var res = (isList(obj) ? [] : {});
  	pluck(obj, function(v, k) {
  		res[k] = fn(v, k);
  		return false
  	});
  	return res
  }

  function pluck(obj, fn) {
  	if (isList(obj)) {
  		for (var i=0; i<obj.length; i++) {
  			if (fn(obj[i], i)) {
  				return obj[i]
  			}
  		}
  	} else {
  		for (var key in obj) {
  			if (obj.hasOwnProperty(key)) {
  				if (fn(obj[key], key)) {
  					return obj[key]
  				}
  			}
  		}
  	}
  }

  function isList(val) {
  	return (val != null && typeof val != 'function' && typeof val.length == 'number')
  }

  function isFunction$1(val) {
  	return val && {}.toString.call(val) === '[object Function]'
  }

  function isObject$1(val) {
  	return val && {}.toString.call(val) === '[object Object]'
  }
  var util_1 = util.assign;
  var util_2 = util.create;
  var util_3 = util.trim;
  var util_4 = util.bind;
  var util_5 = util.slice;
  var util_6 = util.each;
  var util_7 = util.map;
  var util_8 = util.pluck;
  var util_9 = util.isList;
  var util_10 = util.isFunction;
  var util_11 = util.isObject;
  var util_12 = util.Global;

  var util$1 = /*#__PURE__*/Object.freeze({
    default: util,
    __moduleExports: util,
    assign: util_1,
    create: util_2,
    trim: util_3,
    bind: util_4,
    slice: util_5,
    each: util_6,
    map: util_7,
    pluck: util_8,
    isList: util_9,
    isFunction: util_10,
    isObject: util_11,
    Global: util_12
  });

  var util$2 = ( util$1 && util ) || util$1;

  var slice$2 = util$2.slice;
  var pluck$1 = util$2.pluck;
  var each$2 = util$2.each;
  var bind$1 = util$2.bind;
  var create$1 = util$2.create;
  var isList$1 = util$2.isList;
  var isFunction$2 = util$2.isFunction;
  var isObject$2 = util$2.isObject;

  var storeEngine = {
  	createStore: createStore
  };

  var storeAPI = {
  	version: '2.0.12',
  	enabled: false,
  	
  	// get returns the value of the given key. If that value
  	// is undefined, it returns optionalDefaultValue instead.
  	get: function(key, optionalDefaultValue) {
  		var data = this.storage.read(this._namespacePrefix + key);
  		return this._deserialize(data, optionalDefaultValue)
  	},

  	// set will store the given value at key and returns value.
  	// Calling set with value === undefined is equivalent to calling remove.
  	set: function(key, value) {
  		if (value === undefined) {
  			return this.remove(key)
  		}
  		this.storage.write(this._namespacePrefix + key, this._serialize(value));
  		return value
  	},

  	// remove deletes the key and value stored at the given key.
  	remove: function(key) {
  		this.storage.remove(this._namespacePrefix + key);
  	},

  	// each will call the given callback once for each key-value pair
  	// in this store.
  	each: function(callback) {
  		var self = this;
  		this.storage.each(function(val, namespacedKey) {
  			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''));
  		});
  	},

  	// clearAll will remove all the stored key-value pairs in this store.
  	clearAll: function() {
  		this.storage.clearAll();
  	},

  	// additional functionality that can't live in plugins
  	// ---------------------------------------------------

  	// hasNamespace returns true if this store instance has the given namespace.
  	hasNamespace: function(namespace) {
  		return (this._namespacePrefix == '__storejs_'+namespace+'_')
  	},

  	// createStore creates a store.js instance with the first
  	// functioning storage in the list of storage candidates,
  	// and applies the the given mixins to the instance.
  	createStore: function() {
  		return createStore.apply(this, arguments)
  	},
  	
  	addPlugin: function(plugin) {
  		this._addPlugin(plugin);
  	},
  	
  	namespace: function(namespace) {
  		return createStore(this.storage, this.plugins, namespace)
  	}
  };

  function _warn() {
  	var _console = (typeof console == 'undefined' ? null : console);
  	if (!_console) { return }
  	var fn = (_console.warn ? _console.warn : _console.log);
  	fn.apply(_console, arguments);
  }

  function createStore(storages, plugins, namespace) {
  	if (!namespace) {
  		namespace = '';
  	}
  	if (storages && !isList$1(storages)) {
  		storages = [storages];
  	}
  	if (plugins && !isList$1(plugins)) {
  		plugins = [plugins];
  	}

  	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '');
  	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null);
  	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/; // alpha-numeric + underscore and dash
  	if (!legalNamespaces.test(namespace)) {
  		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
  	}
  	
  	var _privateStoreProps = {
  		_namespacePrefix: namespacePrefix,
  		_namespaceRegexp: namespaceRegexp,

  		_testStorage: function(storage) {
  			try {
  				var testStr = '__storejs__test__';
  				storage.write(testStr, testStr);
  				var ok = (storage.read(testStr) === testStr);
  				storage.remove(testStr);
  				return ok
  			} catch(e) {
  				return false
  			}
  		},

  		_assignPluginFnProp: function(pluginFnProp, propName) {
  			var oldFn = this[propName];
  			this[propName] = function pluginFn() {
  				var args = slice$2(arguments, 0);
  				var self = this;

  				// super_fn calls the old function which was overwritten by
  				// this mixin.
  				function super_fn() {
  					if (!oldFn) { return }
  					each$2(arguments, function(arg, i) {
  						args[i] = arg;
  					});
  					return oldFn.apply(self, args)
  				}

  				// Give mixing function access to super_fn by prefixing all mixin function
  				// arguments with super_fn.
  				var newFnArgs = [super_fn].concat(args);

  				return pluginFnProp.apply(self, newFnArgs)
  			};
  		},

  		_serialize: function(obj) {
  			return JSON.stringify(obj)
  		},

  		_deserialize: function(strVal, defaultVal) {
  			if (!strVal) { return defaultVal }
  			// It is possible that a raw string value has been previously stored
  			// in a storage without using store.js, meaning it will be a raw
  			// string value instead of a JSON serialized string. By defaulting
  			// to the raw string value in case of a JSON parse error, we allow
  			// for past stored values to be forwards-compatible with store.js
  			var val = '';
  			try { val = JSON.parse(strVal); }
  			catch(e) { val = strVal; }

  			return (val !== undefined ? val : defaultVal)
  		},
  		
  		_addStorage: function(storage) {
  			if (this.enabled) { return }
  			if (this._testStorage(storage)) {
  				this.storage = storage;
  				this.enabled = true;
  			}
  		},

  		_addPlugin: function(plugin) {
  			var self = this;

  			// If the plugin is an array, then add all plugins in the array.
  			// This allows for a plugin to depend on other plugins.
  			if (isList$1(plugin)) {
  				each$2(plugin, function(plugin) {
  					self._addPlugin(plugin);
  				});
  				return
  			}

  			// Keep track of all plugins we've seen so far, so that we
  			// don't add any of them twice.
  			var seenPlugin = pluck$1(this.plugins, function(seenPlugin) {
  				return (plugin === seenPlugin)
  			});
  			if (seenPlugin) {
  				return
  			}
  			this.plugins.push(plugin);

  			// Check that the plugin is properly formed
  			if (!isFunction$2(plugin)) {
  				throw new Error('Plugins must be function values that return objects')
  			}

  			var pluginProperties = plugin.call(this);
  			if (!isObject$2(pluginProperties)) {
  				throw new Error('Plugins must return an object of function properties')
  			}

  			// Add the plugin function properties to this store instance.
  			each$2(pluginProperties, function(pluginFnProp, propName) {
  				if (!isFunction$2(pluginFnProp)) {
  					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
  				}
  				self._assignPluginFnProp(pluginFnProp, propName);
  			});
  		},
  		
  		// Put deprecated properties in the private API, so as to not expose it to accidential
  		// discovery through inspection of the store object.
  		
  		// Deprecated: addStorage
  		addStorage: function(storage) {
  			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])');
  			this._addStorage(storage);
  		}
  	};

  	var store = create$1(_privateStoreProps, storeAPI, {
  		plugins: []
  	});
  	store.raw = {};
  	each$2(store, function(prop, propName) {
  		if (isFunction$2(prop)) {
  			store.raw[propName] = bind$1(store, prop);			
  		}
  	});
  	each$2(storages, function(storage) {
  		store._addStorage(storage);
  	});
  	each$2(plugins, function(plugin) {
  		store._addPlugin(plugin);
  	});
  	return store
  }
  var storeEngine_1 = storeEngine.createStore;

  var storeEngine$1 = /*#__PURE__*/Object.freeze({
    default: storeEngine,
    __moduleExports: storeEngine,
    createStore: storeEngine_1
  });

  var Global$1 = util$2.Global;

  var localStorage_1 = {
  	name: 'localStorage',
  	read: read,
  	write: write,
  	each: each$3,
  	remove: remove,
  	clearAll: clearAll,
  };

  function localStorage() {
  	return Global$1.localStorage
  }

  function read(key) {
  	return localStorage().getItem(key)
  }

  function write(key, data) {
  	return localStorage().setItem(key, data)
  }

  function each$3(fn) {
  	for (var i = localStorage().length - 1; i >= 0; i--) {
  		var key = localStorage().key(i);
  		fn(read(key), key);
  	}
  }

  function remove(key) {
  	return localStorage().removeItem(key)
  }

  function clearAll() {
  	return localStorage().clear()
  }
  var localStorage_2 = localStorage_1.name;
  var localStorage_3 = localStorage_1.read;
  var localStorage_4 = localStorage_1.write;
  var localStorage_5 = localStorage_1.each;
  var localStorage_6 = localStorage_1.remove;
  var localStorage_7 = localStorage_1.clearAll;

  var localStorage$1 = /*#__PURE__*/Object.freeze({
    default: localStorage_1,
    __moduleExports: localStorage_1,
    name: localStorage_2,
    read: localStorage_3,
    write: localStorage_4,
    each: localStorage_5,
    remove: localStorage_6,
    clearAll: localStorage_7
  });

  var Global$2 = util$2.Global;

  var sessionStorage_1 = {
  	name: 'sessionStorage',
  	read: read$1,
  	write: write$1,
  	each: each$4,
  	remove: remove$1,
  	clearAll: clearAll$1
  };

  function sessionStorage() {
  	return Global$2.sessionStorage
  }

  function read$1(key) {
  	return sessionStorage().getItem(key)
  }

  function write$1(key, data) {
  	return sessionStorage().setItem(key, data)
  }

  function each$4(fn) {
  	for (var i = sessionStorage().length - 1; i >= 0; i--) {
  		var key = sessionStorage().key(i);
  		fn(read$1(key), key);
  	}
  }

  function remove$1(key) {
  	return sessionStorage().removeItem(key)
  }

  function clearAll$1() {
  	return sessionStorage().clear()
  }
  var sessionStorage_2 = sessionStorage_1.name;
  var sessionStorage_3 = sessionStorage_1.read;
  var sessionStorage_4 = sessionStorage_1.write;
  var sessionStorage_5 = sessionStorage_1.each;
  var sessionStorage_6 = sessionStorage_1.remove;
  var sessionStorage_7 = sessionStorage_1.clearAll;

  var sessionStorage$1 = /*#__PURE__*/Object.freeze({
    default: sessionStorage_1,
    __moduleExports: sessionStorage_1,
    name: sessionStorage_2,
    read: sessionStorage_3,
    write: sessionStorage_4,
    each: sessionStorage_5,
    remove: sessionStorage_6,
    clearAll: sessionStorage_7
  });

  // cookieStorage is useful Safari private browser mode, where localStorage
  // doesn't work but cookies do. This implementation is adopted from
  // https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage


  var Global$3 = util$2.Global;
  var trim$1 = util$2.trim;

  var cookieStorage = {
  	name: 'cookieStorage',
  	read: read$2,
  	write: write$2,
  	each: each$5,
  	remove: remove$2,
  	clearAll: clearAll$2,
  };

  var doc = Global$3.document;

  function read$2(key) {
  	if (!key || !_has(key)) { return null }
  	var regexpStr = "(?:^|.*;\\s*)" +
  		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
  		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*";
  	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
  }

  function each$5(callback) {
  	var cookies = doc.cookie.split(/; ?/g);
  	for (var i = cookies.length - 1; i >= 0; i--) {
  		if (!trim$1(cookies[i])) {
  			continue
  		}
  		var kvp = cookies[i].split('=');
  		var key = unescape(kvp[0]);
  		var val = unescape(kvp[1]);
  		callback(val, key);
  	}
  }

  function write$2(key, data) {
  	if(!key) { return }
  	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
  }

  function remove$2(key) {
  	if (!key || !_has(key)) {
  		return
  	}
  	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }

  function clearAll$2() {
  	each$5(function(_, key) {
  		remove$2(key);
  	});
  }

  function _has(key) {
  	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
  }
  var cookieStorage_1 = cookieStorage.name;
  var cookieStorage_2 = cookieStorage.read;
  var cookieStorage_3 = cookieStorage.write;
  var cookieStorage_4 = cookieStorage.each;
  var cookieStorage_5 = cookieStorage.remove;
  var cookieStorage_6 = cookieStorage.clearAll;

  var cookieStorage$1 = /*#__PURE__*/Object.freeze({
    default: cookieStorage,
    __moduleExports: cookieStorage,
    name: cookieStorage_1,
    read: cookieStorage_2,
    write: cookieStorage_3,
    each: cookieStorage_4,
    remove: cookieStorage_5,
    clearAll: cookieStorage_6
  });

  // memoryStorage is a useful last fallback to ensure that the store
  // is functions (meaning store.get(), store.set(), etc will all function).
  // However, stored values will not persist when the browser navigates to
  // a new page or reloads the current page.

  var memoryStorage_1 = {
  	name: 'memoryStorage',
  	read: read$3,
  	write: write$3,
  	each: each$6,
  	remove: remove$3,
  	clearAll: clearAll$3,
  };

  var memoryStorage = {};

  function read$3(key) {
  	return memoryStorage[key]
  }

  function write$3(key, data) {
  	memoryStorage[key] = data;
  }

  function each$6(callback) {
  	for (var key in memoryStorage) {
  		if (memoryStorage.hasOwnProperty(key)) {
  			callback(memoryStorage[key], key);
  		}
  	}
  }

  function remove$3(key) {
  	delete memoryStorage[key];
  }

  function clearAll$3(key) {
  	memoryStorage = {};
  }
  var memoryStorage_2 = memoryStorage_1.name;
  var memoryStorage_3 = memoryStorage_1.read;
  var memoryStorage_4 = memoryStorage_1.write;
  var memoryStorage_5 = memoryStorage_1.each;
  var memoryStorage_6 = memoryStorage_1.remove;
  var memoryStorage_7 = memoryStorage_1.clearAll;

  var memoryStorage$1 = /*#__PURE__*/Object.freeze({
    default: memoryStorage_1,
    __moduleExports: memoryStorage_1,
    name: memoryStorage_2,
    read: memoryStorage_3,
    write: memoryStorage_4,
    each: memoryStorage_5,
    remove: memoryStorage_6,
    clearAll: memoryStorage_7
  });

  var engine = ( storeEngine$1 && storeEngine ) || storeEngine$1;

  var require$$0$2 = ( localStorage$1 && localStorage_1 ) || localStorage$1;

  var require$$1 = ( sessionStorage$1 && sessionStorage_1 ) || sessionStorage$1;

  var require$$2 = ( cookieStorage$1 && cookieStorage ) || cookieStorage$1;

  var require$$3 = ( memoryStorage$1 && memoryStorage_1 ) || memoryStorage$1;

  var storages = [
  	require$$0$2, 
  	require$$1, 
  	require$$2, 
  	require$$3,
  ];
  var plugins = [];

  var store_modern = engine.createStore(storages, plugins);

  // 默认的z-index
  var GLOBAL_ZINDEX = 1e5;
  function nextZIndex() {
      return GLOBAL_ZINDEX++;
  }
  function classPrefix(className) {
      if (Array.isArray(className)) {
          return className.filter(function (cn) { return !!cn; }).map(function (cn) { return "_sdk-" + cn; }).join(' ');
      }
      return "_sdk-" + className;
  }
  function createSdkIcon(name) {
      return "<i class=\"_sdkfont _sf-" + name + "\"></i>";
  }
  // helper function
  var createClsElement = function (className, content, tagName) {
      if (tagName === void 0) { tagName = 'div'; }
      return exports.$("<" + tagName + ">").addClass(classPrefix(className)).append(content);
  };
  /**
   * 监听动画完成事件
   * @param $element
   * @param callback
   */
  function onceAnimationEnd($element, callback) {
      var off = exports.$.fx.off;
      // 不支持动画时直接返回执行结果
      if (off) {
          return callback();
      }
      else {
          // zepto.one bind once event
          // fixed andioid 4.4 存在bug，无法触发animationend
          return $element.one('webkitAnimationEnd animationend', callback);
      }
  }
  /**
   * 读取获取元素的配置属性
   * ! 布尔值，+ 数字，? 如果有可能，转换为数字
   * @export
   * @param {HTMLElement} element 元素
   * @param {string[]} attrs 属性表
   */
  function getElementAttrs(element, attrs) {
      var options = {};
      var isHtmlElemnt = element instanceof HTMLElement;
      for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
          var attr = attrs_1[_i];
          var firstTypeChar = attr[0];
          var isBoolean = firstTypeChar === '!';
          var isNumber = firstTypeChar === '+';
          var isAutoCovent = firstTypeChar === '?';
          if (isBoolean || isNumber || isAutoCovent)
              attr = attr.slice(1);
          var value = isHtmlElemnt ? element.getAttribute(attr) : element.attr(attr);
          if (isNullOrUndefined(value)) {
              continue;
          }
          if (isBoolean) {
              value = value !== 'false';
          }
          else if (isNumber) {
              value = parseFloat(value);
          }
          else if (isAutoCovent) {
              if (regexNumber.test(value)) {
                  value = parseFloat(value);
              }
          }
          options[attr] = value;
      }
      return options;
  }
  // 通用错误处理
  function commonResponseReslove(response) {
      if (!response) {
          return Promise.reject(new Error('response data empty'));
      }
      var code = response.code, data = response.data, message = response.message, msg = response.msg;
      if (code) {
          var error = new Error(message || msg);
          error['code'] = code;
          error['data'] = data;
          return Promise.reject(error);
      }
      return Promise.resolve(data);
  }
  function getCurrentHref() {
      return location$1.href.split('#').shift();
  }
  function getCurrentPathFile(filename) {
      if (filename === void 0) { filename = ''; }
      return dirname(location$1.href.split('?').shift()) + '/' + filename;
  }

  // 加载全局设置的配置
  var global$2 = window['_SDK'] || {};
  var config = {
      // analysis,
      service: 'http://127.0.0.1:3000',
      cdn: 'https://5.5u55.cn'
  };
  Object.assign(config, global$2);
  /**
   * 获取service的uri
   * @param {string} name
   * @returns {string}
   */
  function getServiceUri(name) {
      return config.service + "/" + name;
  }

  var md5 = createCommonjsModule(function (module) {
  (function ($) {

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safeAdd (x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff)
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bitRotateLeft (num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt))
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5cmn (q, a, b, x, s, t) {
      return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }
    function md5ff (a, b, c, d, x, s, t) {
      return md5cmn((b & c) | (~b & d), a, b, x, s, t)
    }
    function md5gg (a, b, c, d, x, s, t) {
      return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
    }
    function md5hh (a, b, c, d, x, s, t) {
      return md5cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function md5ii (a, b, c, d, x, s, t) {
      return md5cmn(c ^ (b | ~d), a, b, x, s, t)
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binlMD5 (x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << (len % 32);
      x[((len + 64) >>> 9 << 4) + 14] = len;

      var i;
      var olda;
      var oldb;
      var oldc;
      var oldd;
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;

      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = md5ff(a, b, c, d, x[i], 7, -680876936);
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, x[i], 20, -373897302);
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, x[i], 11, -358537222);
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = md5ii(a, b, c, d, x[i], 6, -198630844);
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
      }
      return [a, b, c, d]
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr (input) {
      var i;
      var output = '';
      var length32 = input.length * 32;
      for (i = 0; i < length32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
      }
      return output
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl (input) {
      var i;
      var output = [];
      output[(input.length >> 2) - 1] = undefined;
      for (i = 0; i < output.length; i += 1) {
        output[i] = 0;
      }
      var length8 = input.length * 8;
      for (i = 0; i < length8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
      }
      return output
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstrMD5 (s) {
      return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstrHMACMD5 (key, data) {
      var i;
      var bkey = rstr2binl(key);
      var ipad = [];
      var opad = [];
      var hash;
      ipad[15] = opad[15] = undefined;
      if (bkey.length > 16) {
        bkey = binlMD5(bkey, key.length * 8);
      }
      for (i = 0; i < 16; i += 1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5c5c5c5c;
      }
      hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex (input) {
      var hexTab = '0123456789abcdef';
      var output = '';
      var x;
      var i;
      for (i = 0; i < input.length; i += 1) {
        x = input.charCodeAt(i);
        output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
      }
      return output
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstrUTF8 (input) {
      return unescape(encodeURIComponent(input))
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function rawMD5 (s) {
      return rstrMD5(str2rstrUTF8(s))
    }
    function hexMD5 (s) {
      return rstr2hex(rawMD5(s))
    }
    function rawHMACMD5 (k, d) {
      return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
    }
    function hexHMACMD5 (k, d) {
      return rstr2hex(rawHMACMD5(k, d))
    }

    function md5 (string, key, raw) {
      if (!key) {
        if (!raw) {
          return hexMD5(string)
        }
        return rawMD5(string)
      }
      if (!raw) {
        return hexHMACMD5(key, string)
      }
      return rawHMACMD5(key, string)
    }

    if (module.exports) {
      module.exports = md5;
    } else {
      $.md5 = md5;
    }
  })(commonjsGlobal);
  });

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var InvalidCharacterError = /** @class */ (function (_super) {
      __extends(InvalidCharacterError, _super);
      function InvalidCharacterError() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return InvalidCharacterError;
  }(Error));
  // base64 to assic
  function btoa(input) {
      var str = String(input);
      for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = ''; 
      // if the next str index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      str.charAt(idx | 0) || (map = '=', idx % 1); 
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
          charCode = str.charCodeAt(idx += 3 / 4);
          if (charCode > 0xFF) {
              throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
          }
          block = block << 8 | charCode;
      }
      return output;
  }
  // decoder
  function atob(input) {
      var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
      if (str.length % 4 == 1) {
          throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = ''; 
      // get next character
      buffer = str.charAt(idx++); 
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
          // try to find character in table (0-63, not found => -1)
          buffer = chars.indexOf(buffer);
      }
      return output;
  }
  // 第三方函数库
  var md5$1 = md5;
  function signature(object, action) {
      if (action === void 0) { action = ''; }
      // 字典排序
      var str = Object.keys(object).sort().map(function (key) {
          var value = object[key];
          return key + "=" + (isObject(value) ? JSON.stringify(value) : value);
      }).join('&');
      var signstr = action + str;
      return md5$1(signstr);
  }
  /**
   * jwt解码，形式如 header.body.signature
   * @export
   * @param {string} token
   * @returns
   */
  function jwtDecode(token) {
      try {
          return _autoJwtDecode(token);
      }
      catch (error) {
          return false;
      }
  }
  function _autoJwtDecode(token) {
      var _a = token.split('.'), body = _a[1];
      body = body.replace(/-/g, '+').replace(/_/g, '/');
      switch (body.length % 4) {
          case 0:
              break;
          case 2:
              body += '==';
              break;
          case 3:
              body += '=';
              break;
      }
      try {
          return JSON.parse(_b64DecodeUnicode(body));
      }
      catch (error) {
          return JSON.parse(atob(body));
      }
  }
  function _b64DecodeUnicode(str) {
      return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
          var code = p.charCodeAt(0).toString(16).toUpperCase();
          if (code.length < 2) {
              code = '0' + code;
          }
          return '%' + code;
      }));
  }

  var _safety = /*#__PURE__*/Object.freeze({
    btoa: btoa,
    atob: atob,
    md5: md5$1,
    signature: signature,
    jwtDecode: jwtDecode
  });

  /**
   * 一个页面一般只有一个应用（可通过`sdk.app`直接获取）
   * @class App
   */
  var App = /** @class */ (function () {
      function App() {
          /** 应用是否启动（调用running(方法)） */
          this.isRunning = false;
          /** 是否已经登陆 */
          this.isLogin = false;
          /**
           * ------------------
           * ---- 全局配置 -----
           * ------------------
           */
          /** 应用的AccessKey缓存名称 */
          this.accessCacheKey = 'AppAccessToken';
          /** 应用APPID */
          this.appid = '';
          /** 应用授权scope */
          this.scope = '';
          /** 应用授权微信appid */
          this.wxappid = '';
          /** 应用jssdk appid */
          this.jsappid = '';
          /** 应用平台ID，用作独立授权作用域 */
          this.plantform = 'wechat';
          /**
           * ------------------
           * ---- 用户信息 -----
           * ------------------
           */
          this.user = {
              id: 0,
          };
          this.jwt = {};
          /**
           * Getters And Setters
           */
          /** 本地存储的accessskey */
          this._accessKey = '';
          var _this = this;
          this.$http = new Http({
              /** 请求时带上appid和authorization */
              transformRequest: function (option) {
                  var _a = option.url.split('?'), host = _a[0], _b = _a[1], queryString = _b === void 0 ? '' : _b;
                  var query = parse(queryString);
                  var appid = _this.appid, accessKey = _this.accessKey;
                  var headers = option.headers;
                  if (!query.appid) {
                      query.appid = appid;
                      option.url = host + "?" + stringify(query);
                  }
                  // 未设置authorization
                  if (accessKey && !headers.has('authorization')) {
                      headers.set('authorization', accessKey);
                  }
                  return option;
              },
              /** 处理header中的authorization */
              transformResponse: function (response) {
                  var authorize = response.headers.get('authorization');
                  if (authorize) {
                      _this.accessKey = authorize;
                  }
                  return response.json().then(commonResponseReslove);
              }
          });
      }
      /** 获取应用实例 */
      App.getInstance = function () {
          if (!this._instance) {
              this._instance = new App();
          }
          return this._instance;
      };
      /**
       * 注册scope处理授权
       * @static
       * @param {string} scope
       * @param {RegisterScopeHandle} handle
       */
      App.registerScope = function (scope, handle) {
          this.scopes[scope] = handle;
      };
      /**
       * 获取scope的授权方式
       * @static
       * @param {string} scope
       * @returns {RegisterScope}
       */
      App.parseScope = function (scope) {
          var parser = this.scopes[scope];
          if (!parser) {
              throw new Error("The scope '" + scope + "' is not registered");
          }
          return parser;
      };
      Object.defineProperty(App.prototype, "accessKey", {
          /** 读取本地的accesskey */
          get: function () {
              return this._accessKey;
          },
          /** 设置accesskey */
          set: function (key) {
              var _this_1 = this;
              if (this._accessKey === key)
                  return;
              // logout
              if (!key) {
                  this.isLogin = false;
                  store_modern.remove(this.accessCacheKey);
                  this._accessKey = '';
                  return;
              }
              // 验证key
              var _a = key.split(' '), authType = _a[0], authBody = _a[1];
              var user = jwtDecode(authBody);
              if (!user) {
                  console.log("decode authorization " + authBody + " failed");
                  return;
              }
              var _b = user, 
              // 应用配置参数
              appid = _b.appid, scope = _b.scope, platform = _b.platform, platformId = _b.platformId, 
              // jwt签名参数
              aud = _b.aud, exp = _b.exp, iat = _b.iat, iss = _b.iss, jti = _b.jti, sub = _b.sub, userinfo = __rest(_b, ["appid", "scope", "platform", "platformId", "aud", "exp", "iat", "iss", "jti", "sub"]);
              var serverId = [appid, scope, platform].join('.');
              var clientId = [this.appid, this.scope, this.plantform].join('.');
              if (serverId !== clientId) {
                  console.log("authorization checked failed " + clientId + " !== " + serverId);
                  return;
              }
              // 存在scope验证结果错误
              if (scope && !App.parseScope(scope).validate.call(this, user)) {
                  console.log("authorization scope validate failed");
                  return;
              }
              this.jwt = { aud: aud, exp: exp, iat: iat, iss: iss, jti: jti, sub: sub };
              // 提前一小时过期
              if (exp && exp < now() / 1000 - 3600) {
                  console.log("authorization is overdue");
                  return;
              }
              /** 验证成功，登陆成功，写入缓存，赋值登陆信息，写到本地 */
              this.isLogin = true;
              this._accessKey = key;
              // 保持响应式
              each(userinfo, function (val, key) { return _this_1.user[key] = val; });
              store_modern.set(this.accessCacheKey, key);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 设置应用配置
       * @param {AppOption} [option={}]
       * @returns {App}
       */
      App.prototype.config = function (option) {
          if (option === void 0) { option = {}; }
          var appid = option.appid, scope = option.scope, wxappid = option.wxappid, jsappid = option.jsappid;
          // 设置参数
          if (appid)
              this.appid = appid;
          if (scope)
              this.scope = scope;
          if (wxappid)
              this.wxappid = wxappid;
          if (jsappid)
              this.jsappid = jsappid;
          // jsappid 默认读取wxappid
          if (!this.jsappid && wxappid) {
              this.jsappid = wxappid;
          }
          return this;
      };
      /**
       * 启动应用（只可调用一次）
       */
      App.prototype.run = function () {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          // 应用已经启动
                          if (this.isRunning) {
                              console.log('App has been launched.');
                              return [2 /*return*/];
                          }
                          // 读取本地缓存的accessKey
                          this.accessKey = store_modern.get(this.accessCacheKey) || '';
                          return [4 /*yield*/, this.login()];
                      case 1: 
                      // 未登录，但设置了scope
                      return [2 /*return*/, _a.sent()];
                  }
              });
          });
      };
      /** 登陆用户 */
      App.prototype.login = function () {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this.isRunning = true;
                          // 已经登陆 或 未设置scope 无需登陆
                          if (this.isLogin || !this.scope) {
                              return [2 /*return*/, this.user];
                          }
                          if (!this.$_tasking) {
                              this.$_tasking = App.parseScope(this.scope).auth(this);
                          }
                          return [4 /*yield*/, this.$_tasking];
                      case 1:
                          _a.sent();
                          return [2 /*return*/, this.user];
                  }
              });
          });
      };
      /** 登出用户，清空ak即可 */
      App.prototype.logout = function () {
          this.$_tasking = void 0; // 清空任务
          this.accessKey = '';
      };
      App.scopes = Object.create(null);
      return App;
  }());
  /**
   * 注册微信授权解析
   * @param {App} app
   * @returns
   */
  function wechatOauthScope(app) {
      return __awaiter(this, void 0, void 0, function () {
          var url, wxappid, scope, $http, _a, host, queryStr, query, uri, response, error_1, newQuery, params, redirect;
          return __generator(this, function (_b) {
              switch (_b.label) {
                  case 0:
                      url = getCurrentHref();
                      wxappid = app.wxappid, scope = app.scope, $http = app.$http;
                      _a = url.split('?'), host = _a[0], queryStr = _a[1];
                      query = parse(queryStr);
                      if (!query.code) return [3 /*break*/, 4];
                      _b.label = 1;
                  case 1:
                      _b.trys.push([1, 3, , 4]);
                      uri = getServiceUri('user/loginwx');
                      return [4 /*yield*/, $http.get(uri, {
                              scope: scope,
                              wxappid: wxappid,
                              code: query.code
                          })];
                  case 2:
                      response = _b.sent();
                      return [2 /*return*/, response];
                  case 3:
                      error_1 = _b.sent();
                      // 微信 40029: invalid code, 40163: code been used
                      if (error_1.code === 40029 || error_1.code === 40163) {
                          delete query.code;
                          delete query.state;
                          newQuery = stringify(query);
                          url = host + (newQuery ? '?' : '') + newQuery;
                      }
                      else {
                          throw error_1;
                      }
                      return [3 /*break*/, 4];
                  case 4:
                      params = {
                          appid: wxappid,
                          redirect_uri: url,
                          response_type: 'code',
                          scope: scope,
                          // 为防止CRSF攻击，后接随机字符串
                          state: wxappid + '.' + randomstr(16)
                      };
                      redirect = "https://open.weixin.qq.com/connect/oauth2/authorize?" + stringify(params) + "#wechat_redirect";
                      if (!!isWechat) return [3 /*break*/, 5];
                      // TODO 不是微信浏览器处理
                      return [2 /*return*/, Promise.reject(new Error('请在微信中访问。'))];
                  case 5:
                      location.replace(redirect);
                      return [4 /*yield*/, wait(500)];
                  case 6: return [2 /*return*/, _b.sent()];
              }
          });
      });
  }
  // 微信：授权处理
  var wechatHandle = {
      auth: wechatOauthScope,
      validate: function (user) {
          return this.wxappid === user.platformId;
      }
  };
  App.registerScope('snsapi_base', wechatHandle);
  App.registerScope('snsapi_userinfo', wechatHandle);

  var Emitter = /** @class */ (function () {
      function Emitter() {
          this.$emitters = Object.create(null);
      }
      Object.defineProperty(Emitter.prototype, "$emitter", {
          // 读取默认的emiiter
          get: function () {
              return this.$emitters['*'] || [];
          },
          enumerable: true,
          configurable: true
      });
      Emitter.prototype.$getEmitter = function (type) {
          var map = this.$emitters;
          var target = map[type];
          if (!target) {
              target = map[type] = [];
          }
          return target;
      };
      /**
             * Register an event handler for the given type.
             *
             * @param  {String} type	Type of event to listen for, or `"*"` for all events
             * @param  {Function} handler Function to call in response to given event
             * @memberOf mitt
             */
      Emitter.prototype.on = function (type, handler) {
          this.$getEmitter(type).push(handler);
          return this;
      };
      /**
       * Remove an event handler for the given type.
       *
       * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
       * @param  {Function} handler Handler function to remove
       * @memberOf mitt
       */
      Emitter.prototype.off = function (type, handler) {
          var list = this.$getEmitter(type);
          if (list.length) {
              list.splice(list.indexOf(handler) >>> 0, 1);
          }
          return this;
      };
      /**
       * Invoke all handlers for the given type.
       * If present, `"*"` handlers are invoked after type-matched handlers.
       *
       * @param {String} type  The event type to invoke
       * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
       * @memberOf mitt
       */
      Emitter.prototype.emit = function (type, a, b) {
          var _this = this;
          var list = _this.$emitters[type];
          if (list) {
              for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                  var handler = list_1[_i];
                  handler.call(_this, a, b);
              }
          }
          return this;
      };
      return Emitter;
  }());

  var config$1 = Object.assign({
      disabled: false,
      maxReportError: 3,
      beforeLoadTime: new Date().getTime(),
      unloadData: ''
  }, config.analysis);
  // 报错处理与上报
  addEventListener('error', function (e) { return error(e.error); }, false);
  // 文档卸载，记录访问时长
  addEventListener('unload', function (e) {
      // 计算页面停留市场
      var stayTime = (now() - config$1.beforeLoadTime) / 1000;
      event('UNLOAD', config$1.unloadData, stayTime);
  }, false);
  var ANA;
  (function (ANA) {
      ANA["APPID"] = "ai";
      ANA["USER_AGENT"] = "ua";
      ANA["PAGE_URL"] = "ul";
      ANA["USER_ID"] = "ui";
      ANA["EVENT_NAME"] = "ev";
      ANA["SEND_DATA"] = "sd";
      ANA["SEND_VALUE"] = "vl";
      ANA["SDK_VERSION"] = "vr";
      ANA["REQEST_NONCE"] = "_n";
      ANA["REQEST_SIGNATURE"] = "_s"; // 此次请求签名
  })(ANA || (ANA = {}));
  function send(event, data, value) {
      if (data === void 0) { data = ''; }
      if (value === void 0) { value = 0; }
      return __awaiter(this, void 0, void 0, function () {
          var _a, app, userId, user, option, image;
          return __generator(this, function (_b) {
              switch (_b.label) {
                  case 0:
                      app = App.getInstance();
                      // 无应用，不发送数据
                      if (!app.appid || config$1.disabled) {
                          return [2 /*return*/, false];
                      }
                      userId = 0;
                      if (!app.isRunning) return [3 /*break*/, 2];
                      return [4 /*yield*/, app.login()];
                  case 1:
                      user = _b.sent();
                      if (user) {
                          userId = user.id;
                      }
                      _b.label = 2;
                  case 2:
                      option = (_a = {},
                          _a[ANA.APPID] = app.appid,
                          _a[ANA.USER_AGENT] = navigator.userAgent,
                          _a[ANA.PAGE_URL] = getCurrentHref(),
                          _a[ANA.USER_ID] = userId,
                          _a[ANA.SDK_VERSION] = '3.0.0',
                          _a[ANA.EVENT_NAME] = event,
                          _a[ANA.SEND_DATA] = data,
                          _a[ANA.SEND_VALUE] = Math.round(value || 0),
                          _a[ANA.REQEST_NONCE] = randomstr(16),
                          _a);
                      option[ANA.REQEST_SIGNATURE] = signature(option);
                      //! 注意：此参数用于去除跨域请求，不参与签名
                      option.cros = 'off';
                      return [4 /*yield*/, domready];
                  case 3:
                      _b.sent();
                      image = new Image();
                      image.src = getServiceUri('analysis/log') + '?' + stringify(option);
                      return [2 /*return*/];
              }
          });
      });
  }
  /**
   * 发送PV记录，记录用户UA、来源记录
   * 根据页面 from 或者 ADTAG 参数统计来源
   * 如：page.html?ADTAG=ali.taobao.browser
   */
  function pv() {
      var params = parse(location$1.search.slice(1));
      var ADTAG = params.ADTAG || params.from;
      var defaultTags = {
          timeline: 'tx.wx.tl',
          groupmessage: 'tx.wx.gm',
          singlemessage: 'tx.wx.sm',
      };
      var timing = performance.timing || {};
      var loadTime = (now() - (timing.fetchStart || config$1.beforeLoadTime)) || 0;
      return send('VIEW', defaultTags[ADTAG] || 'url', loadTime);
  }
  /**
   * 发送自定义事件
   * @param {string} event 自定义事件名称
   * @param {string} [data] 任意数据
   */
  function event(event, data, value) {
      if (!/^\w+$/.test(event)) {
          throw new Error('event must be alphanumeric');
      }
      if (typeof data !== 'string') {
          data = JSON.stringify(data);
      }
      return send(event.toUpperCase(), data, value);
  }
  var _errorReportHistory = [];
  /**
   * 发送错误事件
   * @param {Error} error
   */
  function error(error) {
      // 已经达到最大上报次数
      if (_errorReportHistory.length >= config$1.maxReportError) {
          return false;
      }
      if (!(error instanceof Error)) {
          console.log("error arg must instanceof Error");
          return;
      }
      var errorStack;
      if (error.stack) {
          errorStack = error.stack.split('\n').slice(0, 2).join('');
      }
      else {
          errorStack = error.name + ': ' + error.message;
      }
      // 错误已经上报一次了
      if (_errorReportHistory.indexOf(errorStack) !== -1) {
          return; // ignore
      }
      var errCount = _errorReportHistory.push(errorStack);
      return send('ERROR', errorStack, errCount);
  }

  var _analysis = /*#__PURE__*/Object.freeze({
    config: config$1,
    pv: pv,
    event: event,
    error: error
  });

  /**
   * 默认加载的js api list
   */
  var defaultJsApiList = [
      // 分享
      'updateAppMessageShareData', 'updateTimelineShareData',
      // 常用功能
      'previewImage', 'getNetworkType', 'closeWindow', 'openLocation'
  ];
  var emitter = new Emitter();
  var emit = function (evt, arg, arg2) { return emitter.emit(evt, arg, arg2); };
  var on = function (type, callback) { return emitter.on(type, callback); };
  var _configPromise;
  /**
   * 获取微信签名，一般只用签名一次，不提供appid则从App中读取jsappid
   * @param {WxConfigOption} [option]
   * @returns {Promise<ConfigResponse>}
   */
  function config$2(option) {
      // fetch(url)
      return _configPromise || (_configPromise = new Promise(function (reslove, reject) {
          if (!option) {
              throw new TypeError('Parameters must be present');
          }
          // 非微信浏览器，模拟签名
          if (!isWechat) {
              return wait(100).then(reslove);
          }
          // 不存在appid 时从应用配置中读取
          if (!option.appid) {
              option.appid = App.getInstance().jsappid;
          }
          emit('beforeConfig', option);
          var url = option.url, debug = option.debug, appid = option.appid, jsApiList = option.jsApiList;
          return Http.instance.get(url || getServiceUri('wechat/signature'), {
              appid: appid,
              url: getCurrentHref()
          }).then(commonResponseReslove).then(function (signature) {
              signature.jsApiList = jsApiList || defaultJsApiList;
              signature.debug = !!debug;
              emit('config', signature);
              return new Promise(function (reslove, reject) {
                  wx$1.config(signature);
                  wx$1.ready(function () {
                      emit('ready');
                      reslove();
                  });
                  wx$1.error(function (err) {
                      emit('error', err);
                      reject(err);
                  });
              });
          });
      }));
  }
  /**
   * 用于微信browser中自动播放视频、音频等操作
   * @param {Function} resolve
   */
  function fire(resolve) {
      if ('object' == typeof WeixinJSBridge$1 && isWechat) {
          WeixinJSBridge$1.invoke('getNetworkType', {}, resolve);
      }
      else {
          resolve();
      }
  }
  var SHARE_API;
  (function (SHARE_API) {
      SHARE_API["wxapp"] = "updateAppMessageShareData";
      SHARE_API["timeline"] = "updateTimelineShareData";
  })(SHARE_API || (SHARE_API = {}));
  var _shareMap = new Map();
  var updateShareData = function (shareType, option) {
      var shareApi = SHARE_API[shareType];
      var _a = option.title, title = _a === void 0 ? document.title : _a, _b = option.desc, desc = _b === void 0 ? ' ' : _b, _c = option.link, link = _c === void 0 ? getCurrentHref() : _c, _d = option.imgUrl, imgUrl = _d === void 0 ? '' : _d, _e = option.imgurl, imgurl = _e === void 0 ? '' : _e, _f = option.img, img = _f === void 0 ? '' : _f, success = option.success;
      if (typeof wx$1[shareApi] === 'function') {
          if (!isHttp(link)) {
              link = getCurrentPathFile(link);
          }
          imgUrl = imgUrl || imgurl || img;
          if (!isHttp(imgUrl)) {
              imgUrl = getCurrentPathFile(imgUrl || 'share.jpg');
          }
          var shareSuccessHandle = function () {
              event('SHARE', shareType); // 触发分享
              emit('share', shareType, option);
              if (typeof success === 'function') {
                  success(option);
              }
          };
          option = Object.assign({}, option, { title: title, desc: desc, link: link, imgUrl: imgUrl, success: shareSuccessHandle });
          _shareMap.set(shareType, option);
          wx$1[shareApi](option);
      }
      else {
          throw new Error("ShareType " + shareType + " dose not exist");
      }
  };
  /**
   * 读取/设置 分享参数
   * @param {ShareOption} [option]
   * @returns {Promise<any>}
   */
  function share(option) {
      if (!option) {
          return _shareMap;
      }
      if (!_configPromise) {
          throw new TypeError('Please jssdk.config first before sharing');
      }
      var _a = option.type, type = _a === void 0 ? '*' : _a;
      var globalOption = _shareMap.get('*');
      var oldOption = _shareMap.get(type) || {};
      var newOption = Object.assign({}, globalOption, oldOption, option);
      // 全局配置
      if (type === '*') {
          _shareMap.set(type, newOption);
      }
      return config$2().then(function () {
          emit('updateShare', newOption);
          // 设置所有分享参数
          if (type === '*') {
              updateShareData('wxapp', newOption);
              updateShareData('timeline', newOption);
          }
          else {
              updateShareData(type, newOption);
          }
          return newOption;
      });
  }
  /** 上传图片，并获取base64 */
  function chooseImageBase64() {
      return api('chooseImage', { count: 1, sizeType: ['compressed'] }).then(function (_a) {
          var localId = _a.localIds[0];
          return api('getLocalImgData', { localId: localId }).then(function (_a) {
              var localData = _a.localData;
              var mime = 'image/jpeg';
              // fixed 安卓下的bug
              if (!isBase64(localData)) {
                  return "data:" + mime + ";base64," + localData;
              }
              else {
                  // ios 下会识别 jgp 格式，转换为jpeg
                  return localData.replace('image/jgp', mime);
              }
          });
      });
  }
  /**
   * 预览图片
   * @param {(string | string[])} url 链接列表，支持相对路径
   * @param {number} [index=0] 默认展示索引
   */
  function preview(url, index) {
      if (index === void 0) { index = 0; }
      if (typeof url === 'string')
          url = [url];
      url = url.map(function (u) {
          return isHttp(u) ? u : getCurrentPathFile(u);
      });
      wx$1.previewImage({
          current: url[index],
          urls: url
      });
  }
  /**
   * 使用promise方式调用微信API
   * @param {string} apiName
   * @param {*} [option={}]
   * @returns {Promise<any>}
   */
  function api(apiName, option) {
      if (option === void 0) { option = {}; }
      return new Promise(function (resolve, reject) {
          if (typeof wx$1[apiName] === 'function') {
              option.success = resolve;
              option.fail = reject;
              wx$1[apiName](option);
          }
          else {
              reject(new Error("wx." + apiName + " is not api"));
          }
      });
  }
  if (!isWechat) {
      console.warn('Development 模式，已重写部分函数保证响应');
      var base64Img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      var localId = 'DebugModeMockLocalIdData';
      var serverId = 'DebugModeMockServerIdData';
      var rewriteMap = {
          chooseImage: { localIds: [localId, localId] },
          uploadImage: { serverId: serverId },
          downloadImage: { localId: localId },
          getLocalImgData: { localData: base64Img },
          stopRecord: { localId: localId },
          uploadVoice: { serverId: serverId },
          downloadVoice: { localId: localId },
          translateVoice: { translateResult: 'Debug Mode Translate Voice Text' },
          getNetworkType: { networkType: 'wifi' },
          getLocation: { latitude: 31.813084, longitude: 117.203995, speed: 1, accuracy: 1 },
          scanQRCode: { resultStr: 'Debug Mode ScanQRCode Text' },
          chooseWXPay: { result: 'ok' },
          openAddress: { userName: '收货人姓名', postalCode: '510630', provinceName: '广东省', cityName: '广州市', countryName: '天河区', detailInfo: '详细收货地址信息', nationalCode: '86', telNumber: '18888887777' }
      };
      // console.table(Object.keys(rewriteMap))
      // 重写
      each(rewriteMap, function (val, key) {
          wx$1[key] = function (args) {
              console.log("method rewrite: wx." + key + "(" + JSON.stringify(args) + ")");
              if (args && typeof args.success === 'function') {
                  args.success(val);
              }
              else {
                  console.log('args.success() empty');
              }
          };
      });
  }

  var _jssdk = /*#__PURE__*/Object.freeze({
    defaultJsApiList: defaultJsApiList,
    emitter: emitter,
    on: on,
    config: config$2,
    fire: fire,
    share: share,
    chooseImageBase64: chooseImageBase64,
    preview: preview,
    api: api
  });

  var UiBase = /** @class */ (function (_super) {
      __extends(UiBase, _super);
      function UiBase(option) {
          if (option === void 0) { option = {}; }
          var _this = _super.call(this) || this;
          _this.emitter = null;
          _this.inClassName = classPrefix('fade-in');
          _this.outClassName = classPrefix('fade-out');
          _this.isOpened = false;
          // 合并全局变量
          var id = option.id, className = option.className, theme = option.theme, isAddMask = option.isAddMask;
          var elementId = id || classPrefix(uid());
          _this.id = elementId;
          _this.option = option;
          _this.$root = createClsElement("theme-" + (theme || 'default'))
              .attr('id', elementId)
              .addClass(className || '')
              .css({ zIndex: nextZIndex(), position: 'fixed' });
          // 合并全局变量
          var _a = _this.option, transparent = _a.transparent, maskClose = _a.maskClose;
          _this.$mask = createClsElement('mask')
              .addClass(transparent ? classPrefix('mask-tp') : '')
              .on('click', function () { return maskClose && _this.close(); });
          if (isAddMask) {
              _this.$root.append(_this.$mask);
          }
          return _this;
      }
      UiBase.prototype._releaseCloseTid = function () {
          var _closeTid = this._closeTid;
          if (!isNullOrUndefined(_closeTid)) {
              clearTimeout(_closeTid);
          }
          this._closeTid = null;
      };
      /**
       * 打开弹层
       * @memberof UiBase
       */
      UiBase.prototype.open = function () {
          var _a = this, isOpened = _a.isOpened, _b = _a.option, target = _b.target, duration = _b.duration;
          this.$target = $$1(target);
          if (!isOpened) {
              this._onOpen();
              // auto close
              this._releaseCloseTid();
              if (duration) {
                  var closeTime = duration === true ? UiBase.option.duration : duration;
                  this._closeTid = setTimeout(this.close.bind(this), closeTime);
              }
          }
          return this;
      };
      // 准备打开
      UiBase.prototype._onOpen = function () {
          var _a = this, $target = _a.$target, $root = _a.$root, inClassName = _a.inClassName;
          this.isOpened = true;
          $target.append($root);
          // 监听事件
          onceAnimationEnd($root, this._onOpened.bind(this));
          $root.addClass(inClassName);
          // 渲染结构
          this.emit('open');
      };
      // 打开成功
      UiBase.prototype._onOpened = function () {
          var _a = this, $root = _a.$root, inClassName = _a.inClassName;
          $root.removeClass(inClassName);
          this.emit('opened');
      };
      /**
       * 关闭弹层
       * @memberof UiBase
       */
      UiBase.prototype.close = function () {
          var isOpened = this.isOpened;
          if (isOpened) {
              this._onClose();
              this._releaseCloseTid();
          }
      };
      UiBase.prototype._onClose = function () {
          var _a = this, $root = _a.$root, outClassName = _a.outClassName, onClose = _a.option.onClose;
          this.isOpened = false;
          onceAnimationEnd($root, this._onClosed.bind(this));
          $root.addClass(outClassName);
          this.emit('close');
          // 关闭回调函数
          if (typeof onClose === 'function') {
              onClose.call(this, this);
          }
      };
      UiBase.prototype._onClosed = function () {
          var _a = this, $root = _a.$root, outClassName = _a.outClassName;
          $root.removeClass(outClassName).remove();
          this.emit('closed');
      };
      UiBase.prototype.wait = function (duration) {
          var _this = this;
          var promise = wait(duration, this);
          promise.close = function () { return promise.then(function () { return _this.close(); }); };
          return promise;
      };
      // 默认参数
      UiBase.option = {
          isAddMask: false,
          target: 'body',
          duration: 2500
      };
      return UiBase;
  }(Emitter));

  var UiModal = /** @class */ (function (_super) {
      __extends(UiModal, _super);
      function UiModal(_option) {
          if (_option === void 0) { _option = {}; }
          var _this_1 = _super.call(this, Object.assign({}, UiModal.option, _option)) || this;
          // 挂载
          _this_1.$modal = createClsElement('modal');
          // bind event
          var _this = _this_1;
          _this_1.$root.append(_this_1.$mask).on('click', '.' + classPrefix('modal-button'), function (evt) {
              var _a = _this.option, _b = _a.buttons, buttons = _b === void 0 ? [] : _b, _c = _a.onClick, globalOnClick = _c === void 0 ? noop : _c;
              var _d = buttons[$$1(this).index()] || {}, _e = _d.key, key = _e === void 0 ? '' : _e, _f = _d.onClick, onClick = _f === void 0 ? noop : _f;
              onClick.call(_this, _this, evt); // 响应事件
              globalOnClick.call(_this, key); // 回调全局事件
              _this.emit('click', key); // 触发事件
          });
          _this_1.on('open', _this_1._openHook.bind(_this_1));
          _this_1.on('closed', _this_1._closedHook.bind(_this_1));
          return _this_1;
      }
      Object.defineProperty(UiModal.prototype, "data", {
          // 获取数据
          get: function () {
              var $form = this.$form;
              return $form ? parse($form.serialize()) : {};
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(UiModal.prototype, "value", {
          // prompt 获取数据
          get: function () {
              return this.data.value;
          },
          enumerable: true,
          configurable: true
      });
      // 显示操作loading
      UiModal.prototype.showSpinning = function (message) {
          if (this.$spinning) {
              this.$spinning.remove();
          }
          var $spinning = createClsElement('spinning', createSdkIcon('loading _sdk-rotate'));
          if (message) {
              $spinning.append(createClsElement('spinning-text', message));
          }
          this.$modal.append($spinning);
          this.$spinning = $spinning;
          return this;
      };
      // 隐藏交互loading
      UiModal.prototype.hideSpinning = function () {
          var $spinning = this.$spinning;
          if ($spinning) {
              $spinning.fadeOut(function () { return $spinning.remove(); });
          }
          return this;
      };
      // 准备打开
      UiModal.prototype._openHook = function () {
          var _a = this, $root = _a.$root, $modal = _a.$modal, id = _a.id;
          // 渲染结构
          var _b = this.option, title = _b.title, header = _b.header, content = _b.content, footer = _b.footer, buttons = _b.buttons, inputs = _b.inputs;
          var modalElements = [];
          if (title) {
              modalElements.push(createClsElement('modal-title', title));
          }
          else {
              $modal.addClass(classPrefix('modal-notitle'));
          }
          if (header) {
              modalElements.push(createClsElement('modal-header', header));
          }
          if (content) {
              modalElements.push(createClsElement('modal-content', content));
          }
          // 输入节点渲染
          if (inputs && inputs.length) {
              var tagTextarea = 'textarea';
              var $form = createClsElement('modal-form', '', 'form');
              var dataIndex = 0;
              for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                  var _c = inputs_1[_i];
                  var type = _c.type, label = _c.label, tips = _c.tips, _d = _c.value, value = _d === void 0 ? '' : _d, innerHTML = _c.innerHTML, attrs = __rest(_c, ["type", "label", "tips", "value", "innerHTML"]);
                  var tagName = type !== tagTextarea ? 'input' : tagTextarea;
                  var $input = type === 'custom' ? $$1(innerHTML) : $$1("<" + tagName + ">").attr('type', type || 'text');
                  var inputId = id + "__i" + ++dataIndex;
                  $input.attr('id', inputId).attr(attrs).val(value || '');
                  var labelHtml = label ? "<label for=\"" + inputId + "\">" + (label || '') + " " + (tips ? "<span>" + tips + "</span>" : '') + "</label>" : '';
                  var $inputWrap = createClsElement('modal-iptwrap', labelHtml);
                  var $inputCont = createClsElement('modal-input', $input);
                  $inputWrap.append($inputCont);
                  $form.append($inputWrap);
              }
              modalElements.push($form);
              this.$form = $form;
          }
          if (footer) {
              modalElements.push(createClsElement('modal-footer', footer));
          }
          var buttonsNumber = buttons && buttons.length;
          if (buttons && buttonsNumber) {
              var $buttons = createClsElement('modal-buttons', buttons.map(function (_a) {
                  var href = _a.href, label = _a.label, bold = _a.bold, className = _a.className, color = _a.color;
                  return "<a href=\"" + (href || 'javascript:;') + "\" class=\"" + classPrefix(['modal-button', bold && 'modal-bold', "color-" + (color || 'main')]) + " " + (className || '') + "\">" + label + "</a>";
              }).join('')).addClass(classPrefix('modal-buttons-' + (buttonsNumber > 2 ? 'v' : 'h')));
              modalElements.push($buttons);
              this.$buttons = $buttons;
          }
          // 节点渲染
          for (var _e = 0, modalElements_1 = modalElements; _e < modalElements_1.length; _e++) {
              var $element = modalElements_1[_e];
              $modal.append($element);
          }
          $root.append($modal);
      };
      UiModal.prototype._closedHook = function () {
          this.$modal.html('');
      };
      // 全局配置
      UiModal.option = {
          isAddMask: true,
          theme: 'ios',
          target: 'body',
          onClick: noop
      };
      return UiModal;
  }(UiBase));

  var UiToast = /** @class */ (function (_super) {
      __extends(UiToast, _super);
      /**
       * 组件ID
       * @type {string}
       * @memberof UiModal
       */
      function UiToast(_option) {
          var _this = _super.call(this, Object.assign({}, UiToast.option, _option)) || this;
          _this.inClassName = classPrefix('fade-in');
          _this.outClassName = classPrefix('fade-out');
          _this.$message = createClsElement('toast-message', '');
          _this.$root.addClass(classPrefix('toast')).on('click', function () {
              var _a = _this.option, onClick = _a.onClick, clickClosed = _a.clickClosed;
              if (typeof onClick === 'function') {
                  onClick.call(_this, _this);
              }
              if (clickClosed) {
                  _this.close();
              }
          });
          _this.on('open', _this._openHook.bind(_this));
          _this.on('closed', _this._closedHook.bind(_this));
          return _this;
      }
      // 更新消息内容
      UiToast.prototype.setMessage = function (message) {
          this.$message.html(message).fadeIn();
          return this;
      };
      // 更新图标内容
      UiToast.prototype.setIcon = function (icon) {
          this.$root.find('._sdkfont').removeClass(this.option.icon).addClass(icon);
          return this;
      };
      UiToast.prototype._openHook = function () {
          var _a = this, $root = _a.$root, $message = _a.$message;
          var _b = this.option, icon = _b.icon, message = _b.message;
          if (icon) {
              $root.append(createClsElement('toast-icon', createSdkIcon(icon)));
          }
          $root.append($message.html(message || ''));
      };
      UiToast.prototype._closedHook = function () {
          this.$root.html('');
      };
      // 全局配置
      UiToast.option = {
          target: 'body',
          onClose: noop,
          theme: 'ios',
          isAddMask: false
      };
      return UiToast;
  }(UiBase));

  /**
   * @name Loader#loaders
   * @type {Map}
   * @desc 当前已注册的资源解析器
   */
  var loaders = new Map();
  /**
   * 资源处理类 TODO
   * @class Loader
   * @classdesc 加载资源，以及资源处理器
   * @extends {EventEmitter}
   */
  var Loader = /** @class */ (function (_super) {
      __extends(Loader, _super);
      function Loader() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Loader.registerLoader = registerLoader;
      Loader.loaders = loaders;
      Loader.DEFAULT_TYPE = 'image';
      return Loader;
  }(Emitter));
  /**
   * 注册一个 资源解析器，返回promise 的处理结果，错误时抛出错误对象
   * @name Loader#registerLoader
   * @param {string} type 资源类型名称，默认支持image,json,text,blob,arrayBuffer,object类型
   * @param {Promise<ResourceItem>} adapter
   * @returns {Promise<ResourceItem>}
   */
  function registerLoader(type, adapter) {
      if (!loaders.has(type) && isFunction(adapter)) {
          loaders.set(type, adapter);
          return adapter;
      }
      return loaders.get(type);
  }
  /* 加载图片，图片支持缓存项 */
  registerLoader('image', function loader(resource) {
      return new Promise(function run(resolve, reject) {
          // fixed bug chrome 22 (new Image)
          var image = document.createElement('img');
          var url = resource.url, options = resource.options;
          // 设置跨域
          if (options && options.crossOrigin) {
              image.crossOrigin = 'crossOrigin';
          }
          image.onload = function () {
              resource.width = image.naturalWidth;
              resource.height = image.naturalHeight;
              resolve(resource);
          };
          image.onerror = function () {
              resource.width = resource.height = 0;
              resource.error = new Error('image load error');
              reject(resource);
          };
          resource.image = image;
          image.src = url;
      });
  });
  /* 加载json,text,blob资源 */
  ['json', 'text', 'blob', 'buffer'].forEach(function (type) { return registerLoader(type, function loader(resource) {
      var url = resource.url, options = resource.options;
      return fetch(url, options)
          .then(function (response) {
          return response[type === 'buffer' ? 'arrayBuffer' : type]();
      }).then(function (result) {
          resource[type] = result;
          return resource;
      }, function (err) {
          resource.error = err;
          return Promise.reject(resource);
      });
  }); });
  // object 支持，此时原样返回
  registerLoader('object', function loader(resource) {
      return Promise.resolve(resource);
  });

  /**
   * SVG FILE
   */
  var starLoadingSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"64\" y=\"0\"><path d=\"M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z\" fill=\"#ffb118\"/><path d=\"M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z\" fill=\"#80c141\"/><path d=\"M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z\" fill=\"#cadc28\"/><path d=\"M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z\" fill=\"#cf171f\"/><path d=\"M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z\" fill=\"#ec1b21\"/><path d=\"M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z\" fill=\"#018ed5\"/><path d=\"M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z\" fill=\"#00bbf2\"/><path d=\"M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z\" fill=\"#f8f400\"/><circle cx=\"64\" cy=\"64\" r=\"2.03\"/></svg>";

  var PEvent;
  (function (PEvent) {
      PEvent[PEvent["pause"] = 0] = "pause";
      PEvent[PEvent["playing"] = 1] = "playing";
      PEvent[PEvent["canplay"] = 2] = "canplay";
      PEvent[PEvent["ended"] = 3] = "ended";
      PEvent[PEvent["loading"] = 4] = "loading";
  })(PEvent || (PEvent = {}));
  var createCdnImage = function (type, idx) { return "<img src=\"" + config.cdn + "/_res/music/" + type + "_" + idx + ".svg\" alt=\"" + type + "\">"; };
  var UiMusic = /** @class */ (function (_super) {
      __extends(UiMusic, _super);
      function UiMusic(_option) {
          var _this = _super.call(this) || this;
          // 播放节点是否挂载
          _this.isMounted = false;
          _this._isLoading = false;
          _this._isPlaying = false;
          _this._isPaused = false;
          // 是否能自动播放
          _this.isSupportAutoPlay = false;
          // 根节点
          _this.$root = createClsElement('music');
          _this.$view = createClsElement('music-view');
          // audio 元素
          _this.audio = document.createElement('audio');
          _this.option = Object.assign({}, UiMusic.option, _option);
          var _a = _this, $root = _a.$root, $view = _a.$view, audio = _a.audio, option = _a.option;
          var className = option.className, _b = option.position, position = _b === void 0 ? '' : _b, _c = option.style, style = _c === void 0 ? {} : _c, autoplay = option.autoplay, size = option.size, offsetX = option.offsetX, offsetY = option.offsetY;
          var $loading = _this.$loading = createClsElement('music-loading');
          var $playing = _this.$playing = createClsElement('music-playing');
          var $paused = _this.$paused = createClsElement('music-paused');
          // 图标区域尺寸
          var styleExtends = { width: size, height: size };
          // 图标区域样式附加
          var positionMap = { l: 'left', r: 'right', b: 'bottom', t: 'top' };
          for (var _i = 0, _d = position.split(''); _i < _d.length; _i++) {
              var value = _d[_i];
              var directionAttr = positionMap[value];
              if (directionAttr) {
                  styleExtends[directionAttr] = (value === 'l' || value === 'r') ? offsetX : offsetY;
              }
          }
          position.split('').forEach(function (value) {
              if (positionMap[value]) {
                  styleExtends[positionMap[value]] = (value === 'l' || value === 'r') ? offsetX : offsetY;
              }
          });
          $view.append($loading).append($playing).append($paused);
          $root.css(Object.assign(styleExtends, style))
              .addClass(classPrefix("pos-" + position))
              .addClass(className || '')
              .append($view);
          var _loop_1 = function (eventId) {
              addListener(audio, PEvent[eventId], function (event) { return _this._handleEvent(eventId, event); });
          };
          // 事件代理
          for (var _e = 0, _f = [PEvent.pause, PEvent.playing, PEvent.canplay, PEvent.ended]; _e < _f.length; _e++) {
              var eventId = _f[_e];
              _loop_1(eventId);
          }
          // 自动播放处理
          if (autoplay) {
              _this.load();
          }
          // root click toggle
          _this.$root.on('click', function () {
              var _a = _this, isPaused = _a.isPaused, isPlaying = _a.isPlaying, onClick = _a.option.onClick;
              if (isPaused)
                  _this.play();
              else if (isPlaying)
                  _this.pause();
              if (typeof onClick === 'function') {
                  onClick.call(_this, _this);
              }
          });
          return _this;
      }
      UiMusic.getInstance = function (option) {
          if (!this._instance) {
              this._instance = new UiMusic(option);
          }
          return this._instance;
      };
      UiMusic.registerTheme = function (themeName, adapter) {
          var _adapter;
          if (Array.isArray(adapter)) {
              var playingIndex = adapter[0], pausedIndex = adapter[1];
              _adapter = {
                  playing: createCdnImage('playing', playingIndex),
                  paused: createCdnImage('paused', pausedIndex)
              };
          }
          else {
              _adapter = adapter;
          }
          return this.themes.set(themeName, _adapter);
      };
      Object.defineProperty(UiMusic.prototype, "currentTime", {
          get: function () {
              return this.audio.currentTime;
          },
          // 设置 & 读取播放时间
          set: function (val) {
              this.audio.currentTime = val;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(UiMusic.prototype, "theme", {
          get: function () {
              return UiMusic.themes.get(this.option.theme);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(UiMusic.prototype, "isLoading", {
          get: function () {
              return this._isLoading;
          },
          // 是否加载中
          set: function (val) {
              this._isLoading = val;
              this.$root.toggleClass(classPrefix('music__loading'), val);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(UiMusic.prototype, "isPaused", {
          get: function () {
              return this._isPaused;
          },
          // 是否加载中
          set: function (val) {
              this._isPaused = val;
              this.$root.toggleClass(classPrefix('music__paused'), val);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(UiMusic.prototype, "isPlaying", {
          get: function () {
              return this._isPlaying;
          },
          // 是否加载中
          set: function (val) {
              this._isPlaying = val;
              this.$root.toggleClass(classPrefix('music__playing'), val);
          },
          enumerable: true,
          configurable: true
      });
      // 加载音频
      UiMusic.prototype.load = function (src) {
          var _a = this, option = _a.option, audio = _a.audio;
          var _url = src || option.src;
          // 开始加载
          this._handleEvent(PEvent.loading);
          if (_url) {
              audio.src = _url;
          }
          else {
              throw new TypeError('UiMusic `src` required');
          }
          // 设置audio 属性
          var setting = pick(option, ['autoplay', 'loop', 'muted', 'volume', 'preload']);
          each(setting, function (value, key) { return !isNullOrUndefined(value) && (audio[key] = value); });
      };
      UiMusic.prototype.play = function () {
          this.audio.play();
          return this;
      };
      UiMusic.prototype.pause = function () {
          this.audio.pause();
      };
      // 销毁
      UiMusic.prototype.destory = function () {
          this.pause();
          this.$root.remove();
          this.isMounted = false;
          this.$loading.html('');
          this.$playing.html('');
          this.$paused.html('');
          this.emit('destory');
      };
      // 事件处理
      UiMusic.prototype._handleEvent = function (eventId, event) {
          var _this = this;
          var eventName = PEvent[eventId];
          var _a = this, $root = _a.$root, $loading = _a.$loading, $playing = _a.$playing, $paused = _a.$paused, isMounted = _a.isMounted, _b = _a.option, target = _b.target, optTheme = _b.theme, autoplay = _b.autoplay, theme = _a.theme, audio = _a.audio;
          if (!theme) {
              throw new TypeError("adapter theme: '" + optTheme + "' not exists");
          }
          // 挂载处理
          if (!isMounted) {
              var append = function ($el, content) { return $el.append(typeof content === 'function' ? content.call(_this, _this) : content); };
              this.isMounted = true;
              var loading = theme.loading, playing = theme.playing, paused = theme.paused;
              append($loading, loading || starLoadingSvg);
              append($playing, playing);
              append($paused, paused);
              // dom ready
              $$1(target).append($root);
          }
          if (eventId === PEvent.loading) {
              this.isPlaying = this.isPaused = false;
              this.isLoading = true;
          }
          else if (eventId === PEvent.playing) {
              this.isLoading = this.isPaused = false;
              this.isPlaying = true;
          }
          else if (eventId === PEvent.pause || eventId === PEvent.canplay) {
              this.isLoading = this.isPlaying = false;
              this.isPaused = true;
          }
          // 准备就绪
          if (eventId === PEvent.canplay) {
              // fixed 自动播放未播放，浏览器限制
              if (autoplay && audio.paused) {
                  var trigger = this.play.bind(this);
                  if (isWechat)
                      fire(trigger);
                  else
                      $$1(document).one('click', trigger);
              }
          }
          this.emit(eventName, event);
      };
      UiMusic.option = {
          target: 'body',
          src: 'music.mp3',
          theme: 'default',
          position: 'tr',
          autoplay: true,
          preload: 'auto',
          loop: true,
          muted: false,
          volume: 1,
          offsetX: 16,
          offsetY: 16,
          size: 36
      };
      UiMusic.themes = new Map;
      return UiMusic;
  }(Emitter));
  [
      [19, 1],
      [1, 18], [2, 21], [3, 7], [4, 13], [5, 18], [6, 8],
      [7, 21], [8, 2], [9, 15], [10, 8], [11, 10], [12, 13],
      [13, 7], [14, 7], [15, 7], [16, 6], [17, 18], [18, 20],
      [19, 6], [20, 7], [21, 13], [22, 13], [23, 6], [24, 6],
      [25, 7], [26, 18], [27, 12], [28, 15], [29, 2], [30, 12],
      [31, 3], [32, 5], [33, 7], [34, 14], [35, 11], [36, 15],
      [37, 16], [38, 19], [39, 16], [40, 9], [41, 5], [42, 13],
      [43, 7], [44, 16], [45, 16], [46, 16], [47, 1], [48, 7],
      [49, 18]
  ].forEach(function (value, idx) { return UiMusic.registerTheme(idx ? "theme" + idx : 'default', value); });

  var UiView = /** @class */ (function (_super) {
      __extends(UiView, _super);
      function UiView(_option) {
          var _this = _super.call(this, Object.assign({}, UiView.option, _option)) || this;
          _this.$view = createClsElement('view');
          // icon click event
          _this.$root.append(_this.$view).on('click', '.' + classPrefix('view-icon'), function () {
              var onClick = _this.option.onClick;
              if (typeof onClick === 'function') {
                  onClick.call(_this, _this);
              }
          });
          _this.on('open', _this._openHook.bind(_this));
          return _this;
      }
      UiView.prototype._openHook = function () {
          var $view = this.$view;
          var _a = this.option, type = _a.type, src = _a.src, _b = _a.alt, alt = _b === void 0 ? '' : _b, content = _a.content, icon = _a.icon, isFullScreen = _a.isFullScreen, iconPosition = _a.iconPosition;
          if (type === 'image') {
              $view.append(createClsElement('view-image', undefined, 'img').attr({ src: src, alt: alt }));
          }
          else if (type === 'preloader') {
              $view.append(createClsElement('view-preloader', starLoadingSvg));
          }
          if (content) {
              $view.append(this.setContent(content));
          }
          if (icon) {
              var $icon = createClsElement('view-icon', createSdkIcon(icon)).addClass(classPrefix("pos-" + iconPosition));
              $view.append($icon);
          }
          $view.toggleClass(classPrefix('view-full'), !!isFullScreen);
      };
      // 重新设置内容
      UiView.prototype.setContent = function (content) {
          if (!this.$content) {
              this.$content = createClsElement('view-content');
          }
          return this.$content.html('').append(content).fadeIn();
      };
      UiView.option = {
          isAddMask: true,
          target: 'body',
          iconPosition: 'center',
          // 默认的图标点击事件
          onClick: function () {
              this.close();
          }
      };
      return UiView;
  }(UiBase));

  var closeHelper = function (modal) { return modal.close(); };
  /**
   * 打开一个Modal
   * @param {UiModalOption} option
   * @returns {UiModal}
   */
  function modal(option) {
      return new UiModal(option).open();
  }
  /**
   * 打开一个Alert弹窗
   * @param {(UiAlertOption | string)} option
   * @returns {UiModal}
   */
  function alert$1(option) {
      // 文本处理
      if (typeof option === 'string') {
          option = { content: option };
      }
      var _a = option.okText, label = _a === void 0 ? '确定' : _a, _b = option.ok, onClick = _b === void 0 ? closeHelper : _b, href = option.href;
      option.buttons = [
          { label: label, onClick: onClick, key: 'ok', href: href }
      ];
      return new UiModal(option).open();
  }
  /**
   * 打开一个confirm弹窗
   * @param {UiConfirmOption} option
   * @returns {UiModal}
   */
  function confirm(option) {
      var _a = option.okText, okText = _a === void 0 ? '确定' : _a, _b = option.noText, noText = _b === void 0 ? '取消' : _b, ok = option.ok, no = option.no;
      option.buttons = [
          { label: noText, key: 'no', onClick: no || closeHelper },
          { label: okText, key: 'ok', onClick: ok || closeHelper, bold: true }
      ];
      return new UiModal(option).open();
  }
  /**
   * 打开一个prompt
   * @param {UiPromptOption | string} option
   * @returns {UiModal}
   */
  function prompt(option) {
      if (typeof option === 'string') {
          option = { title: option };
      }
      var defaultValue = option.defaultValue, type = option.type;
      option.inputs = [
          { name: 'value', type: type, value: defaultValue }
      ];
      return confirm(option);
  }
  var _$cacheMapProfile;
  /**
   * 打开自定义输入面板
   * @param {UiUserboxOption} option
   * @returns {UiModal}
   */
  function userbox(option) {
      var profile = option.profile;
      if (!_$cacheMapProfile) {
          _$cacheMapProfile = {
              username: { type: 'text', name: 'username', placeholder: '点击输入姓名', label: '姓名', tips: '请输入您的姓名', min: 2, max: 12 },
              mobile: { type: 'tel', name: 'mobile', placeholder: '点击输入手机号', label: '手机', tips: '请输入11位手机号码', min: 11, max: 11 },
              password: { type: 'password', name: 'password', placeholder: '点击输入密码', label: '密码', tips: '请输入您的密码' },
              address: { type: 'textarea', name: 'address', placeholder: '点击输入地址', label: '地址', tips: '请输入您的联系地址' },
              hidden: { type: 'hidden', name: 'hidden' }
          };
      }
      if (!profile) {
          profile = ['username', 'mobile'];
      }
      var inputs = option.inputs || [];
      each(profile, function (data, index) {
          if (typeof index === 'string') {
              var input = Object.assign({}, _$cacheMapProfile[index]);
              if (isObject(data)) {
                  Object.assign(input, data);
              }
              else {
                  input.value = data;
              }
              inputs.push(input);
          }
          else {
              inputs.push(_$cacheMapProfile[data]);
          }
      });
      option.inputs = inputs;
      return confirm(option);
  }
  function toastWrapper(icon) {
      return function (message, duration, onClose) {
          var option = isObject(message) ? message : { message: message };
          if (icon) {
              option.icon = icon;
          }
          // true 为默认时间
          if (isNumber(duration)) {
              option.duration = duration;
          }
          else if (icon !== 'loading') { // 自动关闭
              option.duration = true;
          }
          if (isFunction(duration)) {
              option.onClose = duration;
          }
          if (isFunction(onClose)) {
              option.onClose = onClose;
          }
          return new UiToast(option).open();
      };
  }
  var toast = toastWrapper();
  var tips = toastWrapper();
  var success = toastWrapper('success');
  var info = toastWrapper('info');
  var warn = toastWrapper('sorry');
  var error$1 = toastWrapper('err');
  var loading = toastWrapper('loading');
  /**
   * 打开自定义view
   * @param {UiViewOption} option
   * @returns {UiView}
   */
  function view(option) {
      return new UiView(option).open();
  }
  /**
   * 预览图片，支持全屏/半屏
   * @param {(UiViewOption | string)} option
   * @param {boolean} [isFullScreen]
   * @returns {UiView}
   */
  function image(option, isFullScreen) {
      if (typeof option === 'string') {
          option = { type: 'image', src: option, isFullScreen: isFullScreen, icon: 'close' };
      }
      else {
          option.type = 'image';
          if (!option.icon) {
              option.icon = 'close';
          }
      }
      return view(option);
  }
  /**
   * 展示全局的加载动画
   * @param {string} [content='请稍后...']
   * @returns {UiView}
   */
  function preloader(content) {
      if (content === void 0) { content = '请稍后...'; }
      return view({ type: 'preloader', content: content });
  }
  /**
   * !注意，一个应用一般只有一个播放器，所以为单例模式
   * 如果需要多个实例，通过 `new ui.UiMusic(option) 创建`
   * @param {(string | UiMusicOption)} option
   * @returns {UiMusic}
   */
  function music(option) {
      if (typeof option === 'string') {
          option = { src: option };
      }
      return UiMusic.getInstance(option);
  }

  var _ui = /*#__PURE__*/Object.freeze({
    modal: modal,
    alert: alert$1,
    confirm: confirm,
    prompt: prompt,
    userbox: userbox,
    toast: toast,
    tips: tips,
    success: success,
    info: info,
    warn: warn,
    error: error$1,
    loading: loading,
    view: view,
    image: image,
    preloader: preloader,
    music: music
  });

  /**
   * 摇一摇
   * @param {Function} callback
   * @returns
   */
  function onShake(callback) {
      if (!('ondevicemotion' in window)) {
          return false;
      }
      var threshold = 15;
      var timeout = 1000;
      var lastTime = 0, lastX, lastY, lastZ, isInited;
      var initClear = function () {
          lastX = lastY = lastZ = 0;
          isInited = false;
      };
      var onDevicemotion = function (e) {
          var _a = e.accelerationIncludingGravity, x = _a.x, y = _a.y, z = _a.z;
          var deltaX = Math.abs(lastX - x);
          var deltaY = Math.abs(lastY - y);
          var deltaZ = Math.abs(lastZ - z);
          // inited
          if (!isInited) {
              lastX = x;
              lastY = y;
              lastZ = z;
              isInited = true;
              return;
          }
          if ((deltaX > threshold && deltaY > threshold) ||
              (deltaY > threshold && deltaZ > threshold) ||
              (deltaZ > threshold && deltaX > threshold)) {
              var difference = now() - lastTime;
              if (difference > timeout) {
                  initClear();
                  callback({ deltaX: deltaX, deltaY: deltaY, deltaZ: deltaZ });
              }
          }
      };
      // 设置默认值
      initClear();
      addEventListener('devicemotion', onDevicemotion, false);
      return function unbind() {
          removeEventListener('devicemotion', onDevicemotion, false);
      };
  }
  /**
   * 读取文件的base64
   * @param {File} inputer
   * @returns {Promise<string>}
   */
  function readAsDataURL(inputer) {
      var fr = new FileReader();
      return new Promise(function (resolve, reject) {
          fr.onload = function () { return resolve(fr.result); };
          fr.onerror = function (e) { return reject(e); };
          fr.readAsDataURL(inputer);
      });
  }
  var $inputHanlde;
  /**
   * 选择某个种类的文件
   * @param {string} [accept='*']
   * @returns {Promise<File>}
   */
  function chooseFile(accept) {
      if (accept === void 0) { accept = '*'; }
      return new Promise(function (resolve, reject) {
          if ($inputHanlde) {
              $inputHanlde.remove();
          }
          $inputHanlde = $("<input id=\"" + uid('_sdk-up-') + "\" style=\"display:none;\" type=\"file\" accept=\"" + accept + "\">");
          $inputHanlde.appendTo('body').trigger('click');
          $inputHanlde.on('change', function () {
              var files = $inputHanlde.prop('files');
              if (files.length) {
                  return resolve(files[0]);
              }
              reject(new Error("select file empty"));
          });
      });
  }
  /**
   * 选择文件并获取base64编码
   * @returns {Promise<string>}
   */
  function chooseImageAsDataURL() {
      return chooseFile('image/*').then(function (file) { return readAsDataURL(file); });
  }
  /**
   * 自动获取图片base64
   * ! 在微信端会使用微信的上传方式，读取base64
   * @returns {Promise<string>}
   */
  function autoGetImageBase64() {
      if (isWechat) {
          return chooseImageBase64();
      }
      return chooseImageAsDataURL().then(function (b) { return b.base64; });
  }

  var _tool = /*#__PURE__*/Object.freeze({
    onShake: onShake,
    readAsDataURL: readAsDataURL,
    chooseFile: chooseFile,
    chooseImageAsDataURL: chooseImageAsDataURL,
    autoGetImageBase64: autoGetImageBase64
  });

  /**
   * 访问服务端的service
   * @param {string} serviceName
   * @param {*} opt
   * @param {('get' | 'post')} [method='get']
   * @returns {Promise<any>}
   */
  function service(serviceName, opt, method) {
      if (method === void 0) { method = 'get'; }
      var api = getServiceUri(serviceName + "?appid=" + App.getInstance().appid);
      return Http.instance[method](api, opt).then(commonResponseReslove);
  }
  /**q
   * 上传base64文件
   * @param {string} base64
   * @returns {Promise<CloudResponse>}
   */
  function upbase64(base64) {
      return service('cloud/upbase64', { base64: base64 }, 'post');
  }
  /**
   * 上传一个文件
   * @param {File} file
   * @returns {Promise<CloudResponse>}
   */
  function upfile(file) {
      var form = new FormData();
      form.append('file', file, file.name);
      return service('cloud/upfile', form, 'post');
  }
  /**
   * 同步文件到cdn
   * @param {string} url
   * @returns {Promise<CloudResponse>}
   */
  function syncurl(url) {
      return service('cloud/syncurl', { url: url });
  }
  /**
   * 同步远程图片
   * @param {string} url
   * @returns {Promise<CloudResponse>}
   */
  function syncimage(url) {
      return service('cloud/syncimage', { url: url });
  }
  /**
   * 同步微信资源文件
   * @param {string} media_id
   * @returns {Promise<CloudResponse>}
   */
  function wxmedia(media_id) {
      return service('cloud/wxmedia', { jsappid: App.getInstance().jsappid, media_id: media_id });
  }
  /**
   * 同步微信资源文件
   * @param {string} key 应用文件存储的key，注意去除前缀
   * @returns {Promise<CloudResponse>}
   */
  function headfile(key) {
      return service('cloud/headfile', { key: key });
  }
  /**
   * 代理转发请求，解决跨域问题
   * @param {ProxyOption} option
   * @returns {Promise<any>}
   */
  function proxy(option) {
      return service('cloud/proxy', option, 'post');
  }
  function amr2mp3(input, kbs) {
      return service('cloud/amr2mp3', { input: input, kbs: kbs }, 'get');
  }

  var _cloud = /*#__PURE__*/Object.freeze({
    service: service,
    upbase64: upbase64,
    upfile: upfile,
    syncurl: syncurl,
    syncimage: syncimage,
    wxmedia: wxmedia,
    headfile: headfile,
    proxy: proxy,
    amr2mp3: amr2mp3
  });

  /**
   * 微信能力
   */
  /**
   * 获取微信账号二维码
   * @param {string} username
   * @returns {string}
   */
  function getQrcode(username) {
      return "https://open.weixin.qq.com/qr/code?username=" + username;
  }
  function subscribeMsg(template_id, scene) {
      if (scene === void 0) { scene = 1; }
      if (!template_id) {
          throw new Error('template_id cannot be empty');
      }
      var app = App.getInstance();
      var _a = getCurrentHref().split('?'), host = _a[0], queryStr = _a[1];
      var _query = parse(queryStr);
      var newquery = {
          action: 'get_confirm',
          appid: app.wxappid,
          scene: scene,
          template_id: template_id,
          redirect_url: getCurrentHref(),
          reserved: randomstr(16)
      };
      // 授权返回
      if (_query.template_id === template_id) {
          return _query;
      }
      else {
          // 消除参数歧义
          each(newquery, function (val, key) { return delete _query[key]; });
          newquery.redirect_url = host + "?" + stringify(_query);
          location$1.replace("https://mp.weixin.qq.com/mp/subscribemsg?" + stringify(newquery) + "#wechat_redirect");
      }
  }
  function shorturl(url) {
      var app = App.getInstance();
      return service('wechat/shorturl', {
          wxappid: app.wxappid,
          url: url || location$1.href
      });
  }

  var _wechat = /*#__PURE__*/Object.freeze({
    getQrcode: getQrcode,
    subscribeMsg: subscribeMsg,
    shorturl: shorturl
  });

  var http = Http.instance;
  var jssdk = _jssdk;
  var cloud = _cloud;
  var analysis = _analysis;
  var ui = _ui;
  var safety = _safety;
  var tool = _tool;
  var app = App.getInstance();
  var wechat = _wechat;

  function initializeApp() {
      var element = $('meta[name="sdk:app"]');
      if (!element.length) {
          return;
      }
      var props = ['appid', 'scope', 'wxappid', 'jsappid'];
      var options = getElementAttrs(element, props);
      App.getInstance().config(options).run();
  }

  function initializeJssdk() {
      var element = $$1('meta[name="sdk:jssdk"]');
      if (!element.length) {
          return;
      }
      var props = ['url', 'api', '!debug'];
      var options = getElementAttrs(element, props);
      if (options.api) {
          var apiList = options.api.split(',');
          options.jsApiList = apiList.concat(defaultJsApiList);
      }
      config$2(options);
      var $shares = $$1('meta[name="sdk:share"]');
      var propsShare = ['type', 'title', 'desc', 'link', 'img', 'imgUrl'];
      $shares.each(function (index, element) {
          var options = getElementAttrs($$1(element), propsShare);
          share(options);
      });
  }

  function initializeScript () {
      var doc = document;
      var js = doc.scripts;
      // 当前的script
      var script = js[js.length - 1];
      var _a = getElementAttrs(script, ['!debug', '!autocss']), debug = _a.debug, autocss = _a.autocss;
      var path = dirname(script.src) + '/';
      // debug 工具
      if (debug) {
          var injectScript = doc.createElement('script');
          injectScript.src = '//5.5u55.cn/_lib/eruda/1.5.4/eruda.min.js';
          doc.body.appendChild(injectScript);
          injectScript.onload = function () { return (window['eruda']).init(); };
      }
      // 自动加载css
      if (autocss) {
          var link = doc.createElement('link');
          link.href = path + 'sdk.css';
          link.type = 'text/css';
          link.rel = 'stylesheet';
          link.id = '_sdk-style';
          doc.head.appendChild(link);
      }
  }

  function initializeMusic () {
      var element = $$1('meta[name="sdk:music"]');
      if (!element.length) {
          return;
      }
      var props = [
          'target', 'src', 'className', 'theme', 'position', '!autoplay', '!loop', '!muted', '+volume', 'preload', '?size', '?offsetX', '?offsetY'
      ];
      var options = getElementAttrs(element, props);
      return UiMusic.getInstance(options);
  }

  initializeApp();
  initializeScript();
  initializeJssdk();
  pv(); // 发送pv日志
  domready.then(function () {
      initializeMusic();
  });
  // $(() => { initializeMusic() })

  /**
   * 补丁：
   * Array.prototype.find
   * Array.prototype.some
   * Object.assign
   * fetch
   * Promise
   * wx, jWeixin
   * requestAnimationFrame, cancelAnimationFrame
   * Map, Set, WeakMap, WeakSet
   */
  /**
   * 版本号
   */
  var version = '3.0.0';

  exports.version = version;
  exports.camelize = camelize;
  exports.noop = noop;
  exports.dasherize = dasherize;
  exports.wait = wait;
  exports.uid = uid;
  exports.uuid = uuid;
  exports.randomstr = randomstr;
  exports.isMobile = isMobile;
  exports.isIos = isIos;
  exports.isAndroid = isAndroid;
  exports.isWechat = isWechat;
  exports.checkSupportWebp = checkSupportWebp;
  exports.addListener = addListener;
  exports.domready = domready;
  exports.is = is;
  exports.isArray = isArray;
  exports.isBoolean = isBoolean;
  exports.isNull = isNull;
  exports.isNullOrUndefined = isNullOrUndefined;
  exports.isNumber = isNumber;
  exports.isString = isString;
  exports.isSymbol = isSymbol;
  exports.isUndefined = isUndefined;
  exports.isRegExp = isRegExp;
  exports.isObject = isObject;
  exports.isDate = isDate;
  exports.isError = isError;
  exports.isFunction = isFunction;
  exports.isPrimitive = isPrimitive;
  exports.isHasOwn = isHasOwn;
  exports.isEmpty = isEmpty;
  exports.isHttp = isHttp;
  exports.isBase64 = isBase64;
  exports.isNative = isNative;
  exports.isWindow = isWindow;
  exports.isDocument = isDocument;
  exports.isPromise = isPromise;
  exports.isFormData = isFormData;
  exports.isFile = isFile;
  exports.isBlob = isBlob;
  exports.isAbsolute = isAbsolute;
  exports.resolvePath = resolvePath;
  exports.dirname = dirname;
  exports.basename = basename;
  exports.extname = extname;
  exports.stringify = stringify;
  exports.parse = parse;
  exports.regexHttp = regexHttp;
  exports.regexBase64 = regexBase64;
  exports.regexNumber = regexNumber;
  exports.regexMobile = regexMobile;
  exports.regexChinese = regexChinese;
  exports.regexSplitPath = regexSplitPath;
  exports.timeago = timeago;
  exports.unixFormat = unixFormat;
  exports.now = now;
  exports.throttle = throttle;
  exports.debounce = debounce;
  exports.random = random;
  exports.shuffle = shuffle;
  exports.each = each;
  exports.pick = pick;
  exports.memoize = memoize;
  exports.Zepto = Zepto;
  exports.http = http;
  exports.jssdk = jssdk;
  exports.cloud = cloud;
  exports.analysis = analysis;
  exports.ui = ui;
  exports.safety = safety;
  exports.tool = tool;
  exports.app = app;
  exports.wechat = wechat;
  exports.store = store_modern;
  exports.Emitter = Emitter;
  exports.Loader = Loader;
  exports.App = App;
  exports.UiMusic = UiMusic;
  exports.UiModal = UiModal;
  exports.UiToast = UiToast;
  exports.UiView = UiView;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
