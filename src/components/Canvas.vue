<template>
    <div>
        <vue-p5 @setup="setup"></vue-p5>
        <div class="board">
            <section class="introduction">
                <div class="introduction-text">
                    <h1 class="introduction-title">BrewDog generator</h1>
                    <p class="introduction-description">A decade ago there was a revolution. A beer revolution.
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
            console.log(this.beers)
        });
  },
  methods: {
    setup(sketch: Options) {
      sketch.createCanvas(window.innerWidth, window.innerHeight/3);
      sketch.noStroke(); // No outline stroke
      sketch.fill(237, 0, 62); // Fill color
      sketch.circle(200, 30, this.width);
    },
  },
  render(h) {
    return h(VueP5, {on: this});
  },
});
</script>

<style lang="scss">

    .board {
        width: 100vw;
        display: flex;
        flex-wrap: wrap;
        margin: 100px 10vw 0 10vw;
    }

    section {
        width: 40vw;
    }

    .introduction {

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
Date 1e brassage (1st brewed)
pH (faible si acide)
Grammes de houblon (hops)
Grammes de levure (yeast)
Grammes de mat (malt)
Amereté (IBU de 5 à 120)
Degré (ABV)
Couleur (EBC === SRM*2)
Dose finale de sucre (FG de 1000 à 1060 )
-->
