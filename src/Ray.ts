import { Point } from './Point'

export class Ray {
  public src: Point
  public dir: Point

  static Points(a: Point, b: Point) {
    return new Ray(a, b.minus(a))
  }

  constructor (src: Point, dir: Point) {
    this.src = src
    this.dir = dir.minus(src)
  }

  public get theta() {
    return Math.atan2(this.dir.y, this.dir.x)
  }

  public rotate(theta: number): Ray {
    const after = this.dir.rotate(theta)
    const ray = new Ray(this.src, after)
    ray.dir = after
    return ray
  }

  public at(t: number): Point {
    return this.src.add(this.dir.mul(t))
  }

  public intersect(segment: Ray): Point | undefined {
    const r_px = this.src.x
    const r_py = this.src.y
    const r_dy = this.dir.y
    const r_dx = this.dir.x
    const s_px = segment.src.x
    const s_py = segment.src.y
    const s_dy = segment.dir.y
    const s_dx = segment.dir.x
    const T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    const T1 = (s_px+s_dx*T2-r_px)/r_dx
    if (T1 > 0 && T2 >= 0 && T2 <= 1) {
      return this.at(T1)
    } else {
      return undefined
    }
  }
}
