<template>
  <div>
    <v-container>
      <v-row>
        <v-col v-for="(ps, i) in posSorted" :key="i" cols="12">
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline pt-1 pb-1" v-text="ps.posName"></v-card-title>
                <v-card-text class="pb-0 pr-0">
                  <v-chip class="mr-2 my-2 pa-2" label color="primary" outlined>
                    <v-icon class="mr-2">
                      mdi-cart
                    </v-icon>
                    <span class="chip-text-responsive">Total:</span>{{ ps.itemCount }}
                  </v-chip>
                  <v-chip class="mr-2 my-2 pa-2" label :color="ps.urgentColor + ' white--text'" outlined>
                    <v-icon class="mr-2">
                      mdi-alarm-light-outline
                    </v-icon>
                    <span class="chip-text-responsive">Notstand:</span>{{ ps.urgentCount }}
                  </v-chip>
                  <v-chip v-if="ps.posId!=5 && ps.posId!=null" class="mr-2 my-2 pa-2" label :color="ps.saleColor"
                    outlined>
                    <v-icon class="mr-2">
                      mdi-sale
                    </v-icon>
                    <span class="chip-text-responsive">Angebote:</span>{{ ps.saleCount }}
                  </v-chip>
                </v-card-text>

                <v-card-actions class="ma-2">
                  <v-btn :disabled="ps.itemCount===0" color="primary">

                    Einkaufszettel
                    <v-icon right>
                      mdi-format-list-bulleted
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </div>

              <v-avatar v-if="ps.posId!=5 && ps.posId!=0" class="ma-3" tile width="70" height="70">
                <v-img :src="require('../assets/logo_pos_' + ps.posId + 'n.svg')">
                </v-img>
              </v-avatar>
            </div>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
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
      show: false
    }),
    computed: {
      ...mapGetters(['items', 'pos']),
      posCount: function () {
        var output = [];
        var specificPos = this.pos.filter(p => p.id != 6);
        console.table(specificPos);
        for (var i in specificPos) {
          var p = specificPos[i];
          var ic = this.items.filter(i => i.pos_id === p.id).length;
          var sc = this.items.filter(i => i.pos_id === p.id && i.sale_end != null).length;
          var scol = sc > 0 ? 'green accent-4' : 'grey';
          var uc = this.items.filter(i => i.pos_id === p.id && i.urgent === 2).length;
          var ucol = uc > 0 ? 'red' : 'grey';
          output.push({
            'posId': p.id,
            'posName': p.name,
            'itemCount': ic,
            'saleCount': sc,
            'saleColor': scol,
            'urgentCount': uc,
            'urgentColor': ucol
          });
        }
        console.table(output);
        return output;
      },
      posSorted: function () {
        var sortedPos = this.posCount.slice().sort((a, b) => {
          if (a.posId == 0) return -1;
          if (b.posId == 0) return 1;
          if (a.itemCount == b.itemCount) return 0;          
          if (a.itemCount < b.itemCount)
            return 1;
          if (a.itemCount > b.itemCount)
            return -1;
          return 0;
        });
        console.log('SORTEDPOS: ' + JSON.stringify(sortedPos));
        return sortedPos;
      }
    },
    methods: {

    }
  }
</script>