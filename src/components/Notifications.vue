<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-row justify="space-between" no-gutters>
        <v-col>
          <v-card-title class="text-h5"> Notifications </v-card-title>
        </v-col>
        <v-col cols="1" class="mt-3">
          <v-btn icon @click="exit">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Notifications",
  props: { dialog: Boolean },
  methods: {
    exit() {
      this.$emit("closeNotifDialog", false);
    },
  },
};
</script>

<style scoped></style>
