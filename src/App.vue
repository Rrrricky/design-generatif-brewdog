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

  @font-face {
    font-family: "League";
    src: url("./assets/fonts/league.otf")
  }

  h1 {
    margin: 0;
  }

  body {
    padding: 0;
    margin: 0;
    background-color: #171717;
    color: #ededed;
    height:100vh;
    font-family: Roboto;
  }

  #defaultCanvas0 {
    margin: 0 auto;
    position: relative;
    display: block !important;
    background: #fefefe;
  }
</style>
