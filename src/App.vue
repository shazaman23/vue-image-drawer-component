<template>
  <div id="app">
    <UploadImage />
  </div>
</template>

<script>
import UploadImage from './components/Imager/UploadImage.vue';
import Stack from './helpers/Stack';
export default {
  name: 'app',
  components: {
    UploadImage,
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
