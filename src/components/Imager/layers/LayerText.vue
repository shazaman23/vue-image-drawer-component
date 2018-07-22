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
          <LayerTextElement
           v-for="el in textProps" 
           :key="el.timestamp" 
           :value="el"
           @onDelete="$emit('onDelete', $event)"
           @input="onTextUpdated"/>
      </div>
    </div>
  </div>
</template>
<script>
import LayerTextElement from './LayerTextElement'
export default {
  components: { LayerTextElement },
  props: {
    value: {
      type: Array
    }
  },
  data () {
    return {
      textProps: [...this.value]
    }
  },
  updated () {
    // this.textProps = [...this.value]
  },
  methods: {
    onTextUpdated(value) {
      const propIndex = this.textProps.findIndex(el => el.timestamp === value.timestamp);
      this.textProps.splice(propIndex, 1, value);
      this.$emit("textUpdated", value);
    }
  },
  watch: {
    "value": function(newProps, oldProps){
      this.textProps = newProps
    }
  }
};
</script>
