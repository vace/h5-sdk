interface IJsonpOption {
  // 回调函数
  callback?: string
  // 超时时间
  timeout?: number
}

let uuid = 0
export function jsonp (url: string, options: IJsonpOption | any = {}) {
  return new Promise((resolve, reject) => {
    const { callback = 'callback', timeout } = options
    const root = document.head || document.body
    const script = document.createElement('script')
    const name = '__sdkjsonp_' + uuid++
    const timeId = timeout ? setTimeout(() => reject(new Error('request jsonp timeout')), timeout) : null
    script.src = `${url}${/\?/.test(url) ? '&' : '?'}${callback}=${name}`
    window[name] = function (data: any) {
      root.removeChild(script)
      delete window[name]
      timeId !== null && clearTimeout(timeId)
      resolve(data)
    }
    // TODO ERROR HANDLE
    root.appendChild(script)
  })
}
