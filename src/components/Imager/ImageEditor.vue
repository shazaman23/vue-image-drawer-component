<template>
  <div class="image-editor">
    <div class="container-fluid">
      <div class="edit-shape d-flex text-center my-3 text-capitalize">
        <template v-if="controls.shape !== 'text'">
          <div class="d-flex flex-column align-items-center border mb-2 p-2">
            <label for="line-width">Line width</label>
            <input type="range" id="line-width" :min="1" v-model="controls.lineWidth" :max="50" />
          </div>
          <div class="d-flex flex-column align-items-center border mb-2 p-2">
            <label for="stroke-color">stroke color</label>
            <input type="color" id="stroke-color" v-model="controls.strokeColor"/>
          </div>
        </template>
        <template v-else>
          <div class="d-flex flex-column align-items-center border mb-2 p-2">
            <label for="font-size">Font size</label>
            <input type="range" id="font-size" :min="1" v-model="controls.fontSize" :max="50" />
          </div>
          <div class="d-flex flex-column align-items-center border mb-2 p-2">
            <label for="text-color">text color</label>
            <input type="color" id="text-color" v-model="controls.textColor"/>
          </div>
        </template>
      </div>
      <div class="mb-2">
        <button class="btn btn-primary" @click="$emit('input', null)">close</button>
        <button class="btn btn-primary mx-3" @click="clearImage">clear image</button>
        <button class="btn btn-primary" @click="saveCanvasAsImage">save changes</button>
      </div>
      <div class="image-editor-wrapper">
        <div class="row">
          <div class="col-md-2">
            <div class="image-editor-toolbar bar-bg">
              <EditorShape v-model="controls.shape" shape="circle" icon="genderless"/>
              <EditorShape v-model="controls.shape" shape="line" icon="ellipsis-v"/>
              <EditorShape v-model="controls.shape" shape="pen" icon="pencil"/>
              <EditorShape v-model="controls.shape" shape="text" icon="font"/>
              <EditorShape v-model="controls.shape" shape="arrow" icon="long-arrow-down"/>
            </div>
          </div>
            <div class="col-md-8">
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
          <div class="col-md-2">
            <div class="image-editor-toolbar bar-bg">
              <EditorShape v-model="controls.shape" shape="circle" icon="genderless"/>
              <EditorShape v-model="controls.shape" shape="line" icon="ellipsis-v"/>
              <EditorShape v-model="controls.shape" shape="pen" icon="pencil"/>
              <EditorShape v-model="controls.shape" shape="text" icon="font"/>
              <EditorShape v-model="controls.shape" shape="arrow" icon="long-arrow-down"/>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditorShape from "./EditorShape";
