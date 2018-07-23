<template>
  <div class="card my-4" v-if="value">
    <div class="card-header" id="text">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#arrow" aria-expanded="true" aria-controls="collapseOne">
          <i class="fa fa-long-arrow-down"></i> Arrows
        </button>
      </h5>
    </div>

    <div id="arrow" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      <div class="card-body">
        <ul class="list-unstyled">
          <li v-for="el in value" :key="el.timestamps" class="d-flex justify-content-between my-1">
            <i class="fa fa-trash" @click="$emit('onDelete', el.timestamp)"></i>
            <i class="fa fa-long-arrow-left" style="font-size: 30px; font-weight: bold" :style="`color: ${el.strokeColor}`"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {}
  }
};
</script>
