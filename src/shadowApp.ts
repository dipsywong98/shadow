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
  const blackGraphics = new PIXI.Graphics()
  blackGraphics.beginFill(0x0)
  blackGraphics.drawRect(0,0,800, 600)
  blackGraphics.endFill()
  app.stage.addChild(blackGraphics)
  body.appendChild(app.view)

  app.stage.interactive = true

  const container = new PIXI.Container()
  container.width = 800
  container.height = 600
  app.stage.addChild(container)

  const segments: Ray[] = []
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
    segments.push(new Ray(p0, p1), new Ray(p1, p2), new Ray(p2, p3), new Ray(p3, p0))
    return graphics
  }
  const polygonGraphics = new PIXI.Graphics()
  app.stage.addChild(polygonGraphics)
  const cursorGraphics = new PIXI.Graphics()
  container.addChild(cursorGraphics)
  const ptGraphics = new PIXI.Graphics()
  container.addChild(ptGraphics)

  const bgFront = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bg_scene_rotate.jpg');
  container.addChild(bgFront);

  const thing = new PIXI.Graphics();
  app.stage.addChild(thing);
  thing.x = app.screen.width / 2;
  thing.y = app.screen.height / 2;
  thing.lineStyle(0);
  container.mask = polygonGraphics;

  for (let i = 0; i < 10; i++) {
    makeSquare(Math.random() * 800, Math.random() * 600, 20, 20)
  }
  makeSquare(0, 0, 800, 600)

  const cast = (source: Point, corners: Point[], segments: Ray[]) => {
    const rays: Ray[] = []
    corners.forEach((target) => {
      const ray = new Ray(source, target)
      rays.push(ray.rotate(-0.00001), ray, ray.rotate(0.00001))
    })
    return rays
      .sort((a, b) => a.theta - b.theta)
      .map((ray, k) => {
      const t = Math.min(...segments.map(l => ray.intersect(l)))
      if (t < Infinity) {
        let point: Point = ray.at(t)
        cursorGraphics.beginFill(0xDE3249, 1)
        cursorGraphics.drawCircle((point as Point).x, (point as Point).y, 2)
        cursorGraphics.endFill()
        cursorGraphics.lineStyle(1, 0xff0000 + 0x10 * k).moveTo(ray.src.x, ray.src.y).lineTo(point.x, point.y)
        return point
      }
      return new Point(-1, -1)
    }).filter(t => t.x !== -1)
  }

  const renderCast = (source: Point, intersections: Point[]) => {
    intersections.forEach((point, k) => {
      polygonGraphics.beginFill(0x8bc5ff, 0.4)
      const another = k === intersections.length - 1 ? intersections[0] : intersections[k+1]
      polygonGraphics.drawPolygon(source.x, source.y, point.x, point.y, another.x, another.y)
      polygonGraphics.endFill()
    })
  }

  const clear = () => {
    polygonGraphics.clear()
    cursorGraphics.clear()
  }

  app.ticker.add(() => {
    const { x, y } = app.renderer.plugins.interaction.mouse.global
    const sources = [new Point(x, y)]
    clear()
    sources.forEach((source) => {
      const intersections = cast(source, corners, segments)
      renderCast(source, intersections)
    })
  })

  return app
}
