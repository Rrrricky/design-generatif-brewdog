<template>
    <div>
        <vue-p5 @setup="setup"></vue-p5>
        <section class="beers">
            <article v-for="beer of beers">
                <div class="name" >{{ beer.name }}</div>
                <div class="description">{{ beer.tagline }}</div>
            </article>
        </section>
    </div>
</template>

<script lang="ts">
import VueP5 from 'vue-p5';
import Vue from 'vue';


interface Options {
    createCanvas: (...args: any) => void;
    noStroke: () => void;
    fill: (...args: number[]) => void;
    rect: (...args: number[]) => void;
}

export default Vue.extend({
  name: 'Canvas',
  components: {
    'vue-p5': VueP5,
  },
  data() {
      return {
        width: 300,
        height: 300,
        beers: [],
      };
  },
  mounted() {
      fetch('https://api.punkapi.com/v2/beers')
        .then((data) => data.json())
        .then((res) => {
            this.beers = res;
        });
  },
  methods: {
    setup(sketch: Options) {
      sketch.createCanvas(this.width, this.height);
      sketch.noStroke(); // No outline stroke
      sketch.fill(237, 0, 62); // Fill color
      sketch.rect(0, 0, this.width, this.height);
    },
  },
  render(h) {
    return h(VueP5, {on: this});
  },
});
</script>

<style lang="scss">
    .beers {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    article {
        width: 20vw;
        min-width: 200px;
        padding: 20px;
        margin: 20px 10px;
        cursor: pointer;
        border-radius: 10px;
        .name {
            font-weight: bold;
            font-size: 20px;
            padding-bottom: 5px;
        }
        .description {

        }
    }
</style>

