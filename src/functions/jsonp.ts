interface IJsonpOption {
  callback?: string
}

let uuid = 0
export function jsonp (url: string, options: IJsonpOption | any = {}) {
  return new Promise((resolve, reject) => {
    const root = document.head || document.body
    let script: any = document.createElement('script')
    const name = '__sdkjsonp_' + uuid++
    const callback = options.callback || 'callback'
    script.src = `${url}${/\?/.test(url) ? '&' : '?'}${callback}=${name}`
    window[name] = function (data: any) {
      root.removeChild(script)
      script = null
      delete window[name]
      resolve(data)
    }
    // TODO ERROR HANDLE
    root.appendChild(script)
  })
}
