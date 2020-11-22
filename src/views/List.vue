<template>
    <div>
        <v-tabs v-model="activeTab" align-with-title>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab v-for="p in posCatItems" :key="p.posId">
                {{ p.posName }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="p in posCatItems" :key="p.posId">

                <v-list v-for="(cat, i) in p.posCats" :key="i" dense>
                    <p class="h6">
                        {{cat.catTitle}}
                    </p>
                    <v-list-item-group color="primary">
                        <v-list-item v-for="(item, i) in cat.catItems" :key="i" active-class="white deep-purple--text text--accent-4">

                            <v-list-item-content class="cart-list-item justify-space-between">

                                <v-list-item-title class="mb-0">{{item.product_name}}</v-list-item-title> 
                                <v-btn icon color="primary" @click="deleteItem" class="float-right mr-5">                    
                    L
                                      </v-btn>
                            </v-list-item-content>
                            <v-list-item-action>
                                
                                <v-checkbox :input-value="active" color="deep-purple accent-4"></v-checkbox>
                            </v-list-item-action>
                         
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-tab-item>
        </v-tabs-items>

    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    // @ is an alias to /src
    export default {
        name: 'Home',
        mounted: function () {
            console.table(this.posCatItems);
        },
        data: () => ({
            cat: undefined,
            show: false
        }),
        computed: {
            ...mapGetters(['items', 'pos', 'categories']),
            posWithNull: function () {
                var posNull = {
                    'id': 0,
                    'name': 'Allgemein',
                };
                return [posNull, ...this.pos]
            },
            activeTab: {
                set(val) {
                    let query = {
                        ...this.$route.query
                    };
                    query.posid = val;
                    this.$router.replace({
                        query: query
                    });
                },
                get() {
                    return Number(this.$route.query.posid);
                }
            },
            posCatItems: function () {
                var output = [];
                for (var pi in this.pos) {
                    var p = this.pos[pi];
                    var posCats = [];
                    for (var ci in this.categories) {
                        var c = this.categories[ci];
                        var catItems = this.items.filter(i => i.pos_id == p.id && i.catId === c.id);
                        posCats.push({
                            'catId': c.id,
                            'catTitle': c.title,
                            'catItems': catItems,
                        });

                    }
                    output.push({
                        'posId': p.id,
                        'posName': p.name,
                        'posCats': posCats.filter(i => i.catItems.length > 0)
                    });

                }
                console.log(output);
                return output;
            }
        },
        methods: {
        deleteItem: function() {
            alert('Click')
        }
        }
    }
</script>