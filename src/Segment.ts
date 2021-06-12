import { Line } from './Line'
import { Point } from './Point'

export class Segment extends Line {
  private x: number
  private X: number
  private y: number
  private Y: number

  constructor (a: Point, b: Point) {
    const p = Line.twoPoints(a, b)
    super(p.a, p.b, p.c)
    this.x = Math.min(a.x, b.x)
    this.y = Math.min(a.y, b.y)
    this.X = Math.max(a.x, b.x)
    this.Y = Math.max(a.y, b.y)
  }

  public intersect (other: Line): Point | null {
    const pt = super.intersect(other)
    if (pt) {
      if (pt.x < this.x || pt.x > this.X || pt.y < this.y || pt.y > this.Y) {
        return null
      }
      return pt
    }
    return null
  }
}
