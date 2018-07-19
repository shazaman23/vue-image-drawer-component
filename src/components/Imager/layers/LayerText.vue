<template>
  <div class="card" v-if="value">
    <div class="card-header" id="text">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          <i class="fa fa-font"></i> text
        </button>
      </h5>
    </div>

    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      <div class="card-body">
        <div>
          <div v-for="el in value" :key="el.timestamp" class="d-flex justify-content-between">
            <i class="fa fa-trash" @click="$emit('onDelete', el.timestamp)"></i>
            <span>{{el.text}}</span>
            <span :style="`background-color:${el.textColor}; width: 15px; height: 15px; border-radius: 50%`" class="d-inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array
    }
  }
};
</script>
