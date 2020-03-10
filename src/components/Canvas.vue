<template>
    <div>
        <!--

        <vue-p5
          @setup="setup"
          @draw="draw"
          ref="canvas"
          class="main-canvas"
        />
        <div class="cursors">
            <Sliders :beerSpecs="beerSpecs"/>
            <Dialog :selectedBeers="selectedBeers" @find-beer="findBeer" />
        </div>

        -->
        <div class="board" ref="board">
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
                        <q-select v-model="model" :options="options" label="Sort by:" @input="sortedBeers(model)" />
                    </div>
                </div>
                <vue-p5
                  @setup="setup"
                  @draw="draw"
                  class="beer-canvas"
                />
                <transition-group name="flip-list" class="beers" tag="div" ref="card" v-if="beers.length">
                    <article @click="generateDesign(name, $event)" class="beer-card" v-for="({ name, tagline, target_fg, ph, abv, ibu, image_url, customColor }, index) of beers" :key="name" ref="card">
                        <div class="beer-name">{{ name }}</div>
                        <div class="beer-description">{{ tagline }}</div>
                        <ul class="beer-proportions">
                            <li>Sugar: {{ target_fg }}</li>
                            <li>Acidity: {{ ph }}</li>
                            <li>Alcohol: {{ abv }}%</li>
                            <li>Bitter: {{ ibu }} IBU</li>
                            <li><img class="beer-pic" width="70" :src="image_url" alt="" crossOrigin="anonymous"></li>
                        </ul>
                    </article>
                </transition-group>
            </section>
        </div>
    </div>
</template>

<script>
import VueP5 from 'vue-p5';
import Vue from 'vue';
import Sliders from './Sliders.vue';
import Dialog from './Dialog.vue';
import * as Vibrant from 'node-vibrant';

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
        sketchSavedCard: {},
        cardIndex: 0,
        width: 300,
        height: 300,
        beers: [],
        bitters: [],
        alert: false,
        activeBeer: null,
        mainColor: null,
        beerHover: null,
        beerSpecs: {
            alcohol: {
                name: 'alcohol',
                unit: 'abv',
                color: 'grey-1',
                textColor: 'grey-10',
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
                color: 'grey-1',
                textColor: 'grey-10',
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
                name: 'acidity',
                unit: 'ph',
                color: 'grey-1',
                textColor: 'grey-10',
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
                color: 'grey-1',
                textColor: 'grey-10',
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
        posy: 0,
        canvasBackground: '#faaaaa'
      };
  },
  created() {
      fetch('https://api.punkapi.com/v2/beers')
        .then(data => data.json())
        .then(res => {
            this.beers = res;
            this.hydrateBeers(); // Give color from pic to json
            this.activeBeer = this.beers[0];
        });
  },

  mounted() {
      window.addEventListener('resize', () => {
          this.result(this.sketchSaved);
      });
  },
    /*
  updated() {
      this.beers.map((beer: { ibu }) => {
          this.bitters.push(beer.ibu);
      });
  },
  */

    /*
  computed: {
    alcoholAmount() {
        return this.beerSpecs.alcohol.sliderValues.value;
    },
  },

  watch: {
    alcoholAmount(value) {
        this.$refs.canvas.$el.style.filter = `blur(${(value / 10) ** 2}px)`;
    },
  },
     */

  methods: {
      generateDesign(name) {
          this.activeBeer = this.beers.find(beer => beer.name.includes(name));
          this.canvasBackground = this.activeBeer.customColor;
          this.draw(this.sketchSavedCard);
      },

      hydrateBeers() {
          for (const beer of this.beers) {
              const v = new Vibrant(beer.image_url);
              v.getPalette().then(palette => {
                this.mainColor = palette.Vibrant.hsl;
                beer.customColor = this.mainColor;
              });
          }
      },

      setup(sketch) {
          this.sketchSavedCard = sketch;
          sketch.createCanvas(window.innerWidth, this.$refs.board.offsetHeight);
          sketch.rectMode(sketch.CENTER);
          sketch.noLoop();
      },

      draw(sketch) {
          if (this.activeBeer !== null) {
              sketch.background(sketch.color('#fcfcfc'));
              // sketch.stroke(_.canvasBackground);
              // sketch.strokeWeight(5);
              sketch.noStroke();
              sketch.colorMode(sketch.HSL, 1);
              const hue = this.canvasBackground[0];
              const saturation = this.canvasBackground[1];
              const light = this.canvasBackground[2];

              // const color = sketch.color(`hsl(${_.canvasBackground[0]}, ${_.canvasBackground[1]}, ${_.canvasBackground[2]}`);
              sketch.push()
              sketch.scale(this.convertRange(this.activeBeer.target_fg, 1000, 1030, .5, 6));
              for (let i = 0; i < window.innerWidth; i += 60) { // col
                  for (let j = 0; j < window.innerHeight ; j += 60) { // row
                      sketch.push();
                      sketch.translate(i + 10, j - 10);
                      sketch.rotate(sketch.PI / 4);
                      sketch.fill(sketch.random(1), saturation, light);
                      sketch.rect(
                        0,
                        0,
                        // j - 10 + (sketch.noise(j / 10, 0, sketch.frameCount * 0.002) * 2 - 1) * 30, // posy
                        50,
                        // 1080 - this.activeBeer.target_fg, // width
                        50, // height
                        sketch.abs(this.activeBeer.ph - 3) * 10, // radius
                      );
                      sketch.pop();
                  }
              }
              sketch.pop()
          }
      },
      convertRange(oldValue, oldMin, oldMax, newMin = 0, newMax = 100) {
          return ((oldValue - oldMin) / (oldMax - oldMin) ) * (newMax - newMin) + newMin;
      },
      result(sketchSaved) {
          sketchSaved.clear();
          sketchSaved.createCanvas(window.innerWidth, window.innerHeight / 2);
          sketchSaved.canvas.style.width = '100%';
          sketchSaved.redraw();
      },
      sortedBeers(value) {
          this.ingredientSelected = value.toLowerCase();
          const ingredient = this.ingredientSelected;
          const { unit } = this.beerSpecs[ingredient];
          this.beers.sort((a, b) => unit === 'ph' ? a[unit] - b[unit] : b[unit] - a[unit]);
      },
  },
  render(h) {
    return h(VueP5, {on: this});
  },
});
</script>