import Stack from "../../helpers/Stack";
export default {
  components: { EditorShape },
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
      window.addEventListener('keyup', vm.ctrlZ)
    })(this);
  },
  methods: {
    ctrlZ (event) {
      if (event.keyCode == 90 && event.ctrlKey) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Stack.pop()
        this.initCanvasBg(() => {
          for (let i = 0; i < Stack.length(); i++) {
            this.drawLine(Stack.dataStore[i], this.ctx)
          }
        })
      }
    },
    init() {
      this.canvas = this.$refs.canvas;
      this.canvas.style.width = "100%";
      // make canvas takes its parent width
      this.canvas.width = this.canvas.offsetWidth;
      // init canvas context
      this.ctx = this.canvas.getContext("2d");
      const c_div = document.querySelector('.image-editor-canvas');
      // shapes style
      this.ctx.strokeStyle = this.controls.strokeColor;
      this.ctx.fillStyle = this.controls.fillColor;
      this.ctx.lineWidth = this.controls.lineWidth;
      this.ctx.ClipToBounds = true;
      this.ctx.lineCap = "round";
      this.initCanvasBg()
    },
    initCanvasBg (callback) {
      // draw image on canvas
      const img = new Image();
      img.src = this.value.src;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        if (callback) {
          callback(true)
        }
      };
    },
    onDragging(event) {
      if (this.dragging) {
        this.draw(event);
      }
    },
    onDragStart(event) {
      this.dragStartLocationEvent = event;
      this.dragStartLocation = this.getCanvasCoordinates(event);
      this.dragging = true;
      this.takeSnapshot();

      this.$nextTick(() => {
        if (this.controls.shape === "text") {
          let txt = this.$refs.canvas_text;
          this.canvas_text = "";
          txt.style.display = "block";
          txt.style.width = 0;
          txt.style.left = this.dragStartLocation.x + "px";
          txt.style.top = this.dragStartLocation.y + "px";
          const self = this;
          txt.addEventListener("mouseup", function() {
            self.dragging = false;
          });
        }
      });
    },

    onDragStop(event) {
      const pos = this.getCanvasCoordinates(event);
      const start_from = this.dragStartLocation;
      this.dragging = false;
      this.draw(event);
      if (this.controls.shape === "text") {
        this.$refs.canvas_text.focus();
      } else if (this.controls.shape === "pen") {
        this.pen.lineStart = true;
        this.pen.lastX = null;
        this.pen.lastY = null;
      } else if (this.controls.shape === "line") {
        const shapeProps = {
          type: this.controls.shape,
          start_from,
          position: pos,
          strokeColor: this.controls.strokeColor,
          lineWidth: this.controls.lineWidth
        };
        Stack.push(shapeProps);
      }
    },

    drawLine(opt, ctx) {
      ctx.beginPath();
      ctx.moveTo(opt.start_from.x, opt.start_from.y);
      ctx.lineTo(opt.position.x, opt.position.y);
      ctx.lineWidth = opt.lineWidth;
      ctx.strokeStyle = opt.strokeColor;
      ctx.stroke();
    },
    drawPen(pos) {
      if (this.pen.lineStart) {
        this.pen.lastX = this.dragStartLocation.x;
        this.pen.lastY = this.dragStartLocation.y;
        this.pen.lineStart = false;
        this.ctx.beginPath();
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
      this.ctx.stroke();
    },
    drawText(position, event) {
      let heig = event.clientY - this.dragStartLocationEvent.clientY;
      let widt = event.clientX - this.dragStartLocationEvent.clientX;

      const txt = this.$refs.canvas_text;
      txt.style.height = Math.abs(heig) + "px";
      txt.style.width = Math.abs(widt) + "px";
    },
    drawArrow(fromx, fromy, tox, toy) {
      var headlen = 10;

      var angle = Math.atan2(toy - fromy, tox - fromx);

      //starting path of the arrow from the start square to the end square and drawing the stroke
      this.ctx.beginPath();
      this.ctx.moveTo(fromx, fromy);
      this.ctx.lineTo(tox, toy);
      this.ctx.stroke();

      //starting a new path from the head of the arrow to one of the sides of the point
      this.ctx.beginPath();
      this.ctx.moveTo(tox, toy);
      this.ctx.lineTo(
        tox - headlen * Math.cos(angle - Math.PI / 7),
        toy - headlen * Math.sin(angle - Math.PI / 7)
      );

      //path from the side point of the arrow, to the other side point
      this.ctx.lineTo(
        tox - headlen * Math.cos(angle + Math.PI / 7),
        toy - headlen * Math.sin(angle + Math.PI / 7)
      );

      //path from the side point back to the tip of the arrow, and then again to the opposite side point
      this.ctx.lineTo(tox, toy);
      this.ctx.lineTo(
        tox - headlen * Math.cos(angle - Math.PI / 7),
        toy - headlen * Math.sin(angle - Math.PI / 7)
      );

      //draws the paths created above
      this.ctx.stroke();
      this.ctx.fill();
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
          const shapeProps = {
            type: this.controls.shape,
            start_from: this.dragStartLocation,
            position: pos,
            strokeColor: this.controls.strokeColor,
            lineWidth: this.controls.lineWidth
          };
          this.drawLine(shapeProps, this.ctx);
          break;
        case "circle":
          this.drawCircle(pos);
          break;
        case "pen":
          this.drawPen(pos);
          break;
        case "text":
          this.drawText(pos, event);
          break;
        case "arrow":
          this.drawArrow(
            this.dragStartLocation.x,
            this.dragStartLocation.y,
            pos.x,
            pos.y
          );
          break;
      }
    },
    wrapText(drawingContext, text, x, y, maxWidth, lineHeight) {
      var lines = text.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(" ");
        var line = "";
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + " ";
          var metrics = drawingContext.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            drawingContext.fillText(line, x, y);
            line = words[n] + " ";
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
      this.initCanvasBg();
    },
    saveCanvasAsImage() {
      const imgDataUrl = this.canvas.toDataURL("image/png");
      this.$nextTick(() => {
        this.$emit("input", { src: imgDataUrl, key: this.value.key });
      });
    },
    saveCanvasText(event) {
      const txt = this.$refs.canvas_text;
      if (this.canvas_text) {
        this.ctx.fillStyle = this.controls.textColor;
        this.ctx.textBaseline = "top";
        this.ctx.font = `${
          this.controls.fontSize
        }px 'Avenir', Helvetica, Arial, sans-serif`;
        const pos = this.getCanvasCoordinates({
          clientX: event.target.offsetLeft + event.target.clientWidth,
          clientY: event.target.offsetTop
        });
        // this.ctx.fillText(this.canvas_text, pos.x, pos.y);
        this.wrapText(
          this.ctx,
          this.canvas_text,
          pos.x + 3,
          pos.y + 4,
          txt.clientWidth,
          25
        );
        this.canvas_text = null;
        this.$nextTick(() => {
          // this.canvas_text = null
          this.ctx.fillStyle = this.controls.fillColor;
        });
      } else {
        txt.style.display = "none";
      }
    }
  },
  watch: {
    "controls.lineWidth": function(nVal, oldVal) {
      this.ctx.lineWidth = nVal;
    },
    "controls.strokeColor": function(nVal, oldVal) {
      this.ctx.strokeStyle = nVal;
      this.ctx.fillStyle = nVal
    },
    "controls.shape": function(nVal, oldVal) {
      this.$refs.canvas_text.style.display = "none";
    }
  }
};
</script>
