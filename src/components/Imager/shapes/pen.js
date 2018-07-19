const pen = {
  lastX: null,
  lastY: null,
  lineStart: true,
  drawPen(props, ctx) {
    if (pen.lineStart) {
      pen.lastX = props.from.x;
      pen.lastY = props.from.y;
      pen.lineStart = false;
      ctx.beginPath();
    }
    ctx.lineTo(pen.lastX, pen.lastY);
    ctx.lineTo(props.to.x, props.to.y);
    ctx.stroke();
    pen.lastX = props.to.x;
    pen.lastY = props.to.y;
  },
};

export default pen;
