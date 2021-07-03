import * as PIXI from 'pixi.js';
import { Point } from './Point';
import { Ray } from './Ray';

export interface ShadowAppCtx {
  corners: Point[];
  segments: Ray[];
  root: PIXI.Container;
  squares: PIXI.Container;
  polygonGraphics: PIXI.Graphics;
  debugGraphics: PIXI.Graphics;
  ptGraphics: PIXI.Graphics;
}
