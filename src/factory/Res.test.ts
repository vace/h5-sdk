import Res from './Res'

var res = new Res({})

res.img('xx.png').then(item => {
  item.data.src
})

const item = res.add<HTMLImageElement>({ url: 'xx.png' })
// item.data.src

Res.img('xx.png')
Res.img(['xx.png']).then(imgs => {
  imgs.length
  imgs[0].data.src
})
