<template>
    <div>
        <vue-p5
          @setup="setup"
          @draw="draw"
        />
        <div class="cursors">
            <div class="q-pa-md">
                <q-badge color="purple">
                    pH:
                    <span v-if="quantities.acidity <= 4">Low</span>
                    <span v-else-if="quantities.acidity > 4 && quantities.acidity <= 5">Medium</span>
                    <span v-else>High</span>
                </q-badge>

                <q-slider
                  @input="result(sketchSaved)"
                  v-model="quantities.acidity"
                  :min="3"
                  :max="6"
                  :step=".5"
                  snap
                  color="purple"
                />
            </div>
            <div class="q-pa-md">
                <q-badge color="blue">
                    Bitter:
                    <span v-if="quantities.bitter <= 40">Low</span>
                    <span v-else-if="quantities.bitter > 40 && quantities.bitter <= 70">Medium</span>
                    <span v-else>High</span>
                </q-badge>

                <q-slider
                  @input="result(sketchSaved)"
                  v-model="quantities.bitter"
                  :min="0"
                  :max="100"
                  :step="10"
                  snap
                  color="blue"
                />
            </div>

            <div class="q-pa-md">
                <q-badge color="pink-4">
                    Alcohol:
                    <span v-if="quantities.alcohol <= 6">Low</span>
                    <span v-else-if="quantities.alcohol > 6 && quantities.alcohol <= 10">Medium</span>
                    <span v-else>High</span>
                </q-badge>

                <q-slider
                  @input="result(sketchSaved)"
                  v-model="quantities.alcohol"
                  :min="4"
                  :max="15"
                  :step="1"
                  snap
                  color="pink-4"
                />
            </div>

            <div class="q-pa-md">
                <q-badge color="red">
                    Sugar:
                    <span v-if="quantities.sugar <= 300">Low</span>
                    <span v-else-if="quantities.sugar > 300 && quantities.sugar <= 800">Medium</span>
                    <span v-else>High</span>
                </q-badge>

                <q-slider
                  @input="result(sketchSaved)"
                  v-model="quantities.sugar"
                  :min="1000"
                  :max="1060"
                  :step="1"
                  snap
                  color="red"
                />
            </div>
            <q-dialog v-model="alert">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">Your beer</div>
                    </q-card-section>
                    <q-card-section class="q-pt-none" v-if="typeof(selectedBeers) === 'object'">
                        <div v-for="selectedBeer of selectedBeers">
                            <div class="beer-name">{{selectedBeer.name}}</div>
                            <div>{{selectedBeer.description}}</div>
                        </div>
                    </q-card-section>
                    <q-card-section class="q-pt-none" v-if="typeof(selectedBeers) === 'string'">
                        <div class="beer-name">Oops!</div>
                        <div>{{selectedBeers}}</div>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="OK" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <div class="button" @click="findBeer">
                Gimme my beers
            </div>
        </div>



        <div class="board">
            <section class="introduction">
                <div class="introduction-text">
                    <h1 class="introduction-title">BrewDog generator</h1>
                    <p class="introduction-description">
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
            <section class="beers">
                <article v-for="beer of beers">
                    <div class="beer-name">{{ beer.name }}</div>
                    <div class="beer-description">{{ beer.tagline }}</div>
                    <ul>
                        <li>Color: {{ beer.ebc }}</li>
                        <li>Sugar: {{ beer.target_fg }}</li>
                        <li>pH: {{ beer.ph }}</li>
                        <li>Alcohol: {{ beer.abv }}</li>
                        <li>Bitter: {{ beer.ibu }}</li>
                    </ul>
                </article>
            </section>
        </div>
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
  },
  data() {
      return {
        sketchSaved: {},
        width: 300,
        height: 300,
        beers: [],
        bitters: [],
        alert: false,
        quantities: {
            acidity: 3,
            bitter: 0,
            alcohol: 4,
            sugar: 1000,
        },
        selectedBeers: '',
      };
  },
  mounted() {
      fetch('https://api.punkapi.com/v2/beers')
        .then((data) => data.json())
        .then((res) => {
            (this as any).beers = res;
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
          const color = sketch.color(`hsb(44, ${(this as any).quantities.bitter}%, 97%)`);
          sketch.fill(color);
          for (let i = 0; i < window.innerWidth; i += 100) { // col
              for (let j = 0; j < window.innerHeight / 2; j += 100) { // row
                  sketch.rotate(sketch.PI / 3.0);
                  sketch.rect(
                    i + 10, // posx
                    j - 10 * sketch.random((this as any).quantities.alcohol**2/4), // posy
                    1080 - (this as any).quantities.sugar, // width
                    50, // height
                    sketch.abs((this as any).quantities.acidity - 3) * 10 // radius
                  );
              }
          }
      },
      result(sketchSaved: any) {
          sketchSaved.clear();
          sketchSaved.redraw();
      },
      findBeer() {
          let beer = (this as any).beers.filter((beer: {abv: number; }) => (beer.abv > (this as any).quantities.alcohol - 2 && beer.abv < (this as any).quantities.alcohol + 2));
          if (beer.length > 1) {
              beer = beer.filter((beer: { target_fg: number; }) => beer.target_fg > (this as any).quantities.sugar  - 30 && beer.target_fg < (this as any).quantities.sugar + 30);
          }
          if (beer.length > 1) {
              beer = beer.filter((beer: { ph: number; }) => beer.ph > (this as any).quantities.acidity - 1 && beer.ph < (this as any).quantities.acidity + 2);
          }
          if (beer.length > 1) {
              beer = beer.filter((beer: { ibu: number; }) => beer.ibu > (this as any).quantities.bitter - 25 && beer.ibu < (this as any).quantities.bitter + 25);
          }
          beer.length === 0 ? (this as any).selectedBeers = 'This kinda beer would be messed up... Try something else!' : (this as any).selectedBeers = beer;
          (this as any).alert = true;
      },
  },
  render(h) {
    return h(VueP5, {on: this});
  },
});
</script>

<style lang="scss">

    .board {
        display: flex;
        flex-wrap: wrap;
        margin: 100px 10vw;
    }

    section {
        width: 40vw;
    }

    .introduction {
        min-width: 400px;

        .introduction-text {
            width: 70%;
        }
    }

    .introduction-title {
        font-size: 50px;
        font-family: League;
        text-transform: uppercase;
    }

    .introduction-description {
        font-size: 12px;
        color: #999;
        line-height: 1.6;
    }
    
    .beers {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    article {
        width: 25%;
        min-width: 200px;
        border-radius: 10px;
        padding-bottom: 8px;
        line-height: 1.4;

        .beer-name {
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
        }

        .beer-description {
            font-size: 10px;
            color: #666;
        }
    }

    .cursors {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .q-card {
        color: #171717;

        .beer-name {
            font-weight: bold;
        }
    }

    .q-pa-md {
        padding: 0 16px 0 0 !important;
        width: 25vw;
        margin: 0 auto;
    }

    .button {
        color: white;
        background: #f8b400;
        display: inline-block;
        border-radius: 3px;
        padding: 8px;
        cursor: pointer;
        transition: transform .2s;

        &:hover {
            transform: translateY(-2px);
        }
    }
</style>

<!--

Variables
acidité (pH faible si acide):   border-radius
amertume (IBU de 5 à 120):      saturation
degré (ABV):                    flou
Sucre (FG de 1000 à 1060):      tremblement/entropie
couleur (EBC === SRM*2):        couleur

- Comment rotate un élément ?
- Comment concaténer dans hsb
- Entropie avec valeur entre petit random ?

-->
