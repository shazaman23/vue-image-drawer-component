<template>
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
        <input type="radio" id="pen" value="pen" v-model="controls.shape" name="shape">
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
</template>
