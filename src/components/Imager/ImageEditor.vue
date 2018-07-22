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
        <div class="d-flex flex-column align-items-center border mb-2 p-2">
          <label for="text-color">undo</label>
          <button 
            class="btn btn-primary btn-sm"
            :class="{disabled: !shapesStack.dataStore.length}"
            :disabled="!shapesStack.dataStore.length"
            @click="undoShapes"
            >
              <i class="fa fa-undo"></i>
          </button>
        </div>
        <div class="d-flex flex-column align-items-center border mb-2 p-2">
          <label for="text-color">redo</label>
          <button
            class="btn btn-primary btn-sm"
            :class="{disabled: !shapesStack.redoStackDataStore.length}"
            :disabled="!shapesStack.redoStackDataStore.length"
            @click="redoShapes"
            >
              <i class="fa fa-undo" style="transform: rotateY(180deg)"></i>
            </button>
        </div>
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
                <div ref="canvas_text" class="canvas-text">
                  <textarea
                    @blur="saveCanvasText"
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
          <div class="col-md-2">
            <div id="accordion">
              <LayerText
                :value="listShapesALayer('text')"
                v-if="listShapesALayer('text').length"
                @onDelete="deleteShape"
                @textUpdated="textUpdated"
                 />
              <LayerLine
                :value="listShapesALayer('line')"
                v-if="listShapesALayer('line').length"
                @onDelete="deleteShape"
                 />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditorShape from "./EditorShape";
// Shapes
import drawCircle from "./shapes/circle";
import drawArrow from "./shapes/arrow";
import drawLine from "./shapes/line";
import { drawTextarea, saveCanvasText, startTextFrom, redrawText } from "./shapes/text";
import pen from "./shapes/pen";
// Draw Events
import onDragStart from "./events/onDragStart";
import onDragStop from "./events/onDragStop";
import onDragging from "./events/onDragging";
// Layers
import LayerText from './layers/LayerText';
import LayerLine from './layers/LayerLine';

