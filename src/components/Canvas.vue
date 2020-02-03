<template>
    <div>
        <vue-p5
          @setup="setup"
          @draw="draw"
        />
        <div class="q-pa-md">
            <q-badge color="purple">
                Acidity:
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
              label
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
              label
              color="blue"
            />
        </div>

        <div class="q-pa-md">
            <q-badge color="red">
                Alcohol:
                <span v-if="quantities.alcohol <= 4">Low</span>
                <span v-else-if="quantities.alcohol > 4 && quantities.alcohol <= 8">Medium</span>
                <span v-else>High</span>
            </q-badge>

            <q-slider
              @input="result(sketchSaved)"
              v-model="quantities.alcohol"
              :min="0"
              :max="30"
              :step="1"
              snap
              label
              color="red"
            />
        </div>

        <div class="q-pa-md">
            <q-badge color="red">
                Sugar:
                <span v-if="quantities.sugar <= 4">Low</span>
                <span v-else-if="quantities.alcohol > 4 && quantities.alcohol <= 8">Medium</span>
                <span v-else>High</span>
            </q-badge>

            <q-slider
              @input="result(sketchSaved)"
              v-model="quantities.sugar"
              :min="0"
              :max="30"
              :step="1"
              snap
              label
              color="red"
            />
        </div>

        <q-dialog v-model="alert">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Alert</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    Here is the beer you need: <span class="beer-name">{{selectedBeer}}</span>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <div class="button" @click="findBeer">
            Gimme my beer
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
                        <li>Acidity: {{ beer.ph }}</li>
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
            bitter: 5,
            alcohol: 0,
            sugar: 0,
        },
        selectedBeer: '',
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
          sketch.createCanvas(window.innerWidth, window.innerHeight / 3);
          sketch.noStroke(); // No outline stroke
          //let randomHue = ;
          //console.log(randomHue)
          sketch.angleMode(sketch.DEGREES);
          sketch.noLoop();
          //sketch.angleMode(sketch.DEGREES);
      },
      draw(sketch: Options) {
          const color = sketch.color(`hsb(44, ${(this as any).quantities.bitter}%, 97%)`);
          sketch.fill(color);
          for (let i = 0; i < window.innerWidth; i += 100) { // col
              for (let j = 0; j < window.innerHeight / 3; j += 100) { // row
                  //sketch.push() // Save the following lines
                  //sketch.translate(i + 25, j + 25); // Change canvas origin
                  //sketch.rotate(sketch.PI/3.0) // rotate
                  sketch.rect(i, j, 50, 50, sketch.abs((this as any).quantities.acidity-3)*10);
                  //sketch.pop() // Remove ref
              }
          }
          // sketch.filter(sketch.BLUR, (this as any).quantities.alcohol);
      },
      result(sketchSaved: any) {
          sketchSaved.clear();
          sketchSaved.redraw();
      },
      findBeer() {
          let beer = (this as any).beers.filter(beer => beer.ph > (this as any).quantities.acidity - .5 && beer.ph < (this as any).quantities.acidity + .5);
          if(beer.length > 1) {
              beer = beer.filter(beer => beer.ibu > (this as any).quantities.bitter - 40 && beer.ibu < (this as any).quantities.bitter + 40);
          }
          console.log(beer);
          (this as any).selectedBeer = beer[0].name;
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

    .q-card {
        color: #171717;

        .beer-name {
            font-weight: bold;
        }
    }

    .q-pa-md {
        width: 50vw;
        margin: 0 auto;
    }

    .button {
        display: inline-block;
        border: 1px solid white;
        padding: 5px;
        cursor: pointer;
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
