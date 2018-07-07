<template>
  <div class="image-editor">
    <button @click="$emit('input', null)">close</button>
    <button @click="clearImage">clear image</button>
    <div class="image-editor-wrapper">
      <div class="image-editor-toolbar">
        <ul>
          <li>
            <label for="">fill Box</label>
            <input type="checkbox" v-model="controls.fillBox"/>
          </li>
            <li>
              <label for="">Circle  </label>
              <input type="radio" value="circle" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="">Line</label>
              <input type="radio" value="line" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="">Arrow</label>
              <input type="radio" value="arrow" v-model="controls.shape" name="shape">
            </li>
            <li>
              <label for="">Text</label>
              <input type="radio" value="text" v-model="controls.shape" name="shape">
            </li>
          <li>
            <label for="">Line width</label>
            <input type="range" :min="1" v-model="controls.lineWidth" :max="50" />
          </li>
          <li>
            <label for="">fill color</label>
            <input type="color" v-model="controls.fillColor"/>
          </li>
          <li>
            <label for="">stroke color</label>
            <input type="color" v-model="controls.strokeColor"/>
          </li>
          <li>
            <label for="">text color</label>
            <input type="color" v-model="controls.textColor"/>
          </li>
          <li>
            <label for="">Font size</label>
            <input type="range" :min="1" v-model="controls.fontSize" :max="50" />
          </li>

        </ul>
      </div>
      <div class="image-editor-canvas">
        <canvas
          :width="imageSizes.widt" 
          :height="imageSizes.hegh" 
          ref="canvas"
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
    value: {
      type: String
    }
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
      }
    };
  },
  computed: {
    imageSizes() {
      const img = new Image();
      img.src = this.value;
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

      this.ctx.lineCap = "round";

      // draw image on canvas
      const img = new Image();
      img.src = this.value;
      img.onload = () => {
        console.log("image loaded");
        this.ctx.drawImage(img, 0, 0);
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
      if (this.controls.shape === "text") {
        let txt = this.$refs.canvas_text;
        txt.value = null;
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
    },

    onDragStop(event) {
      console.log("drag stop");
      this.dragging = false;
      this.draw(event);
    },

    drawLine(position) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.dragStartLocation.x, this.dragStartLocation.y);
      this.ctx.lineTo(position.x, position.y);
      this.ctx.stroke();
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
          this.drawText(pos, event);
          break;
        case "arrow":
          this.drawArrow(this.dragStartLocation.x, this.dragStartLocation.y, pos.x, pos.y);
          break;
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
      img.src = this.value;
      img.onload = () => {
        console.log("image loaded");
        this.ctx.drawImage(img, 0, 0);
      };
    },
    saveCanvasText(event) {
      const txt = this.$refs.canvas_text;
      console.log(this.canvas_text);
      if (this.canvas_text) {
        console.log(12, this.canvas_text);
        this.ctx.fillStyle = this.controls.textColor
        this.ctx.font = `${this.controls.fontSize}px serif`;
        const pos = this.getCanvasCoordinates({
          clientX: event.target.offsetLeft + event.target.clientWidth,
          clientY: event.target.offsetTop
        });
        console.log(event);
        this.ctx.fillText(this.canvas_text, pos.x, pos.y);
        this.canvas_text = null;
        this.$nextTick(() => {
          // this.canvas_text = null
          this.ctx.fillStyle = this.controls.fillColor
        });
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
