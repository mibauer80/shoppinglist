import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    items: [],
    pos: [],
    messages: []
},
mutations: {
    UPDATE_ITEMS(state, payload) {
        state.items = payload;
    },
    UPDATE_POS(state, payload) {
        state.pos = payload;
    },
    ADD_MESSAGE(state, payload) {    
        var types = {1: 'success', 2: 'warning', 9: 'error'};
        var typeCode = payload.code.toString().substring(0,1);
        var type = types[typeCode];
        state.messages.push({...payload, 'ts':  new Date().getTime(), 'type': type});
    },
    DELETE_MESSAGE(state, payload) {
        var index = state.messages.findIndex(m => m.ts == payload.ts);
        console.log('delete index: ' + index);
        state.messages.splice(index, 1);
  }
},
actions: {
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
    addItem({
        commit
    }, payload) {
        try {
            axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/insert', payload)
                .then((response) => {                  
                    commit('ADD_MESSAGE', response.data);
                })
        } catch (error) {
            alert(error);
        }
    },
    deleteMessage({
        commit
    }, ts) {
        commit('DELETE_MESSAGE', ts);
    }
},
getters: {
    messages: state => state.messages,
    items: state => state.items,
    item_names: state => state.items.map(i => i.product_name),
    itemById: state => id => state.items.find(i => i.id === id),
    pos: state => state.pos,
}
});