<template>
    <div>
        <v-tabs v-model="activeTab" centered center-active :show-arrows="false" class="pos-tabs">
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="p in posCatItems" :key="p.posId">
                {{ p.posName }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab" continuous hide-slider>
            <v-tab-item v-for="p in posCatItems" :key="p.posId" style="min-height: 500px">

                <v-alert v-if="p.posCats.length===0" text border="left" color="amber darken-3"
                    icon="mdi-checkbox-blank-off-outline" class="mt-7">
                    Keine Einträge
                </v-alert>
                <v-list v-else v-for="(cat, i) in p.posCats" :key="i" flat dense class="cart-list">
                    <p class="h5 mt-2 mb-1 ml-10" style="font-weight:500;">
                        {{cat.catTitle}}
                    </p>
                    <v-list-item-group color="primary" class="pl-0">
                        <v-list-item v-for="(item, i) in cat.catItems" :key="i" :ripple="false" v-show="item.show">
                            <v-list-item-content class="justify-flex-start py-0">
                                <v-list-item-title class="mb-0 ml-2 mr-1">
                                    <div class="cart-quantity">{{item.quantity}}x
                                    </div>
                                    <div>{{item.product_name}}</div>
                                </v-list-item-title>
                                <div class="cart-item-icons">

                                    <v-tooltip bottom v-if="onSale(item.sale_start, item.sale_end)" open-on-click
                                        close-delay="3000">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="green accent-4" dark v-bind="attrs" v-on="on">
                                                mdi-sale
                                            </v-icon>
                                        </template>
                                        <span>Im Angebot vom<br>{{ germanDate(item.sale_start.slice(0, 10), 'short') }}
                                            bis {{ germanDate(item.sale_end.slice(0, 10), 'short') }}</span>
                                    </v-tooltip>
                                    <span v-else></span>

                                    <v-icon v-if="item.urgent === 2 || item.urgent === 0"
                                        :color="urgentColor(item.urgent)">
                                        {{ urgentIcon(item.urgent) }}
                                    </v-icon>
                                    <span v-else></span>

                                </div>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn x-small elevation="0" fab dark
                                    v-if="item.cart_status === 0 && item.cartLoading !== true"
                                    :color="item.deleteLoading === true ? 'white' : 'red'"
                                    :outlined="item.deleteLoading !== true" :disabled="item.deleteLoading === true"
                                    @click="deleteConfirm(item.item_id, 1)">
                                    <v-progress-circular v-if="item.deleteLoading === true" :size="20" color="grey"
                                        indeterminate></v-progress-circular>
                                    <v-icon v-if="item.deleteLoading !== true">mdi-delete
                                    </v-icon>
                                </v-btn>



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
        <v-fab-transition>
            <v-btn v-show="posCartCount[activeTab]>0" @click="checkoutConfirm(1, activeTab)" color="success" fab small
                class="checkoutListButton">
                <v-icon>mdi-cash-register</v-icon>
            </v-btn>
        </v-fab-transition>

        <v-snackbar v-model="alert.status" timeout="5000" color="success">
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
                <v-card-title :class="'custom-card-title--' + modal.type">
                    {{ modal.title }}
                </v-card-title>
                <v-card-text>
                    <p v-for="(t, i) in modal.text" :key="i" v-html="t"></p>
                </v-card-text>
                <v-card-actions class="px-6 pb-4">
                    <v-spacer></v-spacer>
                    <v-btn small color="deep-orange darken-1 white--text" @click="deleteModal()">
                        Abbrechen
                    </v-btn>
                    <v-btn v-for="(o, i) in modal.options" :key="i" color="success white--text" small
                        :loading="modal.modalActionLoading && o.action !== 'deleteModal'"
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
            created() {
      this.$store.dispatch('getItems');
    },
        data: () => ({
            cat: undefined,
            show: false,
            modal: {
                status: false,
                type: 'default',
                content: [],
                options: [],
                modalActionLoading: false,
            },
            alert: {
                status: false,
                type: undefined,
                content: []
            },
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
            currentDate: () => {
                return new Date().toISOString().slice(0, 10)
            },
            posCatItems: function () {
                var output = [];
                for (var pi in this.pos) {
                    var p = this.pos[pi];
                    var posCats = [];
                    for (var ci in this.categories) {
                        var c = this.categories[ci];
                        var catItems = this.items.filter(i => (i.pos_id === p.id || i.pos_id === 0) &&
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
            posCartCount: function () {
                var output = [];
                for (var pi in this.pos) {
                    var p = this.pos[pi];
                    var cc = this.items.filter(i => ((i.pos_id === p.id || i.pos_id === 0) && i.cart_status === 1))
                        .length;
                    output[p.id] = cc;
                }
                console.table(output);
                return output;

            }
        },
        methods: {
            onSale(start, end) {
                var today = new Date().toISOString().slice(0, 10);
                if (String(start) === 'null' || String(end) === 'null') {
                    return false;
                } else {
                    return start.slice(0, 10) <= today && end.slice(0, 10) >= today
                }
            },
            urgentIcon(urgent) {
                return urgent === 2 ? 'mdi-fridge-alert-outline' : urgent === 0 ? 'mdi-help-circle-outline' : undefined;
            },
            urgentColor(urgent) {
                return urgent === 2 ? 'deep-orange darken-1' : urgent === 0 ? 'teal darken-1' : undefined;
            },
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
                        this.pushModal({
                            ...response,
                            type: 'error',
                            title: 'Fehler beim Speichern'
                        });
                    }
                })
            },
            deleteConfirm(listItemId, listId) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
                this.items[ci].deleteLoading = true;
                this.pushModal({
                    status: true,
                    type: 'error',
                    title: 'Artikel löschen',
                    messages: ['Eintrag von deiner Einkaufsliste entfernen?'],
                    options: [{
                        text: 'Löschen',
                        action: 'deleteItem',
                        payload: [listItemId, listId]
                    }]
                });
            },
            deleteItem(listItemId, listId) {
                var ci = this.items.findIndex((i) => {
                    return i.item_id === listItemId;
                });
                this.modal.modalActionLoading = true;
                this.$store.dispatch('deleteItem', {
                    'listItemId': listItemId,
                    'listId': listId
                }).then((response) => {
                    this.items[ci].deleteLoading = false;
                    this.modal.modalActionLoading = false;
                    if (/^1\d\d$/.test(response.code)) {
                        this.items[ci].show = false;
                        this.deleteModal();
                        this.pushAlert('success', response.messages);
                    } else {
                        this.pushModal({
                            ...response,
                        });
                    }
                })
            },
            checkoutConfirm(listId, posId) {
                this.pushModal({
                    status: true,
                    type: 'confirm',
                    title: 'Warenkorb auschecken',
                    messages: ['Alle im Warenkorb dieses Marktes befindlichen Produkte endgültig entfernen?'],
                    options: [{
                        text: 'Abschließen',
                        action: 'checkoutItems',
                        payload: [listId, posId]
                    }]
                });
            },
            checkoutItems(listId, posId) {
                this.modal.modalActionLoading = true;
                this.$store.dispatch('checkoutItems', {
                    'listId': listId,
                    'posId': posId,
                }).then((response) => {
                    this.modal.modalActionLoading = false;
                    if (/^1\d\d$/.test(response.code)) {
                        this.deleteModal();
                        this.pushAlert('success', response.messages);
                    } else {
                        this.pushModal({
                            ...response,
                        });
                    }
                })
            },

        }
    }
