<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <ItemList />
      </v-row>

      <v-btn
        fab
        fixed
        bottom
        right
        color="blue"
        @click="showAddDialog = !showAddDialog"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <AddEditPopup
        :show-dialog="showAddDialog"
        @updateShowDialog="updateShowDialog($event)"
      />
    </v-container>
  </v-app>
</template>

<script>
import ItemList from "../components/ItemList";
import AddEditPopup from "../components/AddEditPopup";
export default {
  name: "App",
  components: { AddEditPopup, ItemList },
  data: () => ({
    showAddDialog: false
  }),
  methods: {
    updateShowDialog(showDialog) {
      this.showAddDialog = showDialog;
    }
  }
};
</script>

<style>
html {
  width: 500px;
  height: 500px;
}
</style>
