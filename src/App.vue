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
  @import './styles/app.scss';
</style>
