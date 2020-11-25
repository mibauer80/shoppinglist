<template>
    <v-snackbar v-model="alert.status" :centered="true" :absolute="true" color="success">
      <span v-for="c in alert.content" :key="c.index">
        {{ c }}
      </span>

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="$store.dispatch('closeAlert')">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
 
export default {
  name: 'Alert',

}   
</script>