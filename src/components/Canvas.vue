<template>
    <div>
        <div id="page">
            <section class="introduction-wrapper" ref="introductionWrapper">
                <div class="introduction-text">
                    <h1 class="text-h1 introduction-title">BrewDog generator</h1>
                    <p class="introduction-description text-weight-light">
                        Il y a dix ans, il y a eu une révolution. Une révolution de la bière.
                        La Punk IPA est la bière qui a donné le coup d'envoi de cette révolution.
                    </p>
                    <h2 class="text-h2 introduction-subtitle">Instructions</h2>
                    <p class="introduction-description text-weight-light">
                        Par un simple clic sur vos bières préférées, découvrez les packaging expérimentaux générés par 3 étudiants.
                        Ces packaging sont automatiquement créés selon les particularités de chaque bière : la quantité d'alcool, la
                        quantité de sucre, l'amertume, et l'acidité.
                    </p>
                </div>
            </section>
            <div class="board" ref="board">
                <section class="listBeers">
                    <vue-p5
                      @setup="setup"
                      @draw="draw"
                      class="beer-canvas"
                      ref="beerCanvas"
                    />
                    <div class="q-pa-md dropdown-sort" style="max-width: 300px">
                        <div class="q-gutter-md">
                            <q-select v-model="model" :options="options" label="Sort by:" @input="sortedBeers(model)" />
                        </div>
                    </div>
                    <transition-group name="flip-list" class="beers" tag="div" ref="cards" v-if="beers.length">
                        <article @click="generateDesign(name, $event)" class="beer-card" v-for="({ name, tagline, target_fg, ph, abv, ibu, image_url, customColor }, index) of beers" :key="name" ref="card">
                            <div class="beer-name">{{ name }}</div>
                            <div class="beer-description">{{ tagline }}</div>
                            <ul class="beer-proportions">
                                <li>Sugar: {{ target_fg }}</li>
                                <li>Acidity: {{ ph }}</li>
                                <li>Alcohol: {{ abv }}%</li>
                                <li>Bitter: {{ ibu }} IBU</li>
                            </ul>
                        </article>
                    </transition-group>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import VueP5 from 'vue-p5';
import Vue from 'vue';
import * as Vibrant from 'node-vibrant';

export default Vue.extend({
  name: 'Canvas',
  components: {
    'vue-p5': VueP5,
  },
  data() {
      return {
        ingredientSelected: '',
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
          this.result(this.sketchSavedCard);
      });
  },

  methods: {
      generateDesign(name) {
          this.activeBeer = this.beers.find(beer => beer.name.includes(name));
          this.canvasBackground = this.activeBeer.customColor;
          this.draw(this.sketchSavedCard);
          this.$refs.beerCanvas.$el.style.filter = `blur(${(this.activeBeer.abv / 10) ** 2}px)`;
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
              sketch.background(sketch.color('#010101'));
              sketch.noStroke();
              sketch.colorMode(sketch.HSL, 1);
              const hue = this.canvasBackground[0];
              const saturation = this.canvasBackground[1];
              const light = this.canvasBackground[2];

              sketch.push()
              const intervalSaturation = this.convertRange(this.activeBeer.ibu, 8, 150, 0, saturation);
              const intervalLight = this.convertRange(this.activeBeer.ibu, 8, 150, 0, light);
              const arrSat = [];
              const arrLight = [];

              for(let i = 0; i < 5; i++) {
                  const randomSaturation = sketch.random(saturation - intervalSaturation, 1);
                  arrSat.push(randomSaturation);
                  const randomLight = sketch.random(light - intervalLight, 1);
                  arrLight.push(randomLight);
              }
              sketch.scale(this.convertRange(this.activeBeer.target_fg, 1000, 1030, 1, 3));
              for (let i = 0; i < window.innerWidth; i += 60) { // col
                  for (let j = 0; j < window.innerHeight ; j += 60) { // row
                      sketch.push();
                      sketch.translate(i + 10, j - 10);
                      sketch.rotate(sketch.PI / 4);
                      sketch.fill(hue, arrSat[sketch.int(sketch.random(5))], arrLight[sketch.int(sketch.random(5))], .5);
                      sketch.rect(
                        0,
                        0,
                        50,
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
      result(sketchSavedCard) {
          if (this.activeBeer !== null) {
              sketchSavedCard.clear();
              sketchSavedCard.createCanvas(window.innerWidth, this.$refs.board.offsetHeight);
              sketchSavedCard.canvas.style.width = '100%';
              sketchSavedCard.redraw();
          }
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

    section.introduction-wrapper {
        position: fixed;
        z-index: 1;
        background: $alabaster;
        width: 25vw;
        min-width: min-content;
        height: 100vh;
        padding: 2em;
        @include for-desktop-down {
            width: 100vw;
            position: relative;
            height: unset;
        }

        .introduction-title, .introduction-subtitle {
            font-family: $league;
            text-transform: uppercase;
            margin-bottom: 2rem;
        }

        .introduction-subtitle {
            margin-top: 1em;
        }

        .introduction-description {
            color: $silver-chalice;
            line-height: 1.6;
        }
    }

    .board {
        position: absolute;
        right: 0;
        top: 0;
        width: 75vw;
        z-index: 0;
        padding: 0 7vw;
        background: $alabaster;
        color: $cod-gray;

        @include for-desktop-down {
            width: 100vw;
        }

        .beer-canvas {
            position: fixed;
            z-index: -1;
            top: 0;
            left: 0;
        }
    }

    .beers {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 5rem;
        justify-content: space-between;
        margin: 5rem 0;

        @include for-desktop-down {
            margin-top: 40rem;
        }

        @include for-large-mobile-down {
            margin-top: 50rem;
        }

        @include for-medium-mobile-down {
            margin-top: 60rem;
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
        cursor: pointer;

        .beer-name {
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

    .flip-list-move {
      transition: transform 1s;
    }

    .dropdown-sort {
        background: $alabaster;

        @include for-desktop-down {
            display: none;
        }
    }

</style>
