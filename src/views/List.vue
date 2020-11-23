<template>
    <div>
        <v-tabs v-model="activeTab" centered center-active :show-arrows="false" class="full-width">
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="p in posCatItems" :key="p.posId">
                {{ p.posName }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab" continuous>
            <v-tab-item v-for="p in posCatItems" :key="p.posId" style="min-height: 500px">

                <v-alert v-if="p.posCats.length===0" text border="left" color="amber darken-3"
                    icon="mdi-checkbox-blank-off-outline" class="mt-7">
                    Keine Einträge
                </v-alert>
                <v-list v-else v-for="(cat, i) in p.posCats" :key="i" flat dense class="cart-list">
                    <p class="h5 mt-4 mb-2">
                        {{cat.catTitle}}
                    </p>
                    <v-list-item-group color="primary" class="pl-0">
                        <v-list-item v-for="(item, i) in cat.catItems" :key="i" :ripple="false">
                            <v-list-item-content class="justify-space-between py-0">
                                <v-list-item-title class="mb-0"><span
                                        class="cart-quantity">{{item.quantity}}x</span>
                                        {{item.product_name}}
                                </v-list-item-title>
                                <v-btn x-small elevation="0" fab dark class="float-right mr-3"
                                    :color="item.deleteLoading === true ? 'white' : 'red'"
                                    :outlined="item.deleteLoading !== true" :disabled="item.deleteLoading === true"
                                    >                            
                                    <v-icon>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </v-list-item-content>
                            <v-list-item-action class="my-2">
                                <v-btn x-small elevation="0" fab dark color="primary"
                                    >

                                    <v-icon v-if="item.cart_status !== 1 && item.cartLoading !== true">
                                        mdi-basket-outline
                                    </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>                

                <v-btn class="mt-6" color="primary"
                    absolute style="bottom:0">Warenkorb auschecken</v-btn>

            </v-tab-item>
        </v-tabs-items>

        <v-snackbar v-model="alert.status" timeout="5000" :centered="true" :absolute="true" color="success">
            <span v-for="c in alert.content" :key="c.index">
                {{ c }}
            </span>

            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="alert.status = false">
                    <v-icon>mdi-close-circle</v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <v-dialog :value="modal.status" persistent>
            <v-card class="custom-modal">
                <v-card-title>
                    {{ modal.title }}
                </v-card-title>
                <v-card-text>
                    <p v-for="(t, i) in modal.text" :key="i" v-html="t"></p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="typeof modal.options === 'undefined' || modal.options.length === 0" small
                        color="primary white--text" @click="deleteModal()">
                        Abbrechen
                    </v-btn>
                    <v-btn v-for="(o, i) in modal.options" :key="i" color="primary white--text" small
                        :loading="modalActionLoading && o.action !== 'deleteModal'"
                        @click="function_call(o.action, o.payload)">
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
    } from 'vuex';
    import mixins from '../../mixins/mixin.js';

    export default {
        name: 'List',
        mixins: [mixins],
        data: () => ({
            cat: undefined,
            show: false,
            modal: {
                status: false,
                type: undefined,
                content: [],
                options: [],
            },
            alert: {
                status: false,
                type: undefined,
                content: []
            },
            modalActionLoading: false,
        }),
        computed: {
            ...mapGetters(['items', 'pos', 'categories']),
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
                        var catItems = this.items.filter(i => (i.pos_id === p.id || (i.pos_id === 0 && p.id > 0)) &&
                            i.catId === c.id);
                        posCats.push({
                            'catId': c.id,
                            'catTitle': c.title,
                            'catItems': catItems,
                        });
                        posCats.sort(function (a, b) {
                            return a.catId - b.catId;
                        });

                    }
                    output.push({
                        'posId': p.id,
                        'posName': p.name,
                        'posCats': posCats.filter(i => i.catItems.length > 0)
                    });
                }
                return output.sort(function (a, b) {
                    return a.posId - b.posId;
                });
            },
            posCartCount: function() {
               var output = [];
                for (var pi in this.pos) {
                    var p = this.pos[pi];                     
                    var cc = this.items.filter(i => (i.pos_id === p.id || i.pos_id === 0)).length;
                    output[p.id] = cc;
                }
                console.table(output);
                return output;
                
            }
        },
        methods: {
            cartItem(listItemId, listId, cartStatus) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
                this.items[ci].cartLoading = true;
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
            deleteConfirm(listItemId) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
                this.items[ci].show = false;
                /*this.pushModal('failure', {
                    status: true,
                    title: 'Artikel löschen',
                    messages: ['Eintrag von deiner Einkaufsliste entfernen?'],
                    options: [{
                        text: 'Löschen',
                        action: 'deleteItem',
                        payload: [listItemId, listId]
                    }, {
                        text: 'Abbrechen',
                        action: 'deleteModal',
                        payload: []
                    }, ]
                });*/
            },
            deleteItem(listItemId, listId) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
                this.items[ci].deleteLoading = true;
                this.$store.dispatch('deleteItem', {
                    'listItemId': listItemId,
                    'listId': listId
                }).then((response) => {
                    if (/^1\d\d$/.test(response.code)) {
                        this.deleteModal();
                        this.pushAlert('success', response.messages);
                    } else {
                        this.pushModal('failure', {
                            ...response,
                            title: 'Fehler beim Speichern'
                        });
                    }
                })
            },
            checkoutConfirm(listId, posId) {
                this.pushModal('failure', {
                    status: true,
                    title: 'Warenkorb auschecken',
                    messages: ['Alle im Warenkorb dieses Marktes befindlichen Produkte endgültig entfernen?'],
                    options: [{
                        text: 'Abschließen',
                        action: 'checkoutItems',
                        payload: [listId, posId]
                    }, {
                        text: 'Abbrechen',
                        action: 'deleteModal',
                        payload: []
                    }, ]
                });
            },
            checkoutItems(listId, posId) {
                this.modalActionLoading = true;
                this.$store.dispatch('checkoutItems', {
                    'listId': listId,
                    'posId': posId,
                }).then((response) => {
                    if (/^1\d\d$/.test(response.code)) {
                        this.modalActionLoading = false;
                        this.deleteModal();
                        this.pushAlert('success', response.messages);
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
    .cart-list .v-list-item {
        padding: 0 16px 0 0 !important;
    }

    .cart-list .v-list-item__title,
    .cart-list .v-list-item__content .v-btn {
        flex: 0 0 auto !important;
    }

    .cart-list .v-list-item__title {
        font-size: 16px !important;
    }

    .cart-list .v-slide-group__prev {
        display: none !important;
    }

    .cart-list .v-list--dense .v-list-item {
        min-height: 34px;
    }

    .custom-modal .v-card__title {
        background-color: #D32F2F;
        color: white;
        margin-bottom: 16px;
        padding-top: 8px !important;
    }

    .cart-quantity {
        display: inline-block;
        min-width: 2rem;
    }

    .v-slide-group__prev--disabled {
        display: none !important;
    }
</style>