export { default as App } from './App'
export { default as Auth } from './Auth'
export { default as Emitter } from './Emitter'
export { default as Http } from './Http'
export { default as User } from './User'

import createAppMini from '../adapters/app/app.mini'

createAppMini()
