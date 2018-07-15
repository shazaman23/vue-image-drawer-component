export default function drawPen(pos, context) {
  if (context.pen.lineStart) {
    context.pen.lastX = context.dragStartLocation.x;
    context.pen.lastY = context.dragStartLocation.y;
    context.pen.lineStart = false;
    context.ctx.beginPath();
  }
  context.ctx.lineTo(context.pen.lastX, context.pen.lastY);
  context.ctx.lineTo(pos.x, pos.y);
  context.ctx.stroke();
  context.pen.lastX = pos.x;
  context.pen.lastY = pos.y;
}
