<template>
  <div id="app">
    <Canvas />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Canvas from './components/Canvas.vue';

export default Vue.extend({
  name: 'app',
  components: {
    Canvas,
  },
});
</script>

<style lang="scss">
  body {
    padding: 0;
    margin: 0;
    background-color: #171717;
    color: #fefefe;
    height:100vh;
  }

  #defaultCanvas0 {
    margin: 0 auto;
    padding: 100px 0;
    position: relative;
    display: block !important;
  }
</style>
