
class DrawPoster {
  public width: number
  public height: number
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D

  /**
   * @param width 画布宽度
   * @param height 画布高度
   */
  constructor (width: number = 750, height: number = 1334) {
    this.width = width
    this.height = height

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    this.canvas = canvas
    this.ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
  }

  public clear (): DrawPoster {
    this.ctx.clearRect(0, 0, this.width + 1, this.height + 1)
    return this
  }

  public rect () {

  }

  public circle () {
    
  }

  public image () {

  }

  public text () {

  }


  public draw () {

  }

}
