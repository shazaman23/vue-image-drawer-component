const onDragging = vm => (event) => {
  if (vm.dragging) {
    vm.draw(event);
  }
};

export default onDragging;
