<template>
<div>
  <v-card
  v-for="(ps, i) in posSorted" :key="i"
  elevation="2"
>
<v-card-title>{{ps.posName}} </v-card-title>
<v-img 
                :src="require('../assets/logo_pos_' + ps.posId + '.svg')"
                
                max-width="70"
                >
                </v-img>
    <v-card-text> 
      <v-row>
        <v-col>
      
      </v-col>
      <v-col>
      <v-icon
      large
      color="green darken-2"
    >
      mdi-cart
    </v-icon>{{ps.itemCount}}
    </v-col>
    </v-row>
    </v-card-text>
     
</v-card>
</div>
</template>

<script>
 import {
    mapGetters
  } from 'vuex'
// @ is an alias to /src


export default {
  
  name: 'Home',
computed: { ...mapGetters(['items', 'pos']),
posCount: function() {
    var output = [];
    for (var i in this.pos) {
      var p = this.pos[i];      
      
      var ic = this.items.filter(i => i.pos_id === p.id).length;
      var sc = this.items.filter(i => i.pos_id === p.id && i.sale_end != null).length;
      var uc = this.items.filter(i => i.pos_id === p.id && i.urgent === 2).length;
      output.push({'posId': p.id, 'posName': p.name, 'itemCount': ic, 'saleCount': sc, 'urgentCount': uc})
    }
    return output;
  },
  posSorted: function() {
    return this.posCount.slice().sort((a,b) => {return b.itemCount - a.itemCount});
  }

}

}
</script>
