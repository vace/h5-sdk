/* eslint-disable */
import { dasherize } from '../functions/common'
import { animationPrefix, transitionEnd, animationEnd, animationEnabled } from '../functions/utils.web'

/**
 * @function
 * @module $
 * @name Fx
 * @desc $.fx 动画插件
 * @see {@link https://zeptojs.bootcss.com/#fx|完整文档}
 */
export default function install ($) {
  // https://github.com/madrobby/zepto/blob/master/src/fx.js
  var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  // small code
  var transition = 'transition'
  var animation = 'animation'

  transform = animationPrefix + 'transform'
  cssReset[transitionProperty = animationPrefix + transition + '-property'] =
    cssReset[transitionDuration = animationPrefix + transition + '-duration'] =
    cssReset[transitionDelay = animationPrefix + transition + '-delay'] =
    cssReset[transitionTiming = animationPrefix + transition + '-timing-function'] =
    cssReset[animationName = animationPrefix + animation + '-name'] =
    cssReset[animationDuration = animationPrefix + animation + '-duration'] =
    cssReset[animationDelay = animationPrefix + animation + '-delay'] =
    cssReset[animationTiming = animationPrefix + animation + '-timing-function'] = ''

  $.fx = {
    off: !animationEnabled,
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: animationPrefix,
    transitionEnd: transitionEnd,
    animationEnd: animationEnd
  }

  $.fn.animate = function (properties, duration, ease, callback, delay) {
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
      ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function (properties, duration, ease, callback, delay) {
    var key, cssValues = {}, cssProperties, transforms = '',
      that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
      fired = false

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function (event) {
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0) {
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      setTimeout(function () {
        if (fired) return
        wrappedCallback.call(that)
      }, ((duration + delay) * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function () {
      that.each(function () { wrappedCallback.call(this) })
    }, 0)

    return this
  }
}