<template>
  <div class="image-editor">
    <button @click="$emit('input', null)">close</button>
    <button @click="clearImage">clear image</button>
    <button @click="saveCanvasAsImage">save changes</button>
    <div class="image-editor-wrapper">
      <div class="image-editor-toolbar">
        <ul>
          <li>
            <label for="fill-box">fill Box</label>
            <input type="checkbox" id="fill-box" v-model="controls.fillBox"/>
          </li>
            <li>
              <label for="circle">Circle  </label>
              <input type="radio" id="circle" value="circle" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="line">Line</label>
              <input type="radio" id="line" value="line" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="arrow">Arrow</label>
              <input type="radio" id="arrow" value="arrow" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="pen">Pen</label>
              <input type="radio" id="arrow" value="pen" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="text">Text</label>
              <input type="radio" id="text" value="text" v-model="controls.shape" name="shape">
            </li>
          <li>
            <label for="line-width">Line width</label>
            <input type="range" id="line-width" :min="1" v-model="controls.lineWidth" :max="50" />
          </li>
          <li>
            <label for="fill-color">fill color</label>
            <input type="color" id="fill-color" v-model="controls.fillColor"/>
          </li>
          <li>
            <label for="stroke-color">stroke color</label>
            <input type="color" id="stroke-color" v-model="controls.strokeColor"/>
          </li>
          <li>
            <label for="text-color">text color</label>
            <input type="color" id="text-color" v-model="controls.textColor"/>
          </li>
          <li>
            <label for="font-size">Font size</label>
            <input type="range" id="font-size" :min="1" v-model="controls.fontSize" :max="50" />
          </li>

        </ul>
      </div>
      <div class="image-editor-canvas">
        <canvas
          ref="canvas"
          width="800"
          height="800"
          @mousemove="onDragging"
          @mouseup="onDragStop"
          @mousedown="onDragStart">
        </canvas>
        <textarea
          @blur="saveCanvasText"
          ref="canvas_text" 
          width="0" 
          v-model="canvas_text"
          :style="{
            color: controls.textColor,
            fontSize: controls.fontSize+'px',
            borderColor: controls.strokeColor,
            backgroundColor: controls.fillBox ? controls.fillColor : 'transparent' }">
        </textarea>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      dragging: false,
      snapshot: null,
      dragStartLocation: null,
      dragStartLocationEvent: null,
      canvas_text: null,
      controls: {
        fillBox: false,
        shape: "line",
        lineWidth: 6,
        strokeColor: "#800080",
        fillColor: "#800080",
        textColor: "#800080",
        fontSize: 14
      },
      pen: {
        lastX: null,
        lastY: null,
        lineStart: true
      }
    };
  },
  computed: {
    imageSizes() {
      const img = new Image();
      img.src = this.value.src;
      return {
        widt: img.width,
        hegh: img.height
      };
    }
  },
  mounted() {
    // console.log('mounted')
    (function(vm) {
      vm.init();
    })(this);
  },
  methods: {
    init() {
      console.log("init method");
      this.canvas = this.$refs.canvas;
      // init canvas context
      this.ctx = this.canvas.getContext("2d");
      // shapes style
      this.ctx.strokeStyle = this.controls.strokeColor;
      this.ctx.fillStyle = this.controls.fillColor;
      this.ctx.lineWidth = this.controls.lineWidth;
      this.ctx.ClipToBounds = true

      this.ctx.lineCap = "round";

      // draw image on canvas
      const img = new Image();
      img.src = this.value.src;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
        this.drawImageProp(this.ctx, img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0.1, 0.5);

      };
    },
    onDragging(event) {
      console.log("dragging");
      if (this.dragging) {
        this.draw(event);
      }
    },
    onDragStart(event) {
      console.log("drag start");
      this.dragging = true;
      this.takeSnapshot();
      this.dragStartLocation = this.getCanvasCoordinates(event);

      this.$nextTick(() => {
        if (this.controls.shape === "text") {
          let txt = this.$refs.canvas_text;
          this.canvas_text = '';
          txt.style.display = "block";
          txt.style.width = 0;
          txt.style.left = event.clientX + "px";
          txt.style.top = event.clientY + "px";
          this.dragStartLocationEvent = event;
          const self = this;
          txt.addEventListener("mouseup", function() {
            self.dragging = false;
          });
        }
      })
    },

    onDragStop(event) {
      console.log("drag stop");
      this.dragging = false;
      this.draw(event);
      if (this.controls.shape === 'text') {
        this.$refs.canvas_text.focus()
        console.log('focused')
      } else if(this.controls.shape === 'pen') {
        this.pen.lineStart = true
        this.pen.lastX = null
        this.pen.lastY = null
      }
    },

    drawLine(position) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.dragStartLocation.x, this.dragStartLocation.y);
      this.ctx.lineTo(position.x, position.y);
      this.ctx.stroke();
    },
    drawPen(pos) {
      if(this.pen.lineStart){
        this.pen.lastX = this.dragStartLocation.x;
        this.pen.lastY = this.dragStartLocation.y;
        this.pen.lineStart = false;
        this.ctx.beginPath()
      }
      this.ctx.lineTo(this.pen.lastX, this.pen.lastY);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      this.pen.lastX = pos.x;
      this.pen.lastY = pos.y;
    },
    drawCircle(position) {
      const radius = Math.sqrt(
        Math.pow(this.dragStartLocation.x - position.x, 2) +
          Math.pow(this.dragStartLocation.y - position.y, 2)
      );
      this.ctx.beginPath();
      this.ctx.arc(
        this.dragStartLocation.x,
        this.dragStartLocation.y,
        radius,
        0,
        Math.PI * 2,
        false
      );
      if (this.controls.fillBox) {
        this.ctx.fill();
      } else {
        this.ctx.stroke();
      }
    },
    drawText(position, event) {
      let heig = event.clientY - this.dragStartLocationEvent.clientY;
      let widt = event.clientX - this.dragStartLocationEvent.clientX;

      const txt = this.$refs.canvas_text;
      txt.style.height = Math.abs(heig) + "px";
      txt.style.width = Math.abs(widt) + "px";
    },
    drawArrow(fromx, fromy, tox, toy){
      var headlen = 10;

      var angle = Math.atan2(toy-fromy,tox-fromx);

      //starting path of the arrow from the start square to the end square and drawing the stroke
      this.ctx.beginPath();
      this.ctx.moveTo(fromx, fromy);
      this.ctx.lineTo(tox, toy);
      this.ctx.stroke();

      //starting a new path from the head of the arrow to one of the sides of the point
      this.ctx.beginPath();
      this.ctx.moveTo(tox, toy);
      this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

      //path from the side point of the arrow, to the other side point
      this.ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

      //path from the side point back to the tip of the arrow, and then again to the opposite side point
      this.ctx.lineTo(tox, toy);
      this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

      //draws the paths created above
      this.ctx.stroke();
      this.ctx.fill();
    },
    drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

        if (arguments.length === 2) {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }

        // default offset is center
        offsetX = typeof offsetX === "number" ? offsetX : 0.5;
        offsetY = typeof offsetY === "number" ? offsetY : 0.5;

        // keep bounds [0.0, 1.0]
        if (offsetX < 0) offsetX = 0;
        if (offsetY < 0) offsetY = 0;
        if (offsetX > 1) offsetX = 1;
        if (offsetY > 1) offsetY = 1;

        var iw = img.width,
            ih = img.height,
            r = Math.min(w / iw, h / ih),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;

        // decide which gap to fill    
        if (nw < w) ar = w / nw;                             
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
        nw *= ar;
        nh *= ar;

        // calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);

        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        // make sure source rectangle is valid
        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        // fill image in dest. rectangle
        ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
    },
    getCanvasCoordinates(event) {
      const x = event.clientX - this.canvas.getBoundingClientRect().left;
      const y = event.clientY - this.canvas.getBoundingClientRect().top;
      return {
        x,
        y
      };
    },
    draw(event) {
      const pos = this.getCanvasCoordinates(event);
      this.getSnapshot();
      switch (this.controls.shape) {
        case "line":
          this.drawLine(pos);
          break;
        case "circle":
          this.drawCircle(pos);
          break;
        case "text":
        case "pen":
          this.drawPen(pos);
          break;
        case "text":
          this.drawText(pos, event);
          break;
        case "arrow":
          this.drawArrow(this.dragStartLocation.x, this.dragStartLocation.y, pos.x, pos.y);
          break;
      }
    },
    wrapText (drawingContext, text, x, y, maxWidth, lineHeight) {
      var lines = text.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
        var line = '';
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = drawingContext.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            drawingContext.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        drawingContext.fillText(line, x, y + i * lineHeight);
      }
    },
    takeSnapshot() {
      this.snapshot = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    },
    getSnapshot() {
      this.ctx.putImageData(this.snapshot, 0, 0);
    },
    clearImage() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // draw image on canvas
      const img = new Image();
      img.src = this.value.src;
      img.onload = () => {
        this.drawImageProp(this.ctx, img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0.1, 0.5);
      };
    },
    saveCanvasAsImage () {
      const imgDataUrl = this.canvas.toDataURL('image/png')
      this.$nextTick(() => {
        this.$emit('input', {src:imgDataUrl, key: this.value.key})
      })
    },
    saveCanvasText(event) {
      const txt = this.$refs.canvas_text;
      console.log(this.canvas_text);
      if (this.canvas_text) {
        console.log(12, this.canvas_text);
        this.ctx.fillStyle = this.controls.textColor
        this.ctx.textBaseline = 'top'
        this.ctx.font = `${this.controls.fontSize}px 'Avenir', Helvetica, Arial, sans-serif`;
        const pos = this.getCanvasCoordinates({
          clientX: event.target.offsetLeft + event.target.clientWidth,
          clientY: event.target.offsetTop
        });
        console.log('event', txt.clientWidth);
        // this.ctx.fillText(this.canvas_text, pos.x, pos.y);
        this.wrapText(this.ctx, this.canvas_text, pos.x + 3, pos.y + 4, txt.clientWidth, 25)
        this.canvas_text = null;
        this.$nextTick(() => {
          // this.canvas_text = null
          this.ctx.fillStyle = this.controls.fillColor
        });
      } else {
        txt.style.display = 'none'
      }
    }
  },
  watch: {
    "controls.lineWidth": function(nVal, oldVal) {
      this.ctx.lineWidth = nVal;
    },
    "controls.strokeColor": function(nVal, oldVal) {
      this.ctx.strokeStyle = nVal;
      console.log("strokeColor", nVal);
    },
    "controls.fillColor": function(nVal, oldVal) {
      console.log("fillColor", nVal);
      this.ctx.fillStyle = nVal;
    },
    "controls.shape": function(nVal, oldVal) {
      this.$refs.canvas_text.style.display = "none";
    }
  }
};
</script>
