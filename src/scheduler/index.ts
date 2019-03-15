import initializeApp from './initialize-app'
import initializeJssdk from './initialize-jssdk'
import initializeScript from './initialize-script'
import initializeMusic from './initialize-music'
import { domready } from '../functions/index';
import { pv } from '../plugins/analysis';

initializeApp()
initializeScript()
initializeJssdk()

pv() // 发送pv日志

domready.then(() => {
  initializeMusic()
})
// $(() => { initializeMusic() })
