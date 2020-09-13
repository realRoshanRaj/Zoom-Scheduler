<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <ItemList />
      </v-row>

      <v-speed-dial
        v-model="fab"
        bottom
        right
        fixed
        direction="top"
        open-on-hover
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue lighten-2" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="blue lighten-3"
              v-bind="attrs"
              v-on="on"
              @click="showAddDialog = !showAddDialog"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Add</span>
        </v-tooltip>

        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="blue lighten-3"
              v-bind="attrs"
              v-on="on"
              @click="$store.commit('changeSortMode')"
            >
              <v-icon v-if="getSortMode == 'A-Z'"
                >mdi-sort-alphabetical-ascending</v-icon
              >
              <v-icon v-else>mdi-sort-clock-ascending</v-icon>
            </v-btn>
          </template>
          <span>Sort Mode: {{ getSortMode }}</span>
        </v-tooltip>
      </v-speed-dial>

      <AddEditPopup
        :show-dialog="showAddDialog"
        @updateShowDialog="updateShowDialog($event)"
      />
      {{ $store.state.os }}
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
    showAddDialog: false,
    fab: false,
  }),
  computed: {
    getSortMode() {
      return this.$store.state.sortMode;
    },
  },
  methods: {
    updateShowDialog(showDialog) {
      this.showAddDialog = showDialog;
    },
  },
};
</script>

<style>
html {
  width: 500px;
  height: 500px;
}
</style>
