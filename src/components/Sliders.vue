<template>
  <div>
    <div v-for="{ name, color, sliderValues, limits } of beerSpecs">
      <div class="q-pa-md sliders">
        <q-badge :color="color">
          {{ name }}:
          <span v-if="sliderValues.value <= limits.medium">Low</span>
          <span v-else-if="sliderValues.value > limits.medium && sliderValues.value <= limits.high">Medium</span>
          <span v-else>High</span>
        </q-badge>
        <q-slider
          v-model="sliderValues.value"
          :min="sliderValues.min"
          :max="sliderValues.max"
          :step="sliderValues.step"
          snap
          :color="color"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Sliders',
    props: {
      beerSpecs: Object,
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/tools/mixins';

  .q-slider__track-container.absolute {
    background-color: rgba(120, 120, 120);
  }
</style>
