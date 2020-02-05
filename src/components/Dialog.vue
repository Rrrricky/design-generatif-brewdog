<template>
  <div>
    <q-dialog v-model="myAlert">
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
    <q-btn label="Gimme my beer" color="primary" @click="findBeer" />
    <q-dialog v-model="icon">
      <q-card v-if="typeof(selectedBeers) === 'object'">
        <q-btn icon="close" flat round dense v-close-popup class="float-right q-pa-sm"/>
        <div v-for="selectedBeer of selectedBeers">
          <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">{{selectedBeer.name}}</div>
          </q-card-section>
          <q-card-section class="beer-description">
            {{selectedBeer.description}}
          </q-card-section>
        </div>
      </q-card>
      <q-card v-if="typeof(selectedBeers) === 'string'">
        <q-btn icon="close" flat round dense v-close-popup class="float-right q-pa-sm"/>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Oops</div>
        </q-card-section>
        <q-card-section>
          {{selectedBeers}}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Dialog',
    props: {
      selectedBeers: {
        required: true,
      },
    },
    data() {
      return {
        myAlert: this.alert,
        icon: false,
      };
    },
    methods: {
      findBeer() {
        this.$emit('find-beer');
        this.icon = true;
      },
    },
  };
</script>

<style lang="scss" scoped>

  .q-card {
    color: #171717;

    .q-btn {
      color: #aaa;
    }

    .beer-description {
      color: #555;
    }
  }

  .button {
    color: white;
    background: #f8b400;
    display: inline-block;
    border-radius: 3px;
    padding: 8px;
    cursor: pointer;
    transition: transform .2s;
    box-shadow: 1px 1px 20px #dedede;

    &:hover {
      transform: translateY(-2px);
    }
  }

</style>
