export class Point {
  private _x: number
  private _y: number

  constructor (x: number, y: number) {
    this._x = x
    this._y = y
  }

  public n1Distance (other: Point): number {
    return Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2)
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