</script>

<style>
    .cart-list .v-list-item {
        padding: 0 8px 0 0 !important;

    }



    .cart-list .v-list-item__content {
        flex-wrap: nowrap;
        font-weight: 400 !important;
    }


    .cart-list .v-list-item__content .v-btn {
        flex: 0 0 auto !important;
    }

    .cart-list .v-list-item__title {
        align-items: center;
        display: flex;
        font-size: 16px !important;
        padding: 3px 0 3px 0;
        flex: 1 1 auto !important;
        flex-wrap: nowrap;
        white-space: normal !important;
        font-weight: 400 !important;
    }



    .cart-list .v-list-item__title div {
        flex: 1;
        min-width: 0;
    }


    .cart-list .cart-item-icons {
        display: flex;
        flex: 0 0 auto;
        width: 52px;
        justify-content: space-between;
        flex-wrap: nowrap;
    }

    .cart-list .v-list-item-group.primary--text {
        color: rgba(0, 0, 0, 0.87) !important
    }

    .cart-list .v-list--dense .v-list-item {
        min-height: 34px;
    }

    .cart-quantity {
        flex: 0 0 32px !important;
    }

    .v-slide-group__prev--disabled {
        display: none !important;
    }

    .v-list-item__action {
        margin: 6px 0 6px 10px !important;
        display: flex;
        flex-wrap: nowrap;
        flex: 0 0 auto;
        width: 76px;
        flex-direction: row !important;
    }


    .checkoutListButton {
        position: fixed;
        left: 8px;
        top: 110px;
    }

    .pos-tabs {
        margin-top: -12px !important;
    }
</style>