import * as PIXI from 'pixi.js'
import { Point, pt } from './Point'
import { Line } from './Line'
import { Segment } from './Segment'

// @ts-ignore
window.PIXI = PIXI

export const shadowApp = () => {
  let body = document.getElementById('container')!
  while (body.firstChild) {
    if (body.lastChild) {
      body.removeChild(body.lastChild)
    }
  }
  const app = new PIXI.Application({ antialias: true, backgroundColor: 0xffffffff })
  body.appendChild(app.view)

  app.stage.interactive = true

  const container = new PIXI.Container()
  container.width = 800
  container.height = 600
  app.stage.addChild(container)

  const lines: Line[] = []

  const makeSquare = (x: number, y: number, w: number, h: number) => {
    const graphics = new PIXI.Graphics()
    container.addChild(graphics)
    graphics.lineStyle(1, 0x000000, 1)
    graphics.moveTo(x, y)
    graphics.lineTo(x + w, y)
    graphics.lineTo(x + w, y + h)
    graphics.lineTo(x, y + h)
    graphics.lineTo(x, y)
    graphics.closePath()
    const p0 = pt(x, y)
    const p1 = pt(x + w, y)
    const p2 = pt(x + w, y + h)
    const p3 = pt(x, y + h)
    lines.push(new Segment(p0, p1), new Segment(p1, p2), new Segment(p2, p3), new Segment(p3, p0))
    return graphics
  }

  const cursorGraphics = new PIXI.Graphics()
  container.addChild(cursorGraphics)
  const ptGraphics = new PIXI.Graphics()
  container.addChild(ptGraphics)
  let count = 0


  for (let i = 0; i < 1; i++) {
    makeSquare(Math.random() * 800, Math.random() * 600, 20, 20)
  }
  makeSquare(0, 0, 800, 600)

  let lastCount = 0


  app.ticker.add(() => {
    const { x, y } = app.renderer.plugins.interaction.mouse.global
    cursorGraphics.clear()
    cursorGraphics.beginFill(0xDE3249, 1)
    cursorGraphics.drawCircle(x, y, 2)
    cursorGraphics.endFill()
    const origin = pt(400, 300)
    const sight = Line.twoPoints(pt(x, y), origin)
    let d = Infinity
    let point: (Point | undefined) = undefined
    const points: unknown[] = []
    lines.forEach(l => {
      const pt = l.intersect(sight)
      points.push(pt)
      ptGraphics.clear()
      if (pt) {
        const dd = origin.n1Distance(pt)
        if (dd < d) {
          d = dd
          point = pt
        }
      }
    })
    if (point !== undefined) {
      cursorGraphics.beginFill(0xDE3249, 1)
      cursorGraphics.drawCircle((point as Point).x, (point as Point).y, 2)
      cursorGraphics.endFill()
    }
    count++
    if (count - lastCount > 1000) {
      lastCount = count
      console.log(points)
    }
  })

  return app
}
