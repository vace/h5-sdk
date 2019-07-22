import createRequestWeb from './request.web'
import createRequestMini from './request.mini'
import { IRequest } from './interface';

let request: IRequest
/**
 * @var {string} 这个变量由rollup根据环境替换
 */
let platform = '__PLANTFORM__'

if (platform === 'web') {
  request = createRequestWeb()
} else if (platform === 'mini') {
  request = createRequestMini()
}

export { request }
