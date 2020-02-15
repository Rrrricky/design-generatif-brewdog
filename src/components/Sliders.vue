<template>
  <div>
    <div v-for="beerSpec of beerSpecs">
      <div class="q-pa-md sliders">
        <q-badge :color="beerSpec.color">
          {{ beerSpec.name }}:
          <span v-if="beerSpec.sliderValues.value <= beerSpec.limits.medium">Low</span>
          <span v-else-if="beerSpec.sliderValues.value > beerSpec.limits.medium && beerSpec.sliderValues.value <= beerSpec.limits.high">Medium</span>
          <span v-else>High</span>
        </q-badge>
        <q-slider
          v-model="beerSpec.sliderValues.value"
          :min="beerSpec.sliderValues.min"
          :max="beerSpec.sliderValues.max"
          :step="beerSpec.sliderValues.step"
          snap
          :color="beerSpec.color"
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
