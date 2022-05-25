const sdk = require('../../dist/node-sdk/sdk')

console.log('👌 node-sdk@' + sdk.version)

const app = new sdk.App({
  appid: 'apr79oyug6'
})

app.ready().then(app => {
  console.log('👌 app.ready() :', app.config.name)
}).catch(console.error)

const auth = new sdk.Auth({
  appid: 'wxe2aac4977ce6c0ad',
  platform: 'open',
  scope: 'snsapi_userinfo',
  type: 'user',
  env: ''
})

auth.saveToken('Bearer {token}')

auth.login().then(user => {
  console.log('👌 user.login() :', {id: user.id, nickname: user.nickname})
})

// console.log(auth.isLogin)
