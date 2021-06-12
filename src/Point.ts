export class Point {
  private _x: number
  private _y: number

  constructor (x: number, y: number) {
    this._x = x
    this._y = y
  }

  public n2Distance2 (other: Point): number {
    return Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2)
  }

  public n2Distance (other: Point): number {
    return Math.sqrt(this.n2Distance2(other))
  }

  public normalize (): Point {
    const d = this.n2Distance(new Point(0, 0))
    return new Point(this._x / d, this._y / d)
  }

  public mul (scalar: number) {
    return new Point(
      this._x * scalar,
      this._y * scalar
    )
  }

  public add (point: Point) {
    return new Point(
      this._x + point._x,
      this._y + point._y
    )
  }

  public minus (point: Point) {
    return new Point(
      this._x - point._x,
      this._y - point._y
    )
  }

  public rotate (theta: number): Point {
    const st = Math.sin(theta)
    const ct = Math.cos(theta)
    return new Point(ct * this._x - st * this._y, st * this._x + ct * this._y)
  }

  get x (): number {
    return this._x
  }

  set x (value: number) {
    this._x = value
  }

  get y (): number {
    return this._y
  }

  set y (value: number) {
    this._y = value
  }
}

export const pt = (x: number, y: number) => new Point(x, y)
