import axios from 'axios';

const state = {
    items: []
}

const mutations = {
    UPDATE_ITEMS(state, payload) {
        state.items = payload;
    }
}

const actions = {
    getItems({
        commit
    }) {
        axios.get('https://proven-aviary-293214.ey.r.appspot.com/items/list/1')
            .then((response) => {
                commit('UPDATE_ITEMS', response.data);
            })
    },
    addItem({
        commit
    }, payload) {
        try {
            axios.post('https://proven-aviary-293214.ey.r.appspot.com/items/insert', payload)
                .then((response) => {
                    alert (response.data);
                    commit('messages/ADD_MESSAGE', response.data, { root: true });
                })
        } catch (error) {
            alert(error);
        }
    }
}

const getters = {
    items: state => state.items,
    item_names: state => state.items.map(i => i.product_name),
    itemById: state => id => state.items.find(i => i.id === id),
}

const itemsModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default itemsModule;