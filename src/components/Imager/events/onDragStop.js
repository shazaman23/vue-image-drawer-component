const onDragStop = (vm, pen) => (event) => {
  const pos = vm.getCanvasCoordinates(event);
  const startFrom = vm.dragStartLocation;
  vm.dragging = false;
  vm.draw(event);
  if (vm.controls.shape === 'text') {
    vm.$refs.canvas_text.focus();
  } else if (vm.controls.shape === 'pen') {
    pen.lineStart = true;
    pen.lastX = null;
    pen.lastY = null;
  } else if (vm.controls.shape === 'line') {
    const shapeProps = {
      type: vm.controls.shape,
      from: startFrom,
      to: pos,
      strokeColor: vm.controls.strokeColor,
      lineWidth: vm.controls.lineWidth,
      timestamp: Date.now(),
    };
    vm.push(shapeProps);
  }
};

export default onDragStop;
