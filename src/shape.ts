export default abstract class Shape {
  pts: Float32Array[] = [];
  grid: Float32Array[] = [];
  animating: boolean = true;
  filled: boolean = false;
  color: string = "#FFFFFF";

  abstract render(ctx: CanvasRenderingContext2D);

  constructor(grid: Float32Array[]) {
    this.grid = grid;
  }

  stop() {
    this.animating = false;
  }

  play() {
    this.animating = true;
  }
}
