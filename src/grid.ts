export default class Grid {
  public density = 10;
  public cursorPt: Float32Array;
  public closestPt: Float32Array;
  public grid: Float32Array[];

  protected size: { width: number; height: number } = {
    width: 100,
    height: 100
  };

  constructor() {
    this.cursorPt = new Float32Array([0, 0]);
  }

  setSize(width: number, height: number) {
    this.size = { width, height };
  }

  setCursor(p: Float32Array) {
    this.cursorPt = p;
  }

  render(ctx: CanvasRenderingContext2D) {
    const grid = [];

    let w = this.size.width;
    let h = this.size.height;
    const buffer = 5;

    for (let i = 0; i < w; i++) {
      if (i < buffer || i > w - buffer) continue;
      if (i % this.density === 0) {
        for (let k = 0; k < h; k++) {
          if (k < buffer || k > h - buffer) continue;
          if (k % this.density === 0) {
            ctx.beginPath();

            if (
              Math.abs(this.cursorPt[1] - k) < buffer &&
              Math.abs(this.cursorPt[0] - i) < buffer
            ) {
              ctx.fillStyle = "#999999";
              this.closestPt = new Float32Array([i, k]);
            } else {
              ctx.fillStyle = "#333";
            }

            ctx.arc(i, k, 1, 0, Math.PI * 2, true);
            ctx.fill();
            grid.push(new Float32Array([i, k]));
          }
        }
      }
    }

    this.grid = grid;
    return grid;
  }
}
