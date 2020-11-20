<template>
  <div>


    <v-combobox v-if="productsCombo" :items="productsCombo" v-model="productNameInput" auto-select-first
      @change="selectCatByProd(productNameInput.value)"
      menu-prop="{ 'closeOnClick': true, 'closeOnContentClick': true, 'disableKeys': false, 'openOnClick': true, 'maxHeight': 304 }"
      @keyup.enter="comboEnter"     
      >
    </v-combobox>


<v-row no-gutters>
  <v-col style="min-height: 70px" align="center">
    <v-select mt-0 v-if="categories && typeof selectedCatName === 'undefined' && selectedCatName !== false"
      v-model="category" :items="categories" item-text="title" item-value="id" label="Kategorie"></v-select>    
    <v-chip 
    v-if="typeof selectedCatName !== 'undefined' && selectedCatName !== false"
    class="mr-2 my-2 pa-2" label style="width:100%; max-width:500px;" color="blue lighten-2 white--text">
                                            Kategorie: {{ selectedCatName }}
                    </v-chip>
</v-col>
</v-row>
    <v-item-group v-if="pos" v-model="posSelect" align="center" class="d-flex justify-space-between">       
          <v-item v-for="(p, i) in pos" :key="i" v-slot="{ active, toggle }" :value="p.id" class="flex-grow-0">
            <v-img :src="require('../assets/logo_pos_' + p.id + 'n.svg')" max-width="100" width="20%" aspect-ratio="1" :class="{ 'faded': !active }"
              @click="toggle">
            </v-img>
          </v-item>   
    </v-item-group>

<div class="text-subtitle-1 mt-4">
  Angebotszeitraum
  </div>
      <v-menu            
            v-model="dateMenu"
            :close-on-content-click="false"
           
            transition="scale-transition"
            offset-y 
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-row no-gutters> 
        <v-col class="mr-3">
              <v-text-field
              @click="preselectNextWeek"
              @click:clear="saleDateRange = []"
              clearable
                label="Start"
                prepend-inner-icon="mdi-calendar"
                readonly
                :value="germanDate(saleDateStart)"
                v-on="on"
              ></v-text-field>
              </v-col>
                <v-col class="ml-3">
               <v-text-field
               @click="preselectNextWeek"
               @click:clear="saleDateRange = []"
               clearable
                label="Letzter Tag"
                prepend-inner-icon="mdi-calendar"
                readonly
                :value="germanDate(saleDateEnd)"
                v-on="on"
              ></v-text-field>
               </v-col>
               </v-row>
            </template>
            <v-date-picker
              locale="de-de"
              :first-day-of-week="1"
              v-model="saleDateRange"
              no-title
              range
              @change="dateMenu = false"
              :min="minSaleDate"              
            >              
            </v-date-picker>
          </v-menu>

    <v-container align="center">
      <v-row justify="center" no-gutters>
        <v-col>
          <v-item-group v-if="urgents" v-model="urgentSelect" >
            <v-row  no-gutters>
              <v-col v-for="(u, i) in urgents" :key="i" align="center"  cols="6" sm="6">
                <v-item v-slot="{ active, toggle }" :value="u.id">
                  <v-chip label large :active-class="u.chipClass" :input-value="active" @click="toggle">
                    <v-icon x-large>mdi-{{ u.iconName }}</v-icon>
                  </v-chip>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>        
        </v-col>
      </v-row>
    </v-container>

    <v-row align="center" class="my-2">
      <v-col align="right">
        <v-btn class="mx-2" fab dark small color="primary" @click="adjustQuantity(-1)">
          <v-icon dark>
            mdi-minus
          </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="3" align="center">       
            <v-text-field         
            class="centered-input"   
            style="margin-bottom:-30px;"
            :value="quantity"
            label="Anzahl"  
            readonly          
            outlined
          ></v-text-field>
      </v-col>
      <v-col align="left">
        <v-btn class="mx-2" fab dark small color="primary" @click="adjustQuantity(1)">
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>


    <v-btn 
    color="primary"
    class="mt-4"
      :disabled="typeof productNameInput === 'undefined' || productNameInput === 'Produkt eingeben' || typeof category === 'undefined' || loading_itemSubmit === true"
      :loading="loading_itemSubmit" elevation="2" x-large
      @click="addItem(productNameInput.text || productNameInput, category, quantity, posSelect, urgentData, saleDateStart, saleDateEnd)">Eintragen
    </v-btn>

    <v-alert :value="alert.status" transition="scale-transition" :type="alert.type" @click="deleteAlert()">
      <span v-for="c in alert.content" :key="c.index">
        {{ c }}
      </span>
    </v-alert>

    <v-dialog :value="modal.status">
      <v-card>
        <v-card-title class="headline">
          {{ modal.title }}
        </v-card-title>
        <v-card-text>
          <p v-for="(t, i) in modal.text" :key="i" v-html="t"></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="typeof modal.options === 'undefined' || modal.options.length === 0" small color="green white--text"
            @click="deleteModal()">
            Abbrechen
          </v-btn>
          <v-btn v-for="(o, i) in modal.options" :key="i" color="green white--text" small @click="call(o.action, o.payload)">
            {{ o.text }}
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>



  </div>
