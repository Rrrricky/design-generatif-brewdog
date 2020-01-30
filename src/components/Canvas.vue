<template>
    <div>
        <vue-p5 @setup="setup"/>
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
        bitters: [],
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
          sketch.createCanvas(window.innerWidth, window.innerHeight / 3);
          sketch.noStroke(); // No outline stroke
          //let randomHue = ;
          //console.log(randomHue)
          const test = sketch.color(`hsb(20, 100%, 50%)`);
          sketch.fill(test);
          sketch.angleMode(sketch.DEGREES);
          (this as any).drawGrid(sketch);
          // sketch.filter(sketch.BLUR, 3)
          //sketch.angleMode(sketch.DEGREES);
      },
      drawGrid(sketch: Options) {
          for (let i = 0; i < window.innerWidth; i += 100) { // col
              for (let j = 0; j < window.innerHeight; j += 100) { // row
                  //sketch.push() // Save the following lines
                  //sketch.translate(i + 25, j + 25); // Change canvas origin
                  //sketch.rotate(sketch.PI/3.0) // rotate
                  sketch.rect(i, j, 50, 50, 50);
                  //sketch.pop() // Remove ref
              }
          }
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
