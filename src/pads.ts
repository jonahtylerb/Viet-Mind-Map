import Pad from "./pad";

type Pads = {
  create: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
  ) => void;
  render: (dt: number, frame: number) => void;
  list: Pad[];
};

const pads: Pads = {
  create: function (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
  ) {
    const newPad = new Pad(ctx, x, y, text);
    this.list.push(newPad);

    return newPad;
  },

  render: function (dt: number, frame: number) {
    this.list.forEach((pad) => pad.render(dt, frame));
  },
  list: [],
};

export default pads;