</template>
<style>
  .faded {
    opacity: 0.35;
    filter: grayscale(100%);
  }

  
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
      urgentSelect: undefined,      
      category: undefined,
      selectedCatName: false,
      dateMenu: false,        
      saleDateRange: [],
      loading_itemSubmit: false,
      alert: {
        status: false,
        type: undefined,
        content: []
      },
      modal: {
        status: false,
        type: undefined,
        content: [],
        options: [],
      },
      urgents: [{
          id: 0,
          iconName: 'help-circle-outline',
          chipClass: 'teal lighten-3 white--text'
        },
        {
          id: 2,
          iconName: 'home-alert',
          chipClass: 'deep-orange darken-1 white--text'
        },
      ]
    }),
    name: 'About',

    computed: {
      ...mapGetters(['products', 'items', 'categories', 'productsCombo', 'pos']),
      urgentData() {
        return typeof this.urgentSelect === 'undefined' ? 1 : this.urgentSelect
      },
      saleDateStart() {
        return this.saleDateRange[0];
      },
      saleDateStartDisplay() {
        return this.saleDateRange[0].split('-');
      },
      saleDateEnd() {
        return this.saleDateRange[1];
      },
      minSaleDate() {
        return new Date().toISOString().slice(0, 10);
      }
    },
    methods: {
      call(method, args = []) {
        this[method](...args);
      },
      adjustQuantity(amount) {
        var r = this.quantity + Number(amount);
        if (r > 0  && r <= 20) {
      this.quantity = r;
        }
    },      
      addItem(product, catId, quantity, posId, urgent, saleStart, saleEnd, force) {
        this.loading_itemSubmit = true;
        this.$store.dispatch('addItem', {
          'name': product,
          'quantity': quantity,
          'catId': catId,
          'posId': posId,
          'urgent': urgent,
          'saleStart': saleStart,
          'saleEnd': saleEnd,
          'force': force
        }).then((response) => {
          console.log(JSON.stringify(response));
          if (response.resetForm === true) {
            this.loading_itemSubmit = false;
            this.deleteModal();
            this.pushAlert('success', response.messages);
            this.productNameInput = 'Produkt eingeben';
            this.quantity = 1;
            this.category = undefined;
            this.posSelect = undefined;
          } else {
            this.pushModal('failure', response);
          }
        })
      },
      selectCatByProd(pid) {
        this.category = undefined;
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
          'urgent': urgent,
          'saleStart': saleStart,
          'saleEnd': saleEnd
        }).then((response) => {
          console.log(JSON.stringify(response));
          if (response.resetForm === true) {
            this.loading_itemSubmit = false;
            this.deleteModal();
            this.pushAlert('success', response.messages);
            this.productNameInput = 'Produkt eingeben';
            this.quantity = 1;
            this.category = undefined;
            this.posSelect = undefined;
            this.urgentSelect = undefined;
          } else {
            this.pushModal('failure', response);
          }
        })
      },
      preselectNextWeek() {
        if (this.saleDateRange.length === 0) {
              var d = new Date();
              var s = new Date();
              d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);    
    s.setDate(d.getDate()+5);    
        this.saleDateRange=[d.toISOString().slice(0, 10), s.toISOString().slice(0, 10)];
        }
      },
      comboEnter() {        
        document.querySelector('.v-btn').focus();
      }
    }
  }
</script>

