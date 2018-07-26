const onDragStop = (vm, pen) => (event) => {
  vm.dragging = false;
  const pos = vm.getCanvasCoordinates(event);
  const startFrom = vm.dragStartLocation;
  vm.dragStartLocationTemp = { ...startFrom };
  vm.draw(event);
  const shapeProps = {
    type: vm.controls.shape,
    from: startFrom,
    to: pos,
    strokeColor: vm.controls.strokeColor,
    lineWidth: vm.controls.lineWidth,
    timestamp: Date.now(),
  };
  if (vm.controls.shape === 'text') {
    vm.$refs.canvas_text.focus();
  } else if (vm.controls.shape === 'pen') {
    pen.lineStart = true;
    pen.lastX = null;
    pen.lastY = null;
  }
  if (vm.controls.shape !== 'text' && vm.controls.shape !== 'pen') {
    vm.push(shapeProps);
  }
};

export default onDragStop;
