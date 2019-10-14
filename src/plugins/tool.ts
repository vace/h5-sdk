import { uid, isWechat, now } from "../functions/index";
import { chooseImageBase64 } from "./jssdk";
import { addEventListener, removeEventListener, document } from "../utils/global";
import { atob } from "./safety";

/**
 * 摇一摇
 * @param {Function} callback
 */
export function onShake (callback: Function) {
  if (!('ondevicemotion' in window)) {
    return false
  }
  const threshold = 15
  const timeout = 1000

  let lastTime: number = 0,
      lastX: number,
      lastY: number,
      lastZ: number,
      isInited: boolean
  const initClear = () => {
    lastX = lastY = lastZ = 0
    isInited = false
  }
  const onDevicemotion = (e: DeviceMotionEvent) => {
    var {x, y, z}: any = e.accelerationIncludingGravity;
    var deltaX = Math.abs(lastX - x)
    var deltaY = Math.abs(lastY - y)
    var deltaZ = Math.abs(lastZ - z)
    // inited
    if (!isInited) {
      lastX = x
      lastY = y
      lastZ = z
      isInited = true
      return
    }
    if (
      (deltaX > threshold && deltaY > threshold) ||
      (deltaY > threshold && deltaZ > threshold) ||
      (deltaZ > threshold && deltaX > threshold)
    ) {
      const difference = now() - lastTime
      if (difference > timeout) {
        initClear()
        callback({ deltaX, deltaY, deltaZ })
      }
    }
  }
  // 设置默认值
  initClear()
  addEventListener('devicemotion', onDevicemotion, false)
  return function unbind () {
    removeEventListener('devicemotion', onDevicemotion, false)
  }
}

/**
 * 读取文件的base64
 * @param {File} inputer
 */
export function readAsDataURL (inputer: File): Promise<string> {
  let fr = new FileReader()
  return new Promise((resolve, reject) => {
    fr.onload = () => resolve(<string> fr.result)
    fr.onerror = e => reject(e)
    fr.readAsDataURL(inputer)
  })
}

let $inputHanlde: ZeptoCollection
/**
 * 选择某个种类的文件
 */
export function chooseFile (accept: string = '*'): Promise<File> {
  return new Promise((resolve, reject) => {
    if ($inputHanlde) {
      $inputHanlde.remove()
    }
    $inputHanlde = $(`<input id="${uid('_sdk-up-')}" style="display:none;" type="file" accept="${accept}">`)
    $inputHanlde.appendTo('body').trigger('click')
    $inputHanlde.on('change', () => {
      let files: File[] = $inputHanlde.prop('files')
      if (files.length) {
        return resolve(files[0])
      }
      reject(new Error(`选择的文件为空`))
    })
  })
}

/**
 * 选择文件并获取base64编码
 * @returns {Promise<string>}
 */
export function chooseImageAsDataURL (): Promise<string> {
  return chooseFile('image/*').then(readAsDataURL)
}

/**
 * 自动获取图片base64
 * ! 在微信端会使用微信的上传方式，读取base64
 * @returns {Promise<string>}
 */
export function autoGetImageBase64(): Promise<string> {
  return isWechat ? chooseImageBase64() : chooseImageAsDataURL()
}

/**
 * 滚动视图到顶部，用于在input之后触发
 */
export function scrollTop () {
  var scrolling = document.scrollingElement
  if (typeof scrolling.scrollIntoView === 'function') {
    scrolling.scrollIntoView()
  } else {
    document.documentElement.scrollTop = 0
  }
}

/**
 * base64文本转换为blob，可直接用表单上传
 * @param {string} base64String 原文本
 * @param {string} contentType 自定义contentType
 * @param {string} sliceSize 块大小
 * @returns {Blob}
 */
export function base64toBlob (base64String: string, contentType: string = '', sliceSize: number = 512): Blob {
  const [ prefix, b64Data ] = base64String.split(',')
  const [, mime = ''] = /^data:(.+);base64/i.exec(prefix) || []
  if (!mime) throw new Error('未检测到资源Mime，请检查编码合法性')
  if (!b64Data) throw new Error('未检测到资源Base64，请检查编码完整性')
  contentType = contentType || mime

  var byteCharacters = atob(b64Data);
  var byteArrays: any[] = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
