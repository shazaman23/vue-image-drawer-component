<template>
  <div @click="$emit('input', shape)" class="edit-shape d-flex flex-column" :class="{active: shape === value}">
    <i :class="`fa fa-${icon}`"></i>
    <div class="text-capitalize">{{shape}}</div>
  </div>
</template>
<script>
export default {
  props: {
    shape: {
      type: String,
    },
    icon: {
      type: String,
    },
    value: {},
  },
};
</script>
