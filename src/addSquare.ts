import * as PIXI from 'pixi.js';
import { pt } from './Point';
import { Ray } from './Ray';
import { ShadowAppCtx } from './ShadowAppCtx';

export const addSquare = (x: number, y: number, w: number, h: number) => (ctx: ShadowAppCtx): ShadowAppCtx => {
  const p0 = pt(x, y);
  const p1 = pt(x + w, y);
  const p2 = pt(x + w, y + h);
  const p3 = pt(x, y + h);
  ctx.corners.push(p0, p1, p2, p3);
  ctx.segments.push(new Ray(p0, p1), new Ray(p1, p2), new Ray(p2, p3), new Ray(p3, p0));
  drawSquare(ctx.squares, x, y, w, h);
  return ctx;
};
const drawSquare = (container: PIXI.Container, x: number, y: number, w: number, h: number) => {
  const graphics = new PIXI.Graphics();
  container.addChild(graphics);
  graphics.lineStyle(1, 0x000000, 1);
  graphics.moveTo(x, y);
  graphics.lineTo(x + w, y);
  graphics.lineTo(x + w, y + h);
  graphics.lineTo(x, y + h);
  graphics.lineTo(x, y);
  graphics.closePath();
  return graphics;
};
