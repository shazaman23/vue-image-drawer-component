const onDragStart = vm => (event) => {
  vm.dragStartLocationEvent = event;
  vm.dragStartLocation = vm.getCanvasCoordinates(event);
  vm.dragging = true;
  vm.takeSnapshot();
};

export default onDragStart;
