function drawArrow(fromx, fromy, tox, toy, ctx) {
  const headlen = 10;

  const angle = Math.atan2(toy - fromy, tox - fromx);

  // starting path of the arrow from the start square to the end square and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.stroke();

  // starting a new path from the head of the arrow to one of the sides of the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

  // path from the side point of the arrow, to the other side point
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

  // path from the side point back to the tip of the arrow, and then again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

  // draws the paths created above
  ctx.stroke();
  ctx.fill();
}

export default drawArrow;
