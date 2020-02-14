<template>
    <div>
        <vue-p5
          @setup="setup"
          @draw="draw"
        />
        <div class="cursors">
            <Sliders :beerSpecs="beerSpecs" @custom-input="result(sketchSaved)"/>
            <Dialog :selectedBeers="selectedBeers" @find-beer="findBeer" />
        </div>
        <div class="board">
            <section class="introduction">
                <div class="introduction-text">
                    <h1 class="text-h1 introduction-title">BrewDog generator</h1>
                    <p class="introduction-description text-weight-light">
                        A decade ago there was a revolution. A beer revolution.
                        Punk IPA is the beer that kick-started it. This light,
                        golden classic has been subverted with new world hops to
                        create an explosion of flavour. Bursts of caramel and tropical
                        fruit with an all-out riot of grapefruit, pineapple and lychee,
                        precede a spiky bitter finish. This is the beer that started it
                        all - and it’s not done yet....
                    </p>
                </div>
            </section>
            <section class="listBeers">
                <div class="q-pa-md dropdown-sort" style="max-width: 300px">
                    <div class="q-gutter-md">
                        <q-select v-model="model" :options="options" label="Sort by:" dark @input="sortedBeers(model)" />
                    </div>
                </div>
                <transition-group name="flip-list" class="beers" tag="div">
                    <article class="beer-card" v-for="beer of beers" :key="beer.id">
                        <div class="beer-name">{{ beer.name }}</div>
                        <div class="beer-description">{{ beer.tagline }}</div>
                        <ul>
                            <li>Sugar: {{ beer.target_fg }}</li>
                            <li>pH: {{ beer.ph }}</li>
                            <li>Alcohol: {{ beer.abv }}%</li>
                            <li>Bitter: {{ beer.ibu }} IBU</li>
                        </ul>
                    </article>
                </transition-group>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import VueP5 from 'vue-p5';
import Vue from 'vue';
import Sliders from './Sliders.vue';
import Dialog from './Dialog.vue';

interface Options {
    createCanvas: (arg0: number, arg1: number) => void;
    noStroke: () => void;
    fill: (...args: number[]) => void;
    rect: (...args: number[]) => void;
    angleMode: (...args: number[]) => void;
    color: (...args: any) => number;
    DEGREES: any;
    noLoop: () => void;
    redraw: () => void;
    clear: () => void;
    createButton: (arg0: string) => void;
    button: any;
    abs: (arg0: number) => number;
    random: (arg0: number) => number;
    rotate: (arg0: number) => void;
    PI: number;
}

