<template>
  <div class="card my-4" v-if="value">
    <div class="card-header" id="text">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#circle" aria-expanded="true" aria-controls="collapseOne">
          <i class="fa fa-genderless"></i> circle
        </button>
      </h5>
    </div>

    <div id="circle" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      <div class="card-body">
        <ul class="list-unstyled">
          <li v-for="el in value" :key="el.timestamps" class="d-flex justify-content-between my-3">
            <i class="fa fa-trash" @click="$emit('onDelete', el.timestamp)"></i>
            <span style="border-radius: 50%;width: 30px; height: 30px;" :style="`border: solid 6px ${el.strokeColor}`" class="d-inline-block"></span>
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
