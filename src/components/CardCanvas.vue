<template>
  <div>
    <section class="listBeers">
      <div class="canvas-selection" ref="canvasSelection">
        <vue-p5
          @setup="setupCard"
          @draw="drawCard"
          class="beer-canvas"
        />
        <transition-group name="flip-list" class="beers" tag="div" ref="card" v-if="beers.length">
          <article @click="generateDesign(index)" class="beer-card" v-for="({ name, tagline, target_fg, ph, abv, ibu, image_url }, index) of beers" :key="name" ref="card">
            <div class="beer-name">{{ name }}</div>
            <div class="beer-description">{{ tagline }}</div>
            <!--
            <ul class="beer-proportions">
              <li>Sugar: {{ target_fg }}</li>
              <li>Acidity: {{ ph }}</li>
              <li>Alcohol: {{ abv }}%</li>
              <li>Bitter: {{ ibu }} IBU</li>
              -->
              <!-- <li><img class="beer-pic" width="70" :src="image_url" alt="" crossOrigin="anonymous"></li> -->
            </ul>
          </article>
        </transition-group>
      </div>
    </section>
  </div>
</template>

<script>
  import VueP5 from 'vue-p5';
  export default {
    name: 'CardCanvas',
    components: {
      'vue-p5': VueP5,
    },
    props: {
      beers: {
        required: true,
      },
      beerChoice: {
        required: true,
      }
    },
    data() {
      return {
        beerChoice: [],
      }
    },
    methods: {
      setupCard(sketch) {
        sketch.createCanvas(window.innerWidth / 2, this.$refs.canvasSelection.offsetHeight);
      },

      drawCard(sketch) {
        const _ = this;
        if (_.beerChoice !== null) {
          console.log(_.beerChoice);
          sketch.background(sketch.color('#fcfcfc'));
          const color = sketch.color(`hsb(44, ${_.beerChoice.ibu}%, 97%)`);
          sketch.fill(color);
          for (let i = 0; i < window.innerWidth; i += 100) { // col
            for (let j = 0; j < window.innerHeight / 2; j += 100) { // row
              sketch.rotate(sketch.PI / 3.0);
              sketch.rect(
                i + 10, // posx
                j - 10 + (sketch.noise(j / 10, 0, sketch.frameCount * 0.002) * 2 - 1) * 30, // posy
                50, // width
                50, // height
                sketch.abs(_.beerChoice.ph - 3) * 10, // radius
              );
            }
          }
        }
      },
      generateDesign(index) {
        const _ = this;
        _.beerChoice = _.beers[index];
      },
    }
  }
</script>

<style lang="scss" scoped>
  .flip-list-move {
    transition: transform 1s;
  }

  .canvas-selection {
    display: flex;
    align-items: center;
  }
</style>
