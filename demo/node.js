const sdk = require('../dist/sdk.node')

console.log(Headers)

// sdk.http.get('https://httpbin.org/get').then(console.log)

const app = new sdk.App({
  appid: 'apr79oyug6'
})

app.ready().then((app) => {
  console.log(app)
  sdk.app.get({
    api: 'https://api.ahmq.net/api/developer/httpbin',
    param: { ok: 1 }, // TODO your params
    showSuccess: true,
    showError: true,
    showLoading: true
  }).then(function (result) {
    console.log(result)
  })
})
