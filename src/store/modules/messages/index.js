const state = {
    messages: {messages: ['OK']},
}

const mutations = {
    ADD_MESSAGE(state, payload) {
        state.messages = payload;
    }
}

const actions = {
}

const getters = {
    messages: state => state.messages,
}

const messagesModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default messagesModule;