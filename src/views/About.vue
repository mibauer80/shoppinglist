<template>
  <div>
   
    
    <v-combobox v-if="itemsCombo" :items="itemsCombo" v-model="productNameInput">

    </v-combobox>
 <h1>{{ productNameInput }} - {{ posSelect }} - {{ quantity }}</h1>

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
      <v-item v-slot="{ active, toggle }" :value="p.id">
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
<v-row align="center">
  <v-col>
          <v-btn
      class="mx-2"
      fab
      dark
      small
      color="primary"
      @click="adjustQuantity(-1)"
    >
      <v-icon dark>
        mdi-minus
      </v-icon>
    </v-btn>
    </v-col>
    <v-col>
         <v-chip
         
      class="ma-2"
      x-large    >
    {{ quantity }}
     </v-chip>
          </v-col>
            <v-col>
          <v-btn
      class="mx-2"
      fab
      dark
      small
      color="primary"
      @click="adjustQuantity(1)"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    </v-col>
</v-row>


    <v-btn 
    :disabled="typeof productNameInput === 'undefined' || productNameInput === 'Produkt eingeben'"
  elevation="2"
  x-large
  @click="addItem(productNameInput.text || productNameInput, 1, posSelect)"
>Eintragen</v-btn>

      <v-alert v-for="message in messages" :key="message.ts"
  :type="message.type"
  @click="deleteMessage(message.ts)">
  <span v-for="n in message.messages" :key="n.index">
    {{ n }}
  </span>  
  </v-alert>

<v-dialog
v-if="dialog"
      v-model="modal"
      persistent      
    >     
      <v-card>
        <v-card-title class="headline">
          {{ modal.title }}
        </v-card-title>
        <v-card-text>{{ modal.text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
                    <v-btn
          v-if="typeof modal.options === 'undefined' || modal.options.length === 0"
            color="green darken-1"
            
            @click="deleteModal()"
          >
            Abbrechen
          </v-btn>
          <v-btn
          v-for="(o, i) in modal.options"
            :key="i"
            color="green darken-1"
            
            @click="call(o.action, o.payload)"
          >
            {{ o.text }}
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>



  </div>
</template>
<style>
.faded {opacity:0.3}
.v-item-group .v-image__image {background-size:auto;}
</style>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default { 
        data: () => ({
      quantity: 1,      
      productNameInput: 'Produkt eingeben',
      posSelect: undefined,     
    }),      
    name: 'About',
    computed: {
      ...mapGetters(['items', 'itemsCombo', 'messages', 'pos', 'modal']),       
      dialog: function(state) {return state.modal.display === true}
    },
    methods: {
      call(method, args = []) {
this[method](...args);
      },
      adjustQuantity(amount) {
        this.quantity += Number(amount);
      },
      addItem(product, quantity, posId, urgent, saleStart, saleEnd, force) {        
        this.$store.dispatch('addItem', {
          'name': product,         
          'quantity': this.quantity,
          'posId': posId,
          'urgent:': urgent,
          'saleStart': saleStart,
          'saleEnd': saleEnd,
          'force': force
        });
      },
        deleteMessage(ts) {        
        this.$store.dispatch('deleteMessage', {
          'ts': ts
        });
      },
              deleteModal() {        
        this.$store.dispatch('deleteModal');
      }
    }
  }
</script>