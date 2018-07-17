export default function drawLine(props, ctx) {
  ctx.beginPath();
  ctx.moveTo(props.from.x, props.from.y);
  ctx.lineTo(props.to.x, props.to.y);
  ctx.lineWidth = props.lineWidth;
  ctx.strokeStyle = props.strokeColor;
  ctx.stroke();
}
