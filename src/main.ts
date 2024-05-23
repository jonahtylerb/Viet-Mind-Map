import * as localforage from "localforage";
import { rnd, flr, drawWire } from "./utils";
import "./style.css";
import exploder from "./exploder";
import pads from "./pads";

const scale = 3;

const words = [
  ["là", "is"],
  ["là nha", "is home"],
  ["là true", "is true"],
  ["eat là", "is eating"],
  ["eat", "eat"],
  ["eat an", "eat food"],
];

localforage.setItem("words", words);

// Canvas
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth / scale;
canvas.height = window.innerHeight / scale;

ctx.filter = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></svg>#f')`;
ctx.font = "23px Pin";
ctx.lineWidth = 2;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth / scale;
  canvas.height = window.innerHeight / scale;
  ctx.filter = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></svg>#f')`;
});

let allWords: string[] = [];

words.forEach((word) => {
  const newWords = word[0].split(" ");
  allWords.push(...newWords);
});

allWords = [...new Set(allWords)];

let laWords: any[] = words.filter((word) => word[0].includes("là"));

const startingAngle = Math.random() * 2 * Math.PI;
let radius = 100;
laWords.forEach((word, i) => {
  if (!i) {
    laWords[i] = pads.create(
      ctx,
      flr(canvas.width / 2),
      flr(canvas.height / 2),
      word[0],
    );
    return;
  }
  const angleStep = (2 * Math.PI) / (laWords.length - 1);
  const angle = startingAngle + i * angleStep;
  const x = canvas.width / 2 + radius * Math.cos(angle);
  const y = canvas.height / 2 + radius * Math.sin(angle);
  laWords[i] = pads.create(ctx, flr(x), flr(y), word[0]);
});

// pads.create(
//   ctx,
//   flr(canvas.width / 2),
//   flr(canvas.height / 2),
//   "Bạn có khỏe không hỗ trợ",
// );
//
// pads.create(ctx, flr(canvas.width / 2), flr(canvas.height / 4), "How are you?");

// Events
window.addEventListener("click", (e: MouseEvent) => {
  exploder.expload(e.clientX / scale, e.clientY / scale);
});

// const newStar = () => ({
//   x: rnd(canvas.width),
//   y: rnd(canvas.height),
//   dx: rnd(0.1),
//   dy: rnd(0.1),
//   color: rnd(155, 100),
// });
//
// type Star = ReturnType<typeof newStar>;
// const stars: Star[] = [];
//
// for (let i = 0; i < 20; i += 1) {
//   stars.push(newStar());
// }

let earthY = 0;
let earthX = 0;
const earthImg = document.getElementById("earth") as HTMLImageElement;

const earthPos = {
  x: flr(canvas.width / 2 - 256 / 2),
  y: flr(canvas.height / 2 - 256 / 2) + 100,
};

// Render function
const render = (dt: number, frame: number) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (frame % 6 === 0) {
    earthX += 256;
    if (earthX === earthImg.width) {
      earthX = 0;
      earthY += 256;
      if (earthY === earthImg.height) earthY = 0;
    }
  }
  ctx.drawImage(
    earthImg,
    earthX,
    earthY,
    256,
    256,
    earthPos.x,
    earthPos.y,
    256,
    256,
  );

  laWords.forEach((word, i) => {
    if (!i) return;
    drawWire(
      ctx,
      flr(word.x),
      flr(word.y) + 16,
      flr(laWords[0].x),
      flr(laWords[0].y) + 16,
    );
  });

  exploder.render(dt, ctx);
  pads.render(dt, frame);

  // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // const data = imageData.data;
  // stars.forEach((star, i) => {
  //   star.x += star.dx;
  //   star.y += star.dy;
  //   if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
  //   if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
  //
  //   const starIndex = flr(star.x) * 4 + flr(star.y) * 4 * canvas.width;
  //   data[starIndex] = star.color;
  //   data[starIndex + 1] = star.color;
  //   data[starIndex + 2] = star.color;
  //   ctx.putImageData(imageData, 0, 0);
  // });
};

// Animation loop
let last = 0;
let frame = 0;

const loop = (time: number) => {
  const dt = time - last;

  frame++;
  render(dt, frame);

  last = time;
  window.requestAnimationFrame(loop);
};

setTimeout(() => {
  window.requestAnimationFrame(loop);
}, 0);
