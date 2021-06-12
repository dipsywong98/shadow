import { Point } from './Point'

export class Line {
  private _a: number
  private _b: number
  private _c: number

  constructor (a: number, b: number, c: number) {
    this._a = a
    this._b = b
    this._c = c
  }

  static twoPoints (a: Point, b: Point): Line {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return new Line(dy, -dx, b.y * dx - b.x * dy)
  }

  public fx (x: number): number {
    return (-this._c - this._a * x) / this._b
  }

  public fy (y: number): number {
    return (-this._c - this._b * y) / this._a
  }

  public intersect (other: Line): Point | null {
    const m = other.a * this.b - this.a * other.b
    if (m === 0) {
      return null
    } else {
      return new Point(
        (other.b * this.c - other.c * this.b) / m,
        (other.c * this.a - other.a * this.c) / m
      )
    }
  }

  get a (): number {
    return this._a
  }

  set a (value: number) {
    this._a = value
  }

  get b (): number {
    return this._b
  }

  set b (value: number) {
    this._b = value
  }

  get c (): number {
    return this._c
  }

  set c (value: number) {
    this._c = value
  }
}
