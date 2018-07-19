<template>
  <div class="card my-4" v-if="value">
    <div class="card-header" id="text">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#line" aria-expanded="true" aria-controls="collapseOne">
          <i class="fa fa-ellipsis-v"></i> Lines
        </button>
      </h5>
    </div>

    <div id="line" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      <div class="card-body">
        <ul class="list-unstyled">
          <li v-for="el in value" :key="el.timestamps" class="d-flex justify-content-between my-3">
            <i class="fa fa-trash" @click="$emit('onDelete', el.timestamp)"></i>
            <span style="border-radius: 10px;width: 70px; height: 10px;" :style="`background-color: ${el.strokeColor}`" class="d-inline-block"></span>
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
