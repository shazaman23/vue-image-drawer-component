export default function drawCircle(position, context) {
  const radius = Math.sqrt((context.dragStartLocation.x - position.x) ** 2 + (context.dragStartLocation.y - position.y, 2) ** 2);
  context.ctx.beginPath();
  context.ctx.arc(
    context.dragStartLocation.x,
    context.dragStartLocation.y,
    radius,
    0,
    Math.PI * 2,
    false,
  );
  if (context.controls.fillBox) {
    context.ctx.fill();
  } else {
    context.ctx.stroke();
  }
}
