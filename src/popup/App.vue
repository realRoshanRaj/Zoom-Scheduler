<template>
  <v-app>
    <nav>
      <v-app-bar dense color="blue">
        <v-toolbar-title
          ><span class="white--text">Zoom Scheduler</span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-menu v-model="showMenu" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="white">mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list>
            <!--Notifs-->
            <v-list-item @click="showNotifDialog = true">
              <v-list-item-icon>
                <v-icon>mdi-bell</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Notifications</v-list-item-title>
            </v-list-item>

            <v-divider />
            <!--Sort By-->
            <v-menu
              offset-x
              left
              open-on-hover
              transition="scroll-x-reverse-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-sort</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Sort By</v-list-item-title>
                  <v-icon right>mdi-chevron-right</v-icon>
                </v-list-item>
              </template>
              <v-list>
                <v-list-item-group v-model="getSortModeIndex" color="primary">
                  <v-list-item
                    v-for="(item, i) in sortMenu"
                    :key="i"
                    @click="updateSort(item.method)"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.method }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-list>
        </v-menu>
      </v-app-bar>
    </nav>
    <v-container fluid>
      <v-row justify="center">
        <ItemList />
      </v-row>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            fixed
            bottom
            right
            color="blue lighten-1"
            v-bind="attrs"
            v-on="on"
            @click="addButton"
          >
            <v-icon color="white">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add</span>
      </v-tooltip>

      <AddEditPopup
        :show-dialog="showAddDialog"
        add
        :init-data="meetingData"
        :key="addKey"
        @updateShowDialog="updateShowDialog($event)"
      />

      <Notifications
        :dialog="showNotifDialog"
        @closeNotifDialog="closeNotifDialog($event)"
      />
    </v-container>
  </v-app>
</template>

<script>
import ItemList from "../components/ItemList";
import AddEditPopup from "../components/AddEditPopup";
import Notifications from "@/components/Notifications";
export default {
  name: "App",
  components: { Notifications, AddEditPopup, ItemList },
  data: () => ({
    showAddDialog: false,
    fab: false,
    addKey: 0,
    showMenu: false,
    sortMenu: [
      { icon: "mdi-sort-alphabetical-ascending", method: "A-Z" },
      { icon: "mdi-sort-clock-ascending", method: "Upcoming" },
    ],
    meetingData: {},
    showNotifDialog: false,
  }),
  async created() {
    this.$store.commit("refreshSort");
    console.log(this.$store.state.data);
    const tabs = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tabs.length > 0) {
      const url = tabs[0].url;
      const currURL = new URL(url);
      if (currURL.hostname.includes("zoom.us")) {
        const res = await this.$confirm(
          "Would you like to add this tab as a Zoom Meeting?"
        );
        if (res) {
          const meetingIDArr = currURL.pathname.split("/");
          const id = meetingIDArr[meetingIDArr.length - 1];
          const pwd = currURL.searchParams.get("pwd");
          this.meetingData = { name: null, id, pwd, uname: null };
          this.addKey++;
          this.showAddDialog = true;
        }
      }
    }
  },

  computed: {
    getSortModeIndex() {
      const x = this.$store.state.sortMode;
      return this.sortMenu.findIndex((value) => value.method === x);
    },
  },
  methods: {
    updateSort(value) {
      this.$store.dispatch("changeAndRefreshSort", {
        mode: value,
      });
      this.showMenu = false;
    },
    updateShowDialog(showDialog) {
      this.showAddDialog = showDialog;
      this.meetingData = {};
    },
    closeNotifDialog(dialog) {
      this.showNotifDialog = dialog;
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
