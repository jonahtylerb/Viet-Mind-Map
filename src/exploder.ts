import { flr, rnd } from "./utils";

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  spd: number;
  r: number;
  l: number;
};

type Exploder = {
  life: number;
  balls: Ball[];
  newBall(x: number, y: number): Ball;
  render(dt: number, ctx: CanvasRenderingContext2D): void;
  expload(x: number, y: number, count?: number): void;
};

const exploder: Exploder = {
  life: 60,
  balls: [],

  newBall(x: number = 0, y: number = 0) {
    return {
      x: x,
      y: y,
      dx: rnd(-1, 0.5),
      dy: rnd(-1, 0.5),
      spd: rnd(0.2, 0.05),
      r: flr(rnd(8)),
      l: rnd(20, this.life),
    };
  },

  render(dt: number, ctx: CanvasRenderingContext2D) {
    if (!this.balls.length) return;

    ctx.fillStyle = "#f40";

    this.balls.forEach((ball, i) => {
      ball.x += ball.spd * ball.dx * dt;
      ball.y += ball.spd * ball.dy * dt;

      ball.l--;

      if (
        ball.l < 0 ||
        ball.x < 0 ||
        ball.y < 0 ||
        ball.x > ctx.canvas.width ||
        ball.y > ctx.canvas.height
      ) {
        this.balls.splice(i, 1);
      }

      if (ball.l < this.life / 1.4) {
        ctx.fillStyle = "#fc0";
        if (ball.r > 1) {
          ball.r -= 2 * ball.spd;
        } else {
          this.balls.splice(i, 1);
        }

        if (ball.l < this.life / 2) {
          ctx.fillStyle = "#333";
        }
      }
      ctx.beginPath();
      ctx.arc(flr(ball.x), flr(ball.y), flr(ball.r), 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#f40";
    });
  },

  expload(x: number, y: number, count: number = 50) {
    for (let i = 0; i < count; i++) {
      this.balls.push(this.newBall(x, y));
    }
  },
};

export default exploder;
