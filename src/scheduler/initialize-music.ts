import UiMusic from "../factory/UiMusic";

import $ from "../venders/zepto";
import { getElementAttrs } from "../utils/shared";

/**
 * 自动加载音乐
 * @ignore
 */
export default function initializeMusic () {
  const element: ZeptoCollection = $('meta[name="sdk:music"]')
  if (!element.length) {
    return
  }
  const props = [
    'target', 'src', 'className', 'theme', 'position', '!autoplay', '!background', '!loop', '!muted', '+volume', 'preload', '?size', '?offsetX', '?offsetY'
  ]
  const options = getElementAttrs(element, props)
  return UiMusic.getInstance(options)
}
