import createAppWeb from '../adapters/app/app.web'

export { default as App } from './App'
export { default as Emitter } from './Emitter'
export { default as Http } from './Http'
export { default as Auth } from './Auth'
export { default as Res } from './Res'
export { default as Tasker } from './Tasker'
export { default as UiBase } from './UiBase'
export { default as UiMusic } from './UiMusic'
export { default as UiSheet } from './UiSheet'
export { default as UiModal } from './UiModal'
export { default as UiToast } from './UiToast'
export { default as UiView } from './UiView'
export { default as User } from './User'

// APP 组件需要包装Toast

createAppWeb()