<style lang="scss" scoped>
    @import '~quasar-styl';
    @import '../styles/tools/mixins';
    @import '../styles/tools/variables';

    .board {
        position: relative;
        z-index: 0;
        padding: 10rem 10vw;
        background: $alabaster;
        color: $cod-gray;

        .beer-canvas {
            position: fixed;
            z-index: -1;
            top: 0;
            left: 0;
        }

        .introduction-title {
            font-family: $league;
            text-transform: uppercase;
            margin-bottom: 2rem;
        }

        .introduction-description {
            color: $silver-chalice;
            line-height: 1.6;
        }
    }

    .beers {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 5rem;
        justify-content: space-between;
        margin: 5rem 0;

        @include for-large-mobile-down {
            margin: 7rem 0;
        }
    }

    .beer-card {
        position: relative;
        box-shadow: 0 14px 28px rgba(200,200,200,0.25), 0 5px 5px rgba(200,200,200,0.22);
        border-radius: 5px;
        padding: 2em;
        line-height: 1.4;
        font-size: 17px;
        flex: 1 1 25%;
        overflow: hidden;
        background: $alabaster;

        .beer-name {
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
        }

        .beer-description {
            font-size: .6em;
            color: $silver-chalice;
        }
        .beer-proportions {
            margin-top: 1em;
            font-size: 1rem;
        }
    }

    .cursors {
        position: absolute;
        top: 1rem;
        right: 1rem;

        @include for-tablet-down {
            position: initial;
            margin: 10vw;
        }
    }

    .flip-list-move {
      transition: transform 1s;
    }
</style>
