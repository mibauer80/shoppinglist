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
            console.log('UPDATE_ITEMS ' + JSON.stringify(payload));
            state.items = payload.map(obj=> ({ ...obj, cartLoading: false, deleteLoading: false, show: true}))
        },
        UPDATE_POS(state, payload) {
            state.pos = payload.sort(function (a, b) {
                return a.id - b.id;
            });
        },
        UPDATE_CATEGORIES(state, payload) {
            state.categories = payload.sort(function (a, b) {
                return a.id - b.id;
            });
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
            console.log('axios addItems: ' + JSON.stringify(payload));
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
            console.log('axios updateItems: ' + JSON.stringify(payload));
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
            console.log('axios cartItems: ' + JSON.stringify(payload));
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
            console.log('axios: deleteItems' + JSON.stringify(payload));
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
        checkoutItems({            
            dispatch
        }, payload) {
            console.log('axios: checkoutItems' + JSON.stringify(payload));
            return new Promise((resolve, reject) => {
                axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/checkout', payload).then((response) => {
                    if (/^1\d\d$/.test(response.data.code)) {                       
                        dispatch('getItems');
                        var msg = new SpeechSynthesisUtterance();
	msg.text = 'Dein Einkauf wurde ausgecheckt';
	msg.lang = 'de-DE';
	msg.volume = 1; // 0 to 1
	msg.rate = 1; // 0.1 to 10
	msg.pitch = 1; //0 to 2
	speechSynthesis.speak(msg); 
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