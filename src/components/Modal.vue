<template>
    <v-dialog :value="modal.status" persistent>
            <v-card class="custom-modal">
                <v-card-title>
                    {{ modal.title }} 
                </v-card-title>
                <v-card-text>
                    <p v-for="(t, i) in modal.content" :key="i" v-html="t"></p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>                    
                    <v-btn v-for="(o, i) in modal.options" :key="i" color="primary white--text" small
                        :loading="modal.actionLoading"
                        @click="method(function_call(o.action, o.payload))">
                        {{ o.text }}
                    </v-btn>
                    <v-btn small
                        color="primary white--text" @click="$store.commit('UPDATE_LOADING_ITEM_SUBMIT', false); $store.dispatch('closeModal')">
                        Abbrechen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>
m 'vuex';
 
 
export default {
  name: 'Modal',
props: ['modal'],

}    
</script>