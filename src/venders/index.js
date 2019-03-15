// import EventEmiiter from 'eventemitter3'

/**
 * zepto 插件，导出对象为 $,和zepto
 */
export * from './zepto'

/**
 * @namespace store
 * @desc 本地存储操作库store.js
 */

/**
 * 设置缓存
 * @memberof store
 * @function set
 * @param {string} key 缓存键名称
 * @param {any} val 设置缓存值
 * @returns {any}
 */

/**
 * 获取本地缓存
 * @memberof store
 * @function get
 * @param {string} key 缓存键名称
 * @param {any} defaultValue 未命中时的默认返回值
 * @returns {any}
 */

/**
 * 获取所有的缓存
 * @memberof store
 * @function getAll
 * @returns {Object}
 */

/**
 * 删除指定缓存
 * @memberof store
 * @function remove
 * @param {string} key 缓存键名称
 * @returns {any}
 */

/**
 * 清空所有缓存
 * @memberof store
 * @function clear
 * @returns {any}
 */

/**
 * 是否存在某项缓存
 * @memberof store
 * @function has
 * @param {string} key 缓存键名称
 * @returns {boolean}
 */

/**
 * 是否存在某项缓存
 * @memberof store
 * @function forEach
 * @param {callback} val 读取所有缓存，并调用回调
 * @returns {boolean}
 */