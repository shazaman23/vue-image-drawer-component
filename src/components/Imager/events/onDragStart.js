const onDragStart = vm => (event) => {
  vm.dragStartLocationEvent = event;
  vm.dragStartLocation = vm.getCanvasCoordinates(event);
  vm.dragging = true;
  vm.takeSnapshot();
  vm.$nextTick(() => {
    if (vm.controls.shape === 'text') {
      const txt = vm.$refs.canvas_text;
      vm.canvas_text = '';
      txt.style.display = 'block';
      txt.style.width = 0;
      txt.style.left = `${vm.dragStartLocation.x}px`;
      txt.style.top = `${vm.dragStartLocation.y}px`;
      const self = vm;
      txt.addEventListener('mouseup', () => {
        self.dragging = false;
      });
    }
  });
};

export default onDragStart;
