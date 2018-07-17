export default function drawCircle(props, ctx) {
  const radius = Math.sqrt(Math.pow(props.from.x - props.to.x, 2) + Math.pow(props.from.y - props.to.y, 2));
  ctx.beginPath();
  ctx.arc(
    props.from.x,
    props.from.y,
    radius,
    0,
    Math.PI * 2,
    false,
  );
  ctx.stroke();
}
