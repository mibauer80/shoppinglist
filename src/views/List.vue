<template>
    <div>
        <v-tabs v-model="activeTab" centered center-active show-arrows="false" class="full-width">
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="p in posCatItems" :key="p.posId">
                {{ p.posName }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="p in posCatItems" :key="p.posId">

                <v-list v-for="(cat, i) in p.posCats" :key="i" flat dense>
                    <p class="h5 mt-4 mb-2">
                        {{cat.catTitle}}
                    </p>
                    <v-list-item-group color="primary" class="pl-0">
                        <v-list-item v-for="(item, i) in cat.catItems" :key="i">
                            <v-list-item-content class="cart-list-item justify-space-between py-0">
                                <v-list-item-title class="mb-0">{{item.product_name}}</v-list-item-title>
                                <v-btn x-small elevation="0" fab dark class="float-right mr-3"
                                    :color="item.deleteLoading === true ? 'white' : 'red'"
                                    :outlined="item.deleteLoading !== true" :disabled="item.deleteLoading === true"
                                    @click="deleteItem(item.item_id, 1)">
                                    <v-progress-circular v-if="item.deleteLoading === true" :size="20" color="grey"
                                        indeterminate></v-progress-circular>
                                    <v-icon v-if="item.deleteLoading !== true">mdi-delete
                                    </v-icon>
                                </v-btn>
                            </v-list-item-content>
                            <v-list-item-action class="my-2">
                                <v-btn x-small elevation="0" fab dark
                                    :color="item.cartLoading === true ? 'white' : item.cart_status === 1 ? 'green' : 'primary'"
                                    :outlined="item.cartLoading !== true && item.cart_status === 1"
                                    :disabled="item.cartLoading === true"
                                    @click="cartItem(item.item_id, 1, item.cart_status === 1 ? 0: 1)">

                                    <v-progress-circular v-if="item.cartLoading === true" :size="20" color="grey"
                                        indeterminate></v-progress-circular>

                                    <v-icon v-if="item.cart_status === 1 && item.cartLoading !== true">mdi-check-bold
                                    </v-icon>
                                    <v-icon v-if="item.cart_status !== 1 && item.cartLoading !== true">
                                        mdi-basket-outline
                                    </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>

            </v-tab-item>
        </v-tabs-items>

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
                    <v-btn v-if="typeof modal.options === 'undefined' || modal.options.length === 0" small
                        color="green white--text" @click="deleteModal()">
                        Abbrechen
                    </v-btn>
                    <v-btn v-for="(o, i) in modal.options" :key="i" color="green white--text" small
                        @click="call(o.action, o.payload)">
                        {{ o.text }}
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    // @ is an alias to /src
    export default {
        name: 'List',
        data: () => ({
            cat: undefined,
            show: false,
            modal: {
                status: false,
                type: undefined,
                content: [],
                options: [],
            },
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
                        var catItems = this.items.filter(i => (i.pos_id === p.id || (i.pos_id === 0 && p.id > 0)) && i.catId === c.id);
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
    
                return output.sort(function(a, b) { return a.posId - b.posId;});
            }
        },
        methods: {
            deleteItem(listItemId, listId) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
                this.items[ci].loading = true;
                this.$store.dispatch('deleteItem', {
                    'listItemId': listItemId,
                    'listId': listId
                }).then((response) => {
                    if (/^1\d\d$/.test(response.code)) {
                        console.log(JSON.stringify(response));
                        this.items[ci].loading = false;
                    } else {
                        this.pushModal('failure', {
                            ...response,
                            title: 'Fehler beim Speichern'
                        });
                    }
                })
            },
            cartItem(listItemId, listId, cartStatus) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
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
                        this.pushModal('failure', {
                            ...response,
                            title: 'Fehler beim Speichern'
                        });
                    }
                })
            },

        }
    }
</script>

<style>
    .v-list-item {
        padding: 0 16px 0 0 !important;
    }

    .v-list-item__title,
    .cart-list-item .v-btn {
        flex: 0 0 auto !important;
    }

    .v-list-item__title {
        font-size: 16px !important;
    }

    .v-slide-group__prev {
        display: none !important;
    }
    .v-list--dense .v-list-item {
min-height: 34px;
    }
</style>