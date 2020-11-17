<template>
  <div>
   
    
    <v-combobox v-if="productsCombo" :items="productsCombo" v-model="productNameInput" auto-select-first @change="selectCatByProd(productNameInput.value)">

    </v-combobox>
 <h1>{{ productNameInput.value }} ({{ category }}) - {{ posSelect }} - {{ quantity }}</h1>
<p>{{ category }}</p>
 <v-select
v-if="categories && typeof selectedCatName === 'undefined' && selectedCatName !== false"
v-model="category"
          :items="categories"
          item-text="title"
          item-value="id"
          label="Kategorie"
        ></v-select>
        <p v-if="typeof selectedCatName !== 'undefined' && selectedCatName !== false">{{ selectedCatName }}</p>

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
  @click="addItem(productNameInput.text || productNameInput, category, quantity, posSelect)"
>Eintragen</v-btn>

      <v-alert v-for="message in messages" :key="message.ts" :value="alert"
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
        <v-card-text><p v-for="(t, i) in modal.text" :key="i"> {{ t }} </p></v-card-text>
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
      category: undefined,   
      selectedCatName: false,   
    }),      
    name: 'About',

    computed: {
      ...mapGetters(['products', 'items', 'categories', 'productsCombo', 'messages', 'pos', 'modal']),       
      dialog: function(state) {return state.modal.display === true},      
    },
    methods: {
      call(method, args = []) {
this[method](...args);
      },
      adjustQuantity(amount) {
        this.quantity += Number(amount);
      },
      addItem(product, catId, quantity, posId, urgent, saleStart, saleEnd, force) {        
        this.$store.dispatch('addItem', {
          'name': product,         
          'quantity': quantity,
          'catId': catId,
          'posId': posId,
          'urgent:': urgent,
          'saleStart': saleStart,
          'saleEnd': saleEnd,
          'force': force
        }).then((response) => {          
          if (response.resetForm === true) {
             this.productNameInput = 'Produkt eingeben';
            this.quantity = 1;
            this.category = undefined;
            this.posSelect = undefined;
          }
      })
      },      
      selectCatByProd(pid) {
        this.category = undefined;
        console.log('selectCatByProd(' + pid + ')');
       var pObject = this.products.find(p => p.id === pid);           
        if (typeof pObject !== 'undefined') {
          var cObject = this.categories.find(c => c.id === pObject.cat_id);
          if (typeof cObject !== 'undefined') {
          this.selectedCatName = this.categories.find(c => c.id === pObject.cat_id).title;
          this.category = pObject.cat_id;
          } else {
            this.selectedCatName = undefined;
          }
      } else {
        this.selectedCatName = undefined;
      }
      console.log('category: ' + this.category);
      console.log('selectedCatName: ' + this.selectedCatName);
      },
            updateItem(listItemId, listId, quantity, posId, urgent, saleStart, saleEnd) {        
        this.$store.dispatch('updateItem', {
          'listItemId': listItemId,    
          'listId': listId,  
          'quantity': quantity,
          'posId': posId,
          'urgent:': urgent,
          'saleStart': saleStart,
          'saleEnd': saleEnd          
        }).then((response) => {          
          if (response.resetForm === true) {
             this.productNameInput = 'Produkt eingeben';
            this.quantity = 1;
            this.category = undefined;
            this.posSelect = undefined;
          }
      })
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