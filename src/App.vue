<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />

        <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
      </div>

      <v-btn to="/">Home</v-btn>
      <!--<v-btn to="/about">About</v-btn>-->

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">{{ this.$route.query.posId}}</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <v-container>

        <router-view></router-view>

      </v-container>
    </v-main>

  </v-app>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  export default {
    name: 'App',
    created() {
      this.$store.dispatch('getProducts');
      this.$store.dispatch('getItems');
      this.$store.dispatch('getCategories');
      this.$store.dispatch('getPos');
    },
    data() {
      return {
        alert: false,
      }
    },
    computed: {
      ...mapGetters(['items', 'pos']),

    },
    methods: {}
  }
</script>

<style>
  .centered-input input {
    text-align: center
  }

  @media (max-width: 600px){
    .chip-text-responsive {
      display: none;
    }
  }

  .chip-text-responsive {
    margin-right: 8px
  }  
</style>