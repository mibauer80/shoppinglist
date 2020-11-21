<template>
  <div>
    <h1>This is the home page</h1>
        <v-list-item v-for="item in items"
            :key="item.item_id">
      <v-list-item-content>
        <v-list-item-title>{{ item.item_id }} - {{ item.product_name }} ({{ item.pos_name }}) {{ item.urgent }} {{ item.cart_status }}</v-list-item-title>
        <v-btn @click="cartItem(item.item_id, 1, item.cart_status === 1 ? 0: 1)" :color="item.cart_status===1 ? 'green' : 'grey'">
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
         
        loadingCartToggle: {'ct1': true, 'ct6': true},
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
             
      this.$store.dispatch('cartItem', {
        'listItemId': listItemId,
        'listId': listId,
        'cartStatus': cartStatus
      }).then((response) => {
        if (/^1\d\d$/.test(response.code)) {
          console.log(JSON.stringify(response));         
          
          
        } else {
          /*this.pushModal('failure', response);*/
        }
      })
    },
}
}
</script>
