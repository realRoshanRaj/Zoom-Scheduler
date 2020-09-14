<template>
  <v-app>
    <nav>
      <v-app-bar dense>
        <v-toolbar-title>Zoom Scheduler</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="$store.commit('refreshSort')"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </template>
          <span>Refresh Sort</span>
        </v-tooltip>
      </v-app-bar>
    </nav>
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
              @click="addButton"
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
              @click="$store.dispatch('changeAndRefreshSort')"
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
        add
        :key="addKey"
        @updateShowDialog="updateShowDialog($event)"
      />
      <!--      {{ $store.state.os }}-->
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
    addKey: 0,
  }),
  mounted() {
    this.$store.commit("refreshSort");
  },
  computed: {
    getSortMode() {
      return this.$store.state.sortMode;
    },
  },
  methods: {
    updateShowDialog(showDialog) {
      this.showAddDialog = showDialog;
    },
    addButton() {
      this.addKey++;
      this.showAddDialog = !this.showAddDialog;
    },
  },
};
</script>

<style>
html {
  width: 550px;
  height: 550px;
}
</style>
