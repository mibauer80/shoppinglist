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
    },
    
    mutations: {
        UPDATE_PRODUCTS(state, payload) {
            state.products = payload;
        },
        UPDATE_ITEMS(state, payload) {
            state.items = payload.map(obj=> ({ ...obj, cartLoading: false, deleteLoading: false }))
        },
        UPDATE_POS(state, payload) {
            state.pos = payload;
        },
        UPDATE_CATEGORIES(state, payload) {
            state.categories = payload;
        },
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
            dispatch
        }, payload) {
            console.log('axios: ' + JSON.stringify(payload));
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/insert', payload).then(response => {
                    if (/^1\d\d$/.test(response.data.code)) {
                    dispatch('getProducts');
                    dispatch('getItems');
                    }
                    var resetForm = /^1\d\d$/.test(response.data.code);
                    resolve({
                        ...response.data,
                        'resetForm': resetForm
                    })
                }).catch(error => {
                    reject(error);
                })
            })
        },
        updateItem({            
            dispatch
        }, payload) {
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/update', payload).then((response) => {
                    if (/^1\d\d$/.test(response.data.code)) {
                        dispatch('getProducts');
                        dispatch('getItems');
                        }
                    var resetForm = /^1\d\d$/.test(response.data.code);
                    resolve({
                        ...response.data,
                        'resetForm': resetForm
                    })
                }).catch(error => {
                    reject(error);
                })
            })
        },
        cartItem({            
            dispatch
        }, payload) {
            console.log('axios: ' + JSON.stringify(payload));
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/cart', payload).then((response) => {
                    if (/^1\d\d$/.test(response.data.code)) {                       
                        dispatch('getItems');
                        }                 
                    resolve({
                        ...response.data,                       
                    })
                }).catch(error => {
                    reject(error);
                })
            })
        },
        deleteItem({            
            dispatch
        }, payload) {
            console.log('axios: ' + JSON.stringify(payload));
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/delete', payload).then((response) => {
                    if (/^1\d\d$/.test(response.data.code)) {                       
                        dispatch('getItems');
                        }                 
                    resolve({
                        ...response.data,                       
                    })
                }).catch(error => {
                    reject(error);
                })
            })
        },
    },
    getters: {
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
    }
});