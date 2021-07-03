import * as PIXI from 'pixi.js'
import { addSquare } from './addSquare'
import { Point } from './Point'
import { renderCast } from './castToIntersections'
import { ShadowAppCtx } from './ShadowAppCtx'

const pipe = <T> (...functions: Array<(ctx: T) => T>) => (ctx: T): T => {
  return functions.reduce((acc: T, fn) => fn(acc), ctx)
}

const clear = (ctx: ShadowAppCtx): ShadowAppCtx => {
  ctx.polygonGraphics.clear()
  ctx.debugGraphics.clear()
  return ctx
}

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

  const makeFullContainer = () => {
    const container = new PIXI.Container()
    container.width = 800
    container.height = 600
    return container
  }

  const root = makeFullContainer()
  
  const bgFront = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bg_scene_rotate.jpg');
  const blackGraphics = new PIXI.Graphics()
  blackGraphics.beginFill(0x0)
  blackGraphics.drawRect(0,0,800, 600)
  blackGraphics.endFill()
  root.addChild(blackGraphics)
  const polygonGraphics = new PIXI.Graphics()
  polygonGraphics.addChild(bgFront)
  root.addChild(polygonGraphics)
  const debugGraphics = new PIXI.Graphics()
  root.addChild(debugGraphics)
  const ptGraphics = new PIXI.Graphics()
  root.addChild(ptGraphics)
  app.stage.addChild(root)
  root.addChild(bgFront);
  const squares = makeFullContainer()
  root.addChild(squares)
  bgFront.mask = polygonGraphics

  let ctx: ShadowAppCtx = pipe(...new Array(10).fill('').map(() => (addSquare(Math.random() * 800, Math.random() * 600, 20, 20))), addSquare(0, 0, 800, 600))({
    segments: [],
    corners: [],
    root,
    squares,
    polygonGraphics,
    debugGraphics: debugGraphics,
    ptGraphics
  })

  app.ticker.add(() => {
    const { x, y } = app.renderer.plugins.interaction.mouse.global
    const sources = [new Point(x, y)]
    ctx = pipe(
      clear,
      ...sources.map(source => renderCast(source))
    )(ctx)
  })

  return app
}
