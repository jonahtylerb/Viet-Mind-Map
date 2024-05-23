const rnd = (n: number = 1, min?: number, max?: number) => {
  let r = Math.random() * n;
  if (min) r += min;
  if (max) r = Math.min(max, r);
  return r;
};
const flr = (n: number) => Math.floor(n);

function drawWire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  droop: number = 30,
): void {
  // Calculate the control point for the quadratic curve
  const controlX = (x + dx) / 2;
  const controlY = (y + dy) / 2 + droop;

  const drawWireSegment = (offset: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + offset);
    ctx.quadraticCurveTo(controlX, controlY + offset, dx, dy + offset);
    ctx.stroke();
  };

  // Draw the three segments with slight vertical offsets for shading effect
  drawWireSegment(-ctx.lineWidth / 2, "#0D171F"); // Top black line
  drawWireSegment(0, "#12272F"); // Middle gray line
  drawWireSegment(ctx.lineWidth / 2, "#0D171F"); // Bottom black line
}

export { rnd, flr, drawWire };
