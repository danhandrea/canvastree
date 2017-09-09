//@flow
import Point from "./point.js";

export const circle = (
  ctx: CanvasRenderingContext2D,
  position: Point,
  radius: number
) => {
  return () => {
    ctx.beginPath();
    ctx.arc(
      position.x,
      position.y,
      radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "lightblue";
    ctx.fill();
  }
}