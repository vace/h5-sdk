/**
 * 任务调度处理
 * 每个应用会从此处开始进行自动处理
 */

import initializeAuth from './initialize-auth'
import initializeApp from './initialize-app'
import initializeJssdk from './initialize-jssdk'
import initializeScript from './initialize-script'
import initializeMusic from './initialize-music'
import { domready } from '../functions/index';

initializeAuth()
initializeApp()
initializeScript()
initializeJssdk()

domready.then(() => {
  initializeMusic()
})
// $(() => { initializeMusic() })
