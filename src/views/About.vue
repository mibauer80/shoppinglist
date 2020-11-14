<template>
  <div>
    <h1>This is an about page</h1>
    
    <v-combobox v-if="item_names" :items="item_names" :search-input.sync="searchInput" v-model="productNameInput"></v-combobox>
    <v-btn
  elevation="2"
  x-large
  @click="addItem(productNameInput, 1, 1)"
>Eintragen</v-btn>
      <v-alert v-for="message in messages" :key="message.ts" v-id="message.ts"
  dismissible
  @click="deleteMessage(message.ts)"
  type="warning">
  <span v-for="n in message.messages" :key="n.index">
    {{ n }}
  </span>
  
  </v-alert>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {       
    name: 'About',
    computed: mapGetters(['items', 'item_names', 'messages']),
    methods: {
      addItem(productName, quantity, posId) {        
        this.$store.dispatch('addItem', {
          'name': productName,
          'posId': posId,
          'quantity': quantity
        });
      },
        deleteMessage(ts) {        
        this.$store.dispatch('deleteMessage', {
          'ts': ts
        });
      }
    }
  }
</script>