import { uid, isWechat, now } from "../functions/index";
import { chooseImageBase64 } from "./jssdk";
import { addEventListener, removeEventListener, document } from "../utils/global";
import { atob } from "./safety";
import { getApiUri } from "../config";

/**
 * 生成二维码
 * @param text 二维码文本
 * @param size 二维码尺寸
 */
export function qrcode (text: string, size = 400) {
  return getApiUri(`/qrcode/build?text=${encodeURIComponent(text)}&size=${size}`)
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
export function chooseImageAsDataURL(option?:any): Promise<string> {
  return chooseFile('image/*').then(readAsDataURL)
}

/**
 * 自动获取图片base64
 * ! 在微信端会使用微信的上传方式，读取base64
 * @returns {Promise<string>}
 */
export function autoGetImageBase64(option?: any): Promise<string> {
  return isWechat ? chooseImageBase64(option) : chooseImageAsDataURL(option)
}

/** 
 * IOS 虚拟键盘bug的处理发付出
 */
export function scrollFix (_element?: HTMLElement) {
  const el: HTMLElement = _element || document.documentElement || document.body
  // 触发浏览器的重新渲染机制
  el.scrollTop = el.scrollTop
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
