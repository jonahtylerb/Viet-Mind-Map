import { flr, rnd } from "./utils";

export default class Pad {
  x = 0;
  y = 0;
  anchorX = 0;
  anchorY = 0;

  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  sections = 0;

  img: HTMLImageElement;

  startX = 0;
  startY = 0;

  text = "";
  width = 0;
  textWidth = 0;
  sectionWidth = 0;

  textX = 0;
  textY = 0;

  ySway = rnd(5);
  xSway = rnd(5);

  ySwaySpeed = rnd(300, 300);
  xSwaySpeed = rnd(300, 300);

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
  ) {
    this.anchorX = x;
    this.anchorY = y;
    this.canvas = ctx.canvas;
    this.ctx = ctx;
    this.text = text;

    this.img = document.getElementById("pad")! as HTMLImageElement;

    // this the text width
    this.textWidth = text.length * 8.6;

    // Calculate the number of sections based on the text width
    this.sectionWidth = 10; // Width of one middle section
    this.sections = Math.ceil((this.textWidth + 10) / this.sectionWidth); // 22 accounts for left and right pad parts

    // Calculate the total width of the pad
    this.width = 11 + this.sections * this.sectionWidth + 11; // left + middle sections + right
  }

  render(dt: number, frame: number) {
    const offsetX =
      this.xSway * Math.sin(2 * Math.PI * (frame / this.xSwaySpeed));
    const offsetY =
      this.ySway * Math.sin(2 * Math.PI * (frame / this.ySwaySpeed));

    this.x = this.anchorX + offsetX;
    this.y = this.anchorY - 16 + offsetY;

    // Calculate the starting x position to center the pad
    this.startX = flr(this.x) - this.width / 2;
    this.startY = flr(this.y);

    // Center the text on the pad
    this.textX = this.startX + (this.width - this.textWidth) / 2;
    this.textY = this.startY + 21; // Adjust as needed for vertical centering

    // Draw left pad
    this.ctx.drawImage(
      this.img,
      0,
      0,
      11,
      32,
      this.startX,
      this.startY,
      11,
      32,
    );

    // Draw center sections
    for (let i = 0; i < this.sections; i++) {
      this.ctx.drawImage(
        this.img,
        11,
        0,
        10,
        32,
        this.startX + 11 + i * this.sectionWidth,
        this.startY,
        10,
        32,
      );
    }

    // Draw right pad
    this.ctx.drawImage(
      this.img,
      21,
      0,
      11,
      32,
      this.startX + 11 + this.sections * this.sectionWidth,
      this.startY,
      11,
      32,
    );

    this.ctx.fillStyle = "#0C161E";
    this.ctx.fillText(this.text, this.textX, this.textY);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(this.text, this.textX - 2, this.textY - 2);
  }
}
