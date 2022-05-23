import App from '../factory/App'
import Config from '../factory/Config'
import { CloudResponse } from './cloud'

export * from './cloud'

/** 上传一个文件（项目文件） */
export function upfile(filePath: string, temp?: boolean): Promise<CloudResponse> {
  const app = App.instance
  if (!app) {
    throw new TypeError('`App.instance` not found')
  }
  const url = Config.service(`cloud/${temp ? 'uptemp' : 'upfile'}?appid=${app.appid}`)
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath,
      name: 'file',
      success: ({ statusCode, data }: any) => {
        if (statusCode === 200) {
          const json = JSON.parse(data)
          if (json && json.code === 0) {
            resolve(json.data)
          } else {
            reject(new Error('上传失败：' + json.message))
          }
        } else {
          reject(`网络错误，上传失败：${statusCode}`)
        }
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}

/** 上传文件（临时文件） */
export function uptemp(filePath: string,): Promise<CloudResponse> {
  return upfile(filePath, true)
}
