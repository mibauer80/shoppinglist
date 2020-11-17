import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({

    state: {
        products: [],
        items: [],
        categories: [],
        pos: [],
        messages: [],
        modal: {
            display: false,
            title: '',
            text: '',
            option: []
        },
        alert: false,
    },
    mutations: {
        UPDATE_PRODUCTS(state, payload) {
            state.products = payload;
        },
        UPDATE_ITEMS(state, payload) {
            state.items = payload;
        },
        UPDATE_POS(state, payload) {
            state.pos = payload;
        },
        UPDATE_CATEGORIES(state, payload) {
            state.categories = payload;
        },
        ADD_MESSAGE(state, payload) {
            var types = {
                1: 'success',
                2: 'warning',
                3: 'warning',
                9: 'error'
            };
            var typeCode = payload.code.toString().substring(0, 1);
            var type = types[typeCode];            
            if (/^1\d\d$/.test(payload.code)) {
                state.modal = {};
                state.messages.push({
                    ...payload,
                    'ts': new Date().getTime(),
                    'type': type
                });
            } else {
                state.modal = {
                    display: true,
                    title: 'Eingabefehler',
                    text: payload.messages,
                    options: payload.options
                };
            }
        },
        DELETE_MESSAGE(state, payload) {
            var index = state.messages.findIndex(m => m.ts == payload.ts);
            state.messages.splice(index, 1);
        },
        DELETE_MODAL(state) {
            state.modal = {
                display: false,
                title: '',
                text: '',
                option: []
            };
        }
    },
    actions: {
        getProducts({
            commit
        }) {
            axios.get('https://proven-aviary-293214.ey.r.appspot.com/products/list')
                .then((response) => {
                    commit('UPDATE_PRODUCTS', response.data);
                })
        },
        getItems({
            commit
        }) {
            axios.get('https://proven-aviary-293214.ey.r.appspot.com/items/list/1')
                .then((response) => {
                    commit('UPDATE_ITEMS', response.data);
                })
        },
        getPos({
            commit
        }) {
            axios.get('https://proven-aviary-293214.ey.r.appspot.com/pos/list')
                .then((response) => {
                    commit('UPDATE_POS', response.data);
                })
        },
        getCategories({
            commit
        }) {
            axios.get('https://proven-aviary-293214.ey.r.appspot.com/categories/list')
                .then((response) => {
                    commit('UPDATE_CATEGORIES', response.data);
                })
        },
        addItem({
            commit,
            dispatch
        }, payload) {
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/insert', payload).then(response => {
                    dispatch('getProducts');
                    dispatch('getItems');
                    commit('ADD_MESSAGE', response.data);
                    this.state.dialog = true;
                    var resetForm = /^1\d\d$/.test(response.data.code);
                    resolve({
                        'resetForm': resetForm
                    })
                }).catch(error => {
                    reject(error);
                })
            })
        },
        updateItem({
            commit
        }, payload) {
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/update', payload).then((response) => {
                    commit('ADD_MESSAGE', response.data);
                    this.state.dialog = true;
                    var resetForm = /^1\d\d$/.test(response.data.code);
                    resolve({
                        'resetForm': resetForm
                    })
                }).catch(error => {
                    reject(error);
                })
            })
        },
        deleteMessage({
            commit
        }, ts) {
            commit('DELETE_MESSAGE', ts);
        },
        deleteModal({
            commit
        }) {
            commit('DELETE_MODAL');
        }
    },
    getters: {
        messages: state => state.messages,
        products: state => state.products,
        items: state => state.items,
        productsCombo: state => state.products.map(function (p) {
            return {
                text: p.name,
                value: p.id
            }
        }),
        itemById: state => id => state.items.find(i => i.id === id),
        pos: state => state.pos,
        categories: state => state.categories,
        modal: state => state.modal
    }
});