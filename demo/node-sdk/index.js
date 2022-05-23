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

auth.saveToken('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6Miwic3RhdGUiOiJzdXBlciIsImlzcyI6Ind4ZTJhYWM0OTc3Y2U2YzBhZCIsImV4cCI6MTYxMzMxMTc3MSwic3ViIjoib3BlbiIsInR5cCI6InVzZXIifQ.Sifm6Nt6WKXcqXr4N7c6epXJyRGZmKMxhvkAqz6FFapXE2qVYsLW_s0OMyUxh5WRqKSiUOVvMVRvhM7NILy52imCg0rL9jLYNLjwBVmgi5UAwmLmI5Bu6B9Uecjmsr42alApVDW50DJZU1axfOB19Zdj5n1Dqc24-twPIVizRZQ')

auth.login().then(user => {
  console.log('👌 user.login() :', {id: user.id, nickname: user.nickname})
})

// console.log(auth.isLogin)
