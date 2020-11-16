import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    items: [],
    pos: [],
    messages: [],
    modal: {
        display:false,
        title:'',
        text:'',
        option: []
    }
},
mutations: {
    UPDATE_ITEMS(state, payload) {
        state.items = payload;
    },
    UPDATE_POS(state, payload) {
        state.pos = payload;
    },
    ADD_MESSAGE(state, payload) {    
        var types = {1: 'success', 2: 'warning', 3: 'warning', 9: 'error'};
        var typeCode = payload.code.toString().substring(0,1);
        var type = types[typeCode];
        var messageCodes = [101,102,103];
        if (messageCodes.includes(payload.code)) {
        state.modal = {};        
        state.messages.push({...payload, 'ts':  new Date().getTime(), 'type': type});
        } else {        
        var messageText =  payload.messages[0];
        state.modal = {display:true, title: 'Eingabefehler', text: messageText, options: payload.options};
        }
    },
    DELETE_MESSAGE(state, payload) {
        var index = state.messages.findIndex(m => m.ts == payload.ts); 
        state.messages.splice(index, 1);
  },
  DELETE_MODAL(state) { 
    state.modal = {
        display:false,
        title:'',
        text:'',
        option:[]
    };
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
                    this.state.dialog = true;
                })
        } catch (error) {
            alert(error);
        }
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
    items: state => state.items,
    itemsCombo: state => state.items.map(function(i){ return {text: i.product_name, value: i.item_id}}),
    itemById: state => id => state.items.find(i => i.id === id),
    pos: state => state.pos,
    modal: state => state.modal
}
});