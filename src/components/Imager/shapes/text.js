const $lineHeight = 27;

const drawTextarea = (props, vm) => {
  const heig = props.toEvent.clientY - props.fromEvent.clientY;
  const widt = props.toEvent.clientX - props.fromEvent.clientX;

  const txt = vm.$refs.canvas_text;
  txt.style.height = `${Math.abs(heig)}px`;
  txt.style.width = `${Math.abs(widt)}px`;
  txt.querySelector('textarea').focus();
  txt.querySelector('textarea').style.lineHeight = $lineHeight < 2 ? $lineHeight : `${$lineHeight}px`;
};

const wrapText = (props, ctx, vm, storeInTheStack = true) => {
  const lines = props.text.split('\n');
  ctx.fillStyle = vm.controls.textColor;
  ctx.textBaseline = 'top';
  ctx.font = `${props.fontSize}px 'Avenir', Helvetica, Arial, sans-serif`;

  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = `${line + words[n]} `;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > props.maxWidth && n > 0) {
        ctx.fillText(line, props.x, props.y);
        line = `${words[n]} `;
        props.y += props.lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, props.x, props.y + i * props.lineHeight);
  }
  if (storeInTheStack) {
    vm.push(props);
    // drawTempDiv(props);
  }
};

const saveCanvasText = (props, ctx, vm) => {
  const txt = vm.$refs.canvas_text;
  if (vm.canvas_text) {
    const pos = props.from;
    wrapText({
      text: vm.canvas_text,
      textColor: vm.controls.textColor,
      fontSize: vm.controls.fontSize,
      x: pos.x,
      y: pos.y,
      lineHeight: $lineHeight,
      maxWidth: txt.clientWidth,
      type: 'text',
      timestamp: Date.now(),
    }, ctx, vm);
  }
  txt.style.display = 'none';
  vm.canvas_text = null;
};

const redrawText = (props, vm) => {
  // const el = document.querySelector('.canvas-temp-text');
  // el.parentNode.removeChild(el);
  wrapText(props, vm.ctx, vm, false);
};

const drawTempDiv = (props) => { //eslint-disable-line
  const textDiv = document.createElement('div');
  const canvasDiv = document.querySelector('.image-editor-canvas');

  textDiv.style.position = 'absolute';


  textDiv.style.top = `${props.y + 2}px`;
  textDiv.style.left = `${props.x}px`;

  textDiv.innerText = props.text;
  textDiv.style.fontSize = `${props.fontSize}px`;
  textDiv.style.color = props.textColor;
  textDiv.style.lineHeight = props.lineHeight;
  textDiv.className = 'canva-temp-text';

  canvasDiv.appendChild(textDiv);
};

const startTextFrom = (vm) => {
  vm.$nextTick(() => {
    const txt = vm.$refs.canvas_text;
    vm.canvas_text = '';
    txt.style.display = 'block';
    txt.style.width = 0;
    txt.style.left = `${vm.dragStartLocation.x}px`;
    txt.style.top = `${vm.dragStartLocation.y}px`;
    txt.addEventListener('mouseup', () => {
      vm.dragging = false;
    });
  });
};

export { drawTextarea };
export { saveCanvasText };
export { redrawText };
export { startTextFrom };
