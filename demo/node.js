const sdk = require('../dist/sdk.node')

// sdk.http.get('https://httpbin.org/get').then(console.log)

const app = sdk.App.createInstance({
  appid: 'apr79oyug6'
})

app.ready(() => {
  sdk.app.get({
    api: 'Test.succ',
    param: {ok: 1}, // TODO your params
    showSuccess: true,
    showError: true,
    showLoading: true
  }).then(function (result) {
    console.log(result)
  })
})
