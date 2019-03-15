import Emitter from "./Emitter";
import { isFunction } from "../functions/is";

/**
 * @name Loader#loaders
 * @type {Map}
 * @desc 当前已注册的资源解析器
 */
const loaders = new Map()

/**
 * 资源处理类 TODO
 * @class Loader
 * @classdesc 加载资源，以及资源处理器
 * @extends {EventEmitter}
 */
export default class Loader extends Emitter {
  public static registerLoader = registerLoader
  public static loaders = loaders
  public static DEFAULT_TYPE = 'image'
}

/**
 * 注册一个 资源解析器，返回promise 的处理结果，错误时抛出错误对象
 * @name Loader#registerLoader
 * @param {string} type 资源类型名称，默认支持image,json,text,blob,arrayBuffer,object类型
 * @param {Promise<ResourceItem>} adapter 
 * @returns {Promise<ResourceItem>}
 */
function registerLoader(type: string, adapter: any) {
  if (!loaders.has(type) && isFunction(adapter)) {
    loaders.set(type, adapter)
    return adapter
  }
  return loaders.get(type)
}

/* 加载图片，图片支持缓存项 */
registerLoader('image', function loader(resource: any) {
  return new Promise(function run(resolve, reject) {
    // fixed bug chrome 22 (new Image)
    const image = document.createElement('img')
    const { url, options } = resource
    // 设置跨域
    if (options && options.crossOrigin) {
      image.crossOrigin = 'crossOrigin'
    }
    image.onload = function () {
      resource.width = image.naturalWidth
      resource.height = image.naturalHeight
      resolve(resource)
    }
    image.onerror = function () {
      resource.width = resource.height = 0
      resource.error = new Error('image load error')
      reject(resource)
    }
    resource.image = image
    image.src = url
  })
});

/* 加载json,text,blob资源 */
['json', 'text', 'blob', 'buffer'].forEach(type => registerLoader(type, function loader(resource: any) {
  var { url, options } = resource
  return fetch(url, options)
    .then(response =>
      response[type === 'buffer' ? 'arrayBuffer' : type]()
    ).then(result => {
      resource[type] = result
      return resource
    }, err => {
      resource.error = err
      return Promise.reject(resource)
    })
}))

// object 支持，此时原样返回
registerLoader('object', function loader(resource) {
  return Promise.resolve(resource)
})
