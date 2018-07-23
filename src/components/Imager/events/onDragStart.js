const onDragStart = vm => (event) => {
  vm.dragStartLocationEvent = event;
  vm.dragStartLocation = null;
  if (vm.dragStartLocation) {
    vm.$nextTick(() => {
      vm.dragStartLocation = vm.getCanvasCoordinates(event);
    });
  } else {
    vm.dragStartLocation = vm.getCanvasCoordinates(event);
  }
  vm.dragging = true;
  vm.takeSnapshot();
};

export default onDragStart;
