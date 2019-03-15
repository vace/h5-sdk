import $ from "../venders/zepto";
import { UiMusic } from "../factory/UiMusic";
import { getElementAttrs } from "../utils/shared";

export default function () {
  const element: ZeptoCollection = $('meta[name="sdk:music"]')
  if (!element.length) {
    return
  }
  const props = [
    'target', 'src', 'className', 'theme', 'position', '!autoplay', '!loop', '!muted', '+volume', 'preload', '?size', '?offsetX', '?offsetY'
  ]
  const options = getElementAttrs(element, props)
  return UiMusic.getInstance(options)
}
