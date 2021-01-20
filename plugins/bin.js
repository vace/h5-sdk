var s = new sdk.App({appid: 'xxxx'}).ready().then(app => {
  console.log(app.setting)
})
