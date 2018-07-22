<template>
  <div class="d-flex justify-content-between">
    <div>
      <i class="fa fa-trash mr-2" @click="$emit('onDelete', value.timestamp)"></i>
      <i class="fa fa-check" @click="isEdit = false" v-if="isEdit"></i>
      <i class="fa fa-edit" @click="showEdit" v-else></i>
    </div>
    <input 
      type="text"
      :value="value.text"
      style="width: 140px"
      ref="editText"
      v-if="isEdit"
      @change="saveText">
    <span v-else>{{value.text}}</span>
    <span :style="`background-color:${value.textColor}; width: 15px; height: 15px; border-radius: 50%`" class="d-inline-block"></span>
  </div>
</template>
<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {
      isEdit: false
    };
  },
  methods: {
    showEdit() {
      this.isEdit = true;
      this.$nextTick(function() {
        this.$refs.editText.focus();
      });
    },
    saveText(e) {
      const newVal = {...this.value};
      newVal.text = e.target.value
      this.$emit("input", newVal);
    }
  }
};
</script>
