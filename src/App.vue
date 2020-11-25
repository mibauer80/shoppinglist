<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center mr-2">
        <v-img alt="Shopping List Logo" class="shrink mr-2" contain
          :src="require('@/assets/app-logo.png')" transition="scale-transition" width="40" />        
      </div>

      <v-btn text to="/" class="mx-2">Home</v-btn>
      <v-btn text to="/add" class="mx-2">Add</v-btn>
      <v-btn text to="/list" class="mx-2">List</v-btn>  

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
  import mixins from '../mixins/mixin';
  export default {
    name: 'App',
    mixins: [mixins],
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
  .custom-modal .v-card__title {       
        margin-bottom: 16px;
        padding-top: 8px !important;
    }
    .custom-card-title--error {
      color:#FFF;
      background-color: #FF5252
    }
     .custom-card-title--confirm {
      color:#FFF;
      background-color:#FFA000
    }
   .custom-card-title--default {
      color:#FFF;
      background-color:#0288D1
    }    
  .chip-text-responsive {
    margin-right: 8px
  }  
</style>