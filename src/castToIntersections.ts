import { Point } from './Point';
import { Ray } from './Ray';
import { ShadowAppCtx } from './ShadowAppCtx';
const castToIntersections = (source: Point, corners: Point[], segments: Ray[]): Point[] => {
  const rays: Ray[] = [];
  corners.forEach((target) => {
    const ray = new Ray(source, target);
    rays.push(ray.rotate(-0.00001), ray, ray.rotate(0.00001));
  });
  return rays
    .sort((a, b) => a.theta - b.theta)
    .map((ray, k) => {
      const t = Math.min(...segments.map(l => ray.intersect(l)));
      if (t < Infinity) {
        let point: Point = ray.at(t);
        // cursorGraphics.beginFill(0xDE3249, 1)
        // cursorGraphics.drawCircle((point as Point).x, (point as Point).y, 2)
        // cursorGraphics.endFill()
        // cursorGraphics.lineStyle(1, 0xff0000 + 0x10 * k).moveTo(ray.src.x, ray.src.y).lineTo(point.x, point.y)
        return point;
      }
      return new Point(-1, -1);
    }).filter(t => t.x !== -1);
};

export const renderCast = (source: Point) => (ctx: ShadowAppCtx) => {
  const { polygonGraphics } = ctx;
  const intersections: Point[] = castToIntersections(source, ctx.corners, ctx.segments);
  polygonGraphics.beginFill(0xffffff);
  polygonGraphics.drawPolygon(...intersections.flatMap(pt => [pt.x, pt.y]));
  polygonGraphics.endFill();
  // intersections.forEach((point, k) => {
  //   polygonGraphics.beginFill(0xffffff)
  //   const another = k === intersections.length - 1 ? intersections[0] : intersections[k+1]
  //   polygonGraphics.drawPolygon(source.x, source.y, point.x, point.y, another.x, another.y)
  //   polygonGraphics.endFill()
  // })
  return ctx;
};
