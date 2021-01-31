class ActioVideo {
  constructor(options = {}) {
    this.setOptions(options)
    this.setState()
    /** @type {HTMLVideoElement} 视频元素 */
    this.video = null
    this._createTemplate()
    this._initVideo()
  }

  setOptions(options) {
    this.target = options.target || 'body'
    /** @type {Boolean} 是否自动播放 */
    this.autoplay = options.autoplay
    /** @type {Boolean} 是否允许暂停 */
    this.allowPaused = options.allowPaused
    /** @type {Boolean} 是否允许跳过 */
    this.allowSkip = options.allowSkip
    /** @type {Number} 跳过倒计时 */
    this.src = options.src || 'video.mp4'
    this.poster = options.poster || 'video.jpg'
    this.skipText = options.skipText || '跳过视频'
    this.skipTime = options.skipTime || 0
    this.skipTimeText = options.skipTimeText
    this.background = options.background
    this.objectFit = options.objectFit || 'cover'
    // 图层效果
    this.effect = options.effect

    // callback
    this.onSkip = options.onSkip
    this.onEnded = options.onEnded
    this.onLoaded = options.onLoaded
    this.onReady = options.onReady
    this.onError = options.onError
    this.onReplay = options.onReplay
  }

  setState() {
    // state
    this._defaultClass = ''
    this._isFirstPlay = true
    this._isSkip = false
    this._isShowSkip = false
    this._isReady = false
    // 是否更新过timeupdated，防止黑屏出现
    this._isTimeupdated = false
    // 跳过是否准备就绪
    this._isSkipAllowed = false
  }

  ready() {
    this._isReady = true
    this.update()
    typeof this.onReady === 'function' && this.onReady()
  }

  replay() {
    this.setState()
    this.video.currentTime = 0
    this.video.play()
    typeof this.onReplay === 'function' && this.onReplay()
  }

  show(fadeIn) {
    fadeIn ? this.$root.fadeIn(fadeIn) : this.$root.show()
  }

  hide(fadeOut) {
    this.isPlayed && this.video.pause()
    fadeOut ? this.$root.fadeOut(fadeOut) : this.$root.hide()
  }

  get isError() {
    return !!this.video.error
  }

  get isPaused() {
    return this._isFirstPlay ? false : this.video.paused
  }

  get isEnded() {
    return this.video.ended
  }

  get isPlayed() {
    return this._isTimeupdated && !this.video.paused
  }

  update() {
    const { isError, isPaused, isEnded, isPlayed, _isReady, _isSkip, _isShowSkip } = this
    this.$root.toggleClass('isError', isError)
    this.$root.toggleClass('isPaused', isPaused)
    this.$root.toggleClass('isEnded', isEnded)
    this.$root.toggleClass('isPlayed', isPlayed)
    this.$root.toggleClass('isReady', _isReady)
    this.$root.toggleClass('isShowSkip', _isShowSkip)
    this.$root.toggleClass('isSkip', _isSkip)
  }

  change (videoSrc, posterSrc) {
    this.$video.attr('src', videoSrc)
    if (posterSrc) {
      this.$root.find('.video-cover-el').attr('src', posterSrc)
    }
  }

  _createTemplate() {
    const { effect, background, objectFit, poster, skipText } = this
    const attrbutes = [
      { key: 'preload', value: this.preload || 'auto' },
      { key: 'src', value: this.src },
      { key: 'autoplay', value: this.autoplay ? 'autoplay' : null },
      { key: 'x-webkit-airplay', value: 'allow' },
      { key: 'webkit-playsinline', value: '' },
      { key: 'x5-video-player-type', value: 'h5' },
      { key: 'x5-video-player-fullscreen', value: 'true' },
      { key: 'playsinline', value: 'true' },
      { key: 'style', value: 'object-fit: ' + objectFit },
      { key: 'poster', value: poster },
    ].filter(attr => attr.value != null).map(attr => `${attr.key}="${attr.value}"`).join(' ')
    var $root = this.$root = $(`<div class="video">
  <div class="video-view">
    <img class="video-cover-el" src="${poster}" style="object-fit: ${objectFit}" />
    <video class="video-el" ${attrbutes}></video>
  </div>
  <div class="video-control">
    <div class="video-cover ${effect ? ('video-' + effect) : ''}">
      <img class="video-cover-el" src="${poster}" style="object-fit: ${objectFit}" />
    </div>
    <div class="video-play">
      <img src="video/btn-theme1.png" style="width: 4rem;">
    </div>
    <div class="video-skip">${skipText}</div>
  </div>
</div>`)
    if (background) {
      $root.css('background', background)
    }
    $root.find('.video-cover-el').on('load', event => {
      typeof this.onLoaded === 'function' && this.onLoaded()
    })
    return $(this.target).append($root)
  }

  _onTimeupdate(ctime) {
    const { allowSkip, skipTime, skipText, skipTimeText, _isFirstPlay, _isReady, _isTimeupdated } = this
    if (_isFirstPlay) {
      this._isFirstPlay = false
      this.update()
    }
    if (!_isTimeupdated) {
      this._isTimeupdated = true
      this.update()
    }
    if (!_isReady) {
      this.ready()
    }
    // console.log('ctime', ctime)
    if (allowSkip) {
      var second = Math.max(Math.round(skipTime / 1000 - ctime), 0)
      if (second !== this._prevSecond) {
        this._prevSecond = second
        const $el = this.$root.find('.video-skip')
        if (second) {
          $el.text(skipTimeText ? skipTimeText.replace('%', second) : skipText)
        } else {
          this._isSkipAllowed = true
          $el.text(skipText)
        }
        this._isShowSkip = true
        this.update()
      }
    }
  }

  _initVideo() {
    const $root = this.$root
    const $video = this.$video = $root.find('video')
    if (!$video.length) {
      throw new Error(`${this.selector} video 视频节点不存在`)
    }
    this._defaultClass = $video.attr('class')
    const video = this.video = $video.get(0)
    this.video.controls = false
    this.update()

    $root
      .on('click', '.video-play', (event) => {
        video.play()
      })
      .on('click', '.video-skip', (event) => {
        if (this._isSkipAllowed) {
          video.paused || video.pause()
          this._isSkip = true
          this.update()
          if (typeof this.onSkip === 'function') {
            this.onSkip()
          } else if (typeof this.onEnded === 'function') {
            // 如果未定义skip将处罚ended事件
            this.onEnded()
          }
        }
      })
      .on('click', '.video-cover', (event) => {
        if (video.paused) {
          video.play()
        } else if (this.allowPaused) {
          video.pause()
        }
      })

    $video.on('error', () => {
      this.update()
      typeof this.onError === 'function' && this.onError(video.error)
    }).on('canplay', () => {
      // this.update() console.log('canplay')
    }).on('ended', () => {
      this.update()
      typeof this.onEnded === 'function' && this.onEnded()
    }).on('pause', () => {
      this.update()
    }).on('play', () => {
      this._isSkip = false
      this.update()
    }).on('waiting', () => {
      this.update()
    }).on('timeupdate', () => {
      // 解析mp4耗时
      if (video.currentTime > 0) {
        this._onTimeupdate(video.currentTime)
      }
    })
    this.video.addEventListener('touchmove', e => {
      e.preventDefault()
    })
    if (this.autoplay) {
      const tryPlay = sdk.once(() => {
        try {
          video.play().catch(err => {
            this.ready()
          })
        } catch (err) {
          this.ready()
        }
      })
      if (sdk.isWechat) {
        document.addEventListener("WeixinJSBridgeReady", tryPlay, false)
        sdk.wait(3000).then(tryPlay)
      } else {
        tryPlay()
      }
    } else {
      this.ready()
    }
  }
}
