<template>
  <div>
    <h1>This is an about page</h1>
    
    <v-combobox v-if="item_names" :items="item_names" v-model="productNameInput"></v-combobox>


      <v-item-group
      v-if="pos"
        v-model="posSelect"
      >
              <v-row>
          <v-col
            v-for="(p, i) in pos"
            :key="i"
            cols="6"
            sm="3"
            
          >
      <v-item v-slot="{ active, toggle }" >
              <v-img 
                :src="require('../assets/logo_pos_' + p.id + '.svg')"
                max-height="100"               


                
                :class="{ 'faded': !active }"              
                @click="toggle"
              >
              </v-img>
    </v-item>
          </v-col>
          </v-row>
      </v-item-group>



    <v-btn v-if="item_names"
  elevation="2"
  x-large
  @click="addItem(productNameInput, 1, 1)"
>Eintragen</v-btn>
      <v-alert v-for="message in messages" :key="message.ts" v-id="message.ts"
  :type="message.type"
  @click="deleteMessage(message.ts)">
  <span v-for="n in message.messages" :key="n.index">
    {{ n }}
  </span>
  
  </v-alert>
  </div>
</template>
<style>
.faded {opacity:0.35}
.v-item-group .v-image__image {background-size:auto;}
</style>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {       
    name: 'About',
    computed: mapGetters(['items', 'item_names', 'messages', 'pos']),
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