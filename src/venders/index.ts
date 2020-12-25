import 'whatwg-fetch'

// jweixin
// import './jweixin-1.6.0'

/**
 * zepto 插件，导出对象为 $,和zepto
 */
import _Zepto from './zepto'

//! 这里为了能更好的生成d.ts描述文件

export const $: ZeptoStatic = _Zepto
export const Zepto: ZeptoStatic = _Zepto
