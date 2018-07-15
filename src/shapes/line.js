export default function drawLine(position, context) {
  context.ctx.beginPath();
  context.ctx.moveTo(context.dragStartLocation.x, context.dragStartLocation.y);
  context.ctx.lineTo(position.x, position.y);
  context.ctx.stroke();
}
