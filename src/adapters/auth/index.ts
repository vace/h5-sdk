import createAuthMini from './auth.mini'
import createAuthWeb from './auth.web'

import { IAuth } from './interface';

let auth: IAuth
/**
 * @var {string} 这个变量由rollup根据环境替换
 */
let platform = '__PLANTFORM__'

if (platform === 'web') {
  auth = createAuthWeb()
} else if (platform === 'mini') {
  auth = createAuthMini()
}

export { auth }
