import * as PIXI from 'pixi.js'
import { Point, pt } from './Point'
import { Ray } from './Ray'

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

  const lines: Ray[] = []
  const corners: Point[] = []

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
    corners.push(p0, p1, p2, p3)
    lines.push(new Ray(p0, p1), new Ray(p1, p2), new Ray(p2, p3), new Ray(p3, p0))
    return graphics
  }
  const polygonGraphics = new PIXI.Graphics()
  container.addChild(polygonGraphics)

  const cursorGraphics = new PIXI.Graphics()
  container.addChild(cursorGraphics)
  const ptGraphics = new PIXI.Graphics()
  container.addChild(ptGraphics)

  for (let i = 0; i < 10; i++) {
    makeSquare(Math.random() * 800, Math.random() * 600, 20, 20)
  }
  makeSquare(0, 0, 800, 600)

  app.ticker.add(() => {
    const { x, y } = app.renderer.plugins.interaction.mouse.global
    const sources = [new Point(x, y)]
    polygonGraphics.clear()
    cursorGraphics.clear()
    cursorGraphics.beginFill(0xDE3249, 1)
    cursorGraphics.drawCircle(x, y, 2)
    cursorGraphics.endFill()
    const rays: Ray[] = []
    sources.forEach((origin) => {
      corners.forEach((target) => {
        const ray1 = new Ray(origin, target)
        rays.push(ray1.rotate(-0.00001), ray1, ray1.rotate(0.00001))
      })
    })
    const intersections: Point[] = rays.sort((a, b) => a.theta - b.theta).map((sight, k) => {
      let d = Infinity
      let point: Point = pt(-1, -1)
      lines.forEach(l => {
        const pt = sight.intersect(l)
        ptGraphics.clear()
        if (pt) {
          const dd = sight.src.n2Distance2(pt)
          if (dd < d) {
            d = dd
            point = pt
          }
        }
      })
      if (point.x !== -1) {
        cursorGraphics.beginFill(0xDE3249, 1)
        cursorGraphics.drawCircle((point as Point).x, (point as Point).y, 2)
        cursorGraphics.endFill()
        cursorGraphics.lineStyle(1, 0xff0000 + 0x10 * k).moveTo(sight.src.x, sight.src.y).lineTo(point.x, point.y)
      }
      return point
    })
    intersections.forEach((point, k) => {
      polygonGraphics.beginFill(0x990000, 0.3)
      const another = k === intersections.length - 1 ? intersections[0] : intersections[k+1]
      polygonGraphics.drawPolygon(sources[0].x, sources[0].y, point.x, point.y, another.x, another.y)
      polygonGraphics.endFill()
    })
  })

  return app
}