export default {
  components: { EditorShape, LayerText, LayerLine },
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
        shape: "text",
        lineWidth: 6,
        strokeColor: "#800080",
        fillColor: "#800080",
        textColor: "#800080",
        fontSize: 40
      },
      shapesStack: {
        dataStore: [],
        redoStackDataStore: [],
        holderDataStore: []
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
    (function(vm) {
      vm.init();
      window.addEventListener("keyup", vm.ctrlZ);
    })(this);
  },
  methods: {
    ctrlZ(event) {
      if (event.keyCode == 90 && event.ctrlKey && event.keyCode === 16) {
        this.redoShapes()
      } else if (event.keyCode == 90 && event.ctrlKey) {
        this.undoShapes()
        console.log(":redo")
      }
    },
    reRenderShapes(type = 'undo') {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const self = this;
      let shapes = self.shapesStack.dataStore;
      this.initCanvasBg(() => {
        for (let i = 0; i < shapes.length; i++) {
          let shape = shapes[i]
          if (shape.type === 'line')
          {
            drawLine(shape, this.ctx);
          } else if(shape.type === 'text') {
            redrawText(shape, self)
          }
        }
      });
    },
    init() {
      this.canvas = this.$refs.canvas;
      this.canvas.style.width = "100%";
      // make canvas takes its parent width
      this.canvas.width = this.canvas.offsetWidth;
      // init canvas context
      this.ctx = this.canvas.getContext("2d");
      const c_div = document.querySelector(".image-editor-canvas");
      // shapes style
      this.ctx.strokeStyle = this.controls.strokeColor;
      this.ctx.fillStyle = this.controls.fillColor;
      this.ctx.lineWidth = this.controls.lineWidth;
      this.ctx.ClipToBounds = true;
      this.ctx.lineCap = "round";
      this.initCanvasBg();
    },
    listShapesALayer(shape){
      const arr = this.shapesStack.dataStore.filter(el => el.type === shape);
      return arr;
    },
    deleteShape(key) {
      const shapeIndex = this.shapesStack.dataStore.findIndex(shape => shape.timestamp === key);
      this.shapesStack.holderDataStore.push(this.shapesStack.dataStore[shapeIndex]);
      this.$set(this.shapesStack.dataStore[shapeIndex], "isDeleted", true);
      this.shapesStack.dataStore.splice(shapeIndex, 1);
      this.reRenderShapes()
    },
    textUpdated (updateTextProps) {
     const elIndex = this.shapesStack.dataStore.findIndex(el => el.timestamp === updateTextProps.timestamp);
     this.shapesStack.holderDataStore.push(this.shapesStack.dataStore[elIndex]);
     this.shapesStack.dataStore.splice(elIndex, 1);
     this.push(updateTextProps);
     this.reRenderShapes();
    },
    initCanvasBg(callback) {
      // draw image on canvas
      const img = new Image();
      img.src = this.value.src;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        if (callback) {
          callback(true);
        }
      };
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
      this.shapesStack.dataStore = []
    },
    getCanvasCoordinates(event) {
      const x = event.clientX - this.canvas.getBoundingClientRect().left;
      const y = event.clientY - this.canvas.getBoundingClientRect().top;
      return {
        x,
        y
      };
    },
    // Mouse Events
    onDragStart(event) {
      if (this.controls.shape === 'text') {
        startTextFrom(this);
      }
      return onDragStart(this)(event);
    },
    onDragging(event) {
      return onDragging(this)(event);
    },
    onDragStop(event) {
      return onDragStop(this, pen)(event);
    },

    draw(event) {
      const pos = this.getCanvasCoordinates(event);
      this.getSnapshot();
      switch (this.controls.shape) {
        case "line":
          drawLine(
            {
              type: this.controls.shape,
              from: this.dragStartLocation,
              to: pos,
              strokeColor: this.controls.strokeColor,
              lineWidth: this.controls.lineWidth
            },
            this.ctx
          );
          break;
        case "circle":
          drawCircle({ from: this.dragStartLocation, to: pos }, this.ctx);
          break;
        case "pen":
          pen.drawPen({ to: pos, from: this.dragStartLocation }, this.ctx);
          break;
        case "text":
          drawTextarea(
            { fromEvent: this.dragStartLocationEvent, toEvent: event },
            this
          );
          break;
        case "arrow":
          drawArrow({ from: this.dragStartLocation, to: pos }, this.ctx);
          break;
      }
    },

    saveCanvasAsImage() {
      const imgDataUrl = this.canvas.toDataURL("image/png");
      this.$nextTick(() => {
        this.$emit("input", { src: imgDataUrl, key: this.value.key });
      });
    },
    saveCanvasText(event) {
      return saveCanvasText({ from: this.dragStartLocation }, this.ctx, this);
    },

    push (element) {
      this.shapesStack.dataStore.push(element);
    },
    pop () {
      const pop = this.shapesStack.dataStore.pop();
      return pop;
    },
    redoPush (element) {
      this.shapesStack.redoStackDataStore.push(element);
    },
    redoPop () {
      const pop = this.shapesStack.redoStackDataStore.pop()
      return pop;
    },
    undoShapes() {
      if (this.shapesStack.holderDataStore.length) {
        const shape = this.shapesStack.holderDataStore.pop();
        if (shape.type === "text" && !shape.isDeleted) {
          const undoShape = this.pop();
          this.redoPush(undoShape);
        }
        this.push(shape)
        this.reRenderShapes()
      }
      else if (this.shapesStack.dataStore.length) {
        const shape = this.pop();
        if (!shape) return;
        this.redoPush(shape);
        this.reRenderShapes()
      }
    },
    redoShapes() {
      if (this.shapesStack.redoStackDataStore.length) {
        const shape = this.redoPop();
        this.push(shape);
        this.reRenderShapes('redo')
      }
    }
  },
  watch: {
    "controls.lineWidth": function(nVal, oldVal) {
      this.ctx.lineWidth = nVal;
    },
    "controls.strokeColor": function(nVal, oldVal) {
      this.ctx.strokeStyle = nVal;
      this.ctx.fillStyle = nVal;
    },
    "controls.shape": function(nVal, oldVal) {
      this.$refs.canvas_text.style.display = "none";
    }
  }
};
</script>
