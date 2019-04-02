import { uid, isWechat, now } from "../functions/index";
import { chooseImageBase64 } from "./jssdk";
import { addEventListener, removeEventListener } from "../utils/global";

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
      reject(new Error(`select file empty`))
    })
  })
}

/**
 * 选择文件并获取base64编码
 * @returns {Promise<string>}
 */
export function chooseImageAsDataURL (): Promise<string> {
  return chooseFile('image/*').then((file) => readAsDataURL(file))
}

/**
 * 自动获取图片base64
 * ! 在微信端会使用微信的上传方式，读取base64
 * @returns {Promise<string>}
 */
export function autoGetImageBase64(): Promise<string> {
  return isWechat ? chooseImageBase64() : chooseImageAsDataURL()
}