export default Vue.extend({
  name: 'Canvas',
  components: {
    'vue-p5': VueP5,
    Sliders,
    Dialog,
  },
  data() {
      return {
        ingredientSelected: '',
        sketchSaved: {},
        width: 300,
        height: 300,
        beers: [],
        bitters: [],
        alert: false,
        beerSpecs: {
            alcohol: {
                name: 'alcohol',
                unit: 'abv',
                color: 'pink-4',
                limits: {
                    medium: 6,
                    high: 10,
                },
                sliderValues: {
                    value: 4,
                    min: 4,
                    max: 15,
                    step: 1,
                },
            },
            sugar: {
                name: 'sugar',
                unit: 'target_fg',
                color: 'red',
                limits: {
                    medium: 1030,
                    high: 1050,
                },
                sliderValues: {
                    value: 1000,
                    min: 1000,
                    max: 1060,
                    step: 1,
                },
            },
            acidity: {
                name: 'pH',
                unit: 'ph',
                color: 'purple',
                limits: {
                    medium: 4,
                    high: 5,
                },
                sliderValues: {
                    value: 3,
                    min: 3,
                    max: 6,
                    step: .5,
                },
            },
            bitter: {
                name: 'bitter',
                unit: 'ibu',
                color: 'yellow-9',
                limits: {
                    medium: 40,
                    high: 70,
                },
                sliderValues: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 10,
                },
            },
        },
        selectedBeers: null,
        model: null,
        options: [
          'Alcohol', 'Sugar', 'Acidity', 'Bitter',
        ],
      };
  },
  mounted() {
      fetch('https://api.punkapi.com/v2/beers')
        .then((data) => data.json())
        .then((res) => {
            (this as any).beers = res;
        });
      window.addEventListener('resize', () => {
          (this as any).result((this as any).sketchSaved);
      });
  },
  updated(): void {
      (this as any).beers.map((beer: { ibu: number; }) => {
          (this as any).bitters.push(beer.ibu);
      });
  },
  methods: {
      setup(sketch: Options) {
          (this as any).sketchSaved = sketch;
          sketch.createCanvas(window.innerWidth, window.innerHeight / 2);
          sketch.noStroke(); // No outline stroke
          sketch.angleMode(sketch.DEGREES);
          sketch.noLoop();
      },
      draw(sketch: Options) {
          const color = sketch.color(`hsb(44, ${(this as any).beerSpecs.bitter.sliderValues.value}%, 97%)`);
          sketch.fill(color);
          for (let i = 0; i < window.innerWidth; i += 100) { // col
              for (let j = 0; j < window.innerHeight / 2; j += 100) { // row
                  sketch.rotate(sketch.PI / 3.0);
                  sketch.rect(
                    i + 10, // posx
                    j - 10 * sketch.random((this as any).beerSpecs.alcohol.sliderValues.value ** 2 / 4), // posy
                    1080 - (this as any).beerSpecs.sugar.sliderValues.value, // width
                    50, // height
                    sketch.abs((this as any).beerSpecs.acidity.sliderValues.value - 3) * 10, // radius
                  );
              }
          }
      },
      result(sketchSaved: any) {
          sketchSaved.clear();
          sketchSaved.createCanvas(window.innerWidth, window.innerHeight / 2);
          sketchSaved.canvas.style.width = '100vw';
          sketchSaved.redraw();
      },
      findBeer() {
          // Filter by abv
          let beerResult = (this as any).beers
            // tslint:disable-next-line:max-line-length
            .filter((beer: {abv: number; }) => beer.abv > (this as any).beerSpecs.alcohol.sliderValues.value - 2 && beer.abv < (this as any).beerSpecs.alcohol.sliderValues.value + 2);

          // Then filter by fg
          if (beerResult.length > 1) {
              // tslint:disable-next-line:max-line-length
              beerResult = beerResult.filter((beer: { target_fg: number; }) => beer.target_fg > (this as any).beerSpecs.sugar.sliderValues.value  - 30 && beer.target_fg < (this as any).beerSpecs.sugar.sliderValues.value + 30);
          }

          // Then filter by pH
          if (beerResult.length > 1) {
              // tslint:disable-next-line:max-line-length
              beerResult = beerResult.filter((beer: { ph: number; }) => beer.ph > (this as any).beerSpecs.acidity.sliderValues.value - 1 && beer.ph < (this as any).beerSpecs.acidity.sliderValues.value + 2);
          }

          // Then filter by bitter
          if (beerResult.length > 1) {
              // tslint:disable-next-line:max-line-length
              beerResult = beerResult.filter((beer: { ibu: number; }) => beer.ibu > (this as any).beerSpecs.bitter.sliderValues.value - 25 && beer.ibu < (this as any).beerSpecs.bitter.sliderValues.value + 25);
          }
          // tslint:disable-next-line:max-line-length
          beerResult.length === 0 ? (this as any).selectedBeers = 'This kinda beer would be messed up... Try something else!' : (this as any).selectedBeers = beerResult;
      },
      sortedBeers(value) {
          (this as any).ingredientSelected = value.toLowerCase();
          const ingredient = (this as any).ingredientSelected;
          const unit = (this as any).beerSpecs[ingredient].unit;
          (this as any).beers.sort((a: [number], b: [number]) => a[unit] - b[unit]);
      },
  },
  render(h) {
    return h(VueP5, {on: this});
  },
});
</script>

<style lang="scss">
    @import '~quasar-styl';

    .flip-list-move {
      transition: transform 1s;
    }
</style>
