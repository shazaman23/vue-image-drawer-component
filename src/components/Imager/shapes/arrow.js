export default function drawArrow(props, ctx) {
  const headlen = 10;

  const angle = Math.atan2(props.to.y - props.from.y, props.to.x - props.from.x);

  // starting path of the arrow from the start square to the end square and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(props.from.x, props.from.y);
  ctx.lineTo(props.to.x, props.to.y);
  ctx.stroke();
  // ctx.fillRect();

  // starting a new path from the head of the arrow to one of the sides of the point
  ctx.beginPath();
  ctx.moveTo(props.to.x, props.to.y);
  ctx.lineTo(
    props.to.x - headlen * Math.cos(angle - Math.PI / 7),
    props.to.y - headlen * Math.sin(angle - Math.PI / 7),
  );

  // path from the side point of the arrow, to the other side point
  ctx.lineTo(
    props.to.x - headlen * Math.cos(angle + Math.PI / 7),
    props.to.y - headlen * Math.sin(angle + Math.PI / 7),
  );

  // path from the side point back to the tip of the arrow, and then again to the opposite side point
  ctx.lineTo(props.to.x, props.to.y);
  ctx.lineTo(
    props.to.x - headlen * Math.cos(angle - Math.PI / 7),
    props.to.y - headlen * Math.sin(angle - Math.PI / 7),
  );

  // draws the paths created above
  ctx.stroke();
  ctx.fill();
}
