<template>
  <div>
    <h1>This is the home page</h1>
        <v-list-item v-for="item in items"
            :key="item.id">
      <v-list-item-content>
        <v-list-item-title>{{ item.product_name }} ({{ item.pos_name }}) {{ item.urgent }}</v-list-item-title>
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
computed: mapGetters(['items', 'item_names']),

}
</script>
