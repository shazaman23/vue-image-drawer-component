export default function drawText(event, context) {
  const heig = event.y - context.dragStartLocationEvent.clientY;
  const widt = event.x - context.dragStartLocationEvent.clientX;

  const txt = context.$refs.canvas_text;
  txt.style.height = `${Math.abs(heig)}"px"`;
  txt.style.width = `${Math.abs(widt)}"px"`;
}
