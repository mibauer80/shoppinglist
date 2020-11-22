<template>
  <div>
    <h1>This is the home page</h1>
        <v-list-item v-for="item in items"
            :key="item.item_id">
      <v-list-item-content>
        <v-list-item-title>{{ item.item_id }} - {{ item.product_name }} ({{ item.pos_name }}) {{ item.urgent }} {{ item.cart_status }}</v-list-item-title>
        
          <v-checkbox              
              :label="item.product_name"
              :color="item.cart_status===1 ? 'green' : 'grey'"
              :value="item.cart_status===1"              
               @click="cartItem(item.item_id, 1, item.cart_status === 1 ? 0: 1)"
            ></v-checkbox>
             <v-btn
      class="mx-2"
      elevation="0"
      fab
      dark      
      :color="item.loading === true ? 'white' : item.cart_status === 1 ? 'green' : 'primary'"
      :outlined="item.loading !== true && item.cart_status === 1"
      :disabled="item.loading === true"
      @click="cartItem(item.item_id, 1, item.cart_status === 1 ? 0: 1)"
    >
              
                  <v-progress-circular
                  v-if="item.loading === true"
      :size="20"
      color="grey"
      indeterminate
    ></v-progress-circular>
                    
                    <v-icon v-if="item.cart_status === 1 && item.loading !== true" large>mdi-checkbox-marked</v-icon>
                    <v-icon v-if="item.cart_status !== 1 && item.loading !== true" large>mdi-cart</v-icon>
                  </v-btn>       
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
 import {
    mapGetters
  } from 'vuex'
// @ is an alias to /src


export default {
  
name: 'Home',
data: () => ({
      quantity: 1,   
            modal: {
        status: false,
        type: undefined,
        content: [],
        options: [],
      },
}),
computed: {
  ...mapGetters(['items', 'pos']),
 
},
methods: {  
      cartItem(listItemId, listId, cartStatus) {          
      var ci = this.items.findIndex((i) => { return i.item_id === listItemId;});       
      this.items[ci].loading = true;
      this.$store.dispatch('cartItem', {
        'listItemId': listItemId,
        'listId': listId,
        'cartStatus': cartStatus
      }).then((response) => {
        if (/^1\d\d$/.test(response.code)) {
          console.log(JSON.stringify(response));   
           this.items[ci].loading = false;         
        } else {
          /*this.pushModal('failure', response);*/
        }
      })
    },
}
}
</script>
