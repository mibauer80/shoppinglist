<template>
  <div>

    <v-container>
      <v-row dense>


        <v-col v-for="(ps, i) in posSorted" :key="i" cols="12">
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline" v-text="ps.posName"></v-card-title>
                <v-card-text>


                  <div class="text-center">
                    <v-chip class="mr-2 my-2 pa-2" label color="light-blue" outlined>

                      <v-icon class="mr-4">
                        mdi-cart
                      </v-icon>
                      Total {{ ps.itemCount }}
                    </v-chip>
                    <v-chip class="mr-2 my-2 pa-2" label color="red darken-4" outlined>

                      <v-icon class="mr-4">
                        mdi-alarm-light-outline
                      </v-icon>
                      Notstand {{ ps.urgentCount }}
                    </v-chip>
                    <v-chip class="mr-2 my-2 pa-2" label color="lime" outlined>

                      <v-icon class="mr-4">
                        mdi-alarm-light-outline
                      </v-icon>
                      Angebote {{ ps.saleCount }}
                    </v-chip>

                  </div>
                </v-card-text>

                <v-card-actions>

                  <v-btn :disabled="ps.itemCount===0" color="success">
                    <v-icon left>
                      mdi-eye
                    </v-icon>
                    Einkaufszettel
                  </v-btn>
                </v-card-actions>
              </div>

              <v-avatar class="ma-3" size="100" tile>
                <v-img :src="require('../assets/logo_pos_' + ps.posId + '.svg')"></v-img>
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
    computed: {
      ...mapGetters(['items', 'pos']),
      posCount: function () {
        var output = [];
        for (var i in this.pos) {
          var p = this.pos[i];

          var ic = this.items.filter(i => i.pos_id === p.id).length;
          var sc = this.items.filter(i => i.pos_id === p.id && i.sale_end != null).length;
          var uc = this.items.filter(i => i.pos_id === p.id && i.urgent === 2).length;
          output.push({
            'posId': p.id,
            'posName': p.name,
            'itemCount': ic,
            'saleCount': sc,
            'urgentCount': uc
          })
        }
        return output;
      },
      posSorted: function () {
        return this.posCount.slice().sort((a, b) => {
          return b.itemCount - a.itemCount
        });
      }

    }

  }
</script>