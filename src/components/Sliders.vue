<template>
  <div>
    <div v-for="{ name, color, textColor, sliderValues, limits } of beerSpecs">
      <div class="q-pa-md sliders">
        <q-badge :color="color" :text-color="textColor">
          {{ name | capitalize }}:
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
          dark
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
    filters: {
      capitalize(value) {
        if (!value) {
          return '';
        }
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/tools/mixins';
</style>
