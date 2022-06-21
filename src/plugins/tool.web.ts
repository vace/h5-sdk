import { uid } from '../functions/common'

export * from './tool'

// /** 生成微信账号二维码 */
// export function getQrcode(username: string): string {
//   return `https://open.weixin.qq.com/qr/code?username=${username}`
// }

/** 读取文件的base64 */
export function readAsDataURL(inputer: File): Promise<string> {
  let fr = new FileReader()
  return new Promise((resolve, reject) => {
    fr.onload = () => resolve(<string>fr.result)
    fr.onerror = e => reject(e)
    fr.readAsDataURL(inputer)
  })
}

let $inputHanlde: ZeptoCollection

/** 选择某个种类的文件 */
export function chooseFile(accept: string = '*', multiple?: boolean): Promise<File | FileList> {
  return new Promise((resolve, reject) => {
    if ($inputHanlde) {
      $inputHanlde.remove()
    }
    $inputHanlde = $(`<input id="${uid('_sdk-up-')}" style="display:none;" type="file" accept="${accept}">`)
    multiple && $inputHanlde.attr('multiple', 'multiple')
    $inputHanlde.appendTo('body').trigger('click')
    $inputHanlde.on('change', () => {
      let files: FileList = $inputHanlde.prop('files')
      if (files.length) {
        return resolve(multiple ? files : files[0])
      }
      reject(new TypeError(`未选择任何文件`))
    })
  })
}

/**
 * 选择文件并获取base64编码
 * @returns {Promise<string>}
 */
export function chooseImageAsDataURL(option?: any): Promise<string> {
  return (<any> chooseFile('image/*')).then(readAsDataURL)
}

/**
 * base64文本转换为blob，可直接用表单上传
 * @param {string} base64String 原文本
 * @param {string} contentType 自定义contentType
 * @param {string} sliceSize 块大小
 * @returns {Blob}
 */
export function base64toBlob(base64String: string, contentType: string = '', sliceSize: number = 512): Blob {
  const [prefix, b64Data] = base64String.split(',')
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

