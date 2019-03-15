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
})(typeof exports != 'undefined' && typeof global != 'undefined' ? global : window)