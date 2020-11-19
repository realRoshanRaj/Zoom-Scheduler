<template>
  <v-app>
    <nav>
      <v-app-bar dense color="mainBlue">
        <v-toolbar-title
          ><span class="white--text">Zoom Scheduler</span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-menu v-model="showMenu" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn id="menu" icon v-bind="attrs" v-on="on">
              <v-badge
                overlap
                color="red"
                dot
                :value="$store.state.updateAvailable"
              >
                <v-icon color="white">mdi-menu</v-icon>
              </v-badge>
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

            <v-divider />
            <!--Start Walk-Through-->
            <v-menu
              offset-x
              left
              open-on-hover
              transition="scroll-x-reverse-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-badge
                      overlap
                      color="red"
                      dot
                      :value="$store.state.updateAvailable"
                    >
                      <v-icon>mdi-help</v-icon>
                    </v-badge>
                  </v-list-item-icon>
                  <v-list-item-title>Help</v-list-item-title>
                  <v-icon right>mdi-chevron-right</v-icon>
                </v-list-item>
              </template>
              <v-list>
                <v-list-item @click="startTour">
                  <v-list-item-icon>
                    <v-icon>mdi-play</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Start Walkthrough</v-list-item-title>
                </v-list-item>
                <v-list-item @click="reloadApp">
                  <v-list-item-icon>
                    <v-badge
                      overlap
                      color="red"
                      dot
                      :value="$store.state.updateAvailable"
                    >
                      <v-icon>mdi-reload</v-icon>
                    </v-badge>
                  </v-list-item-icon>
                  <v-list-item-title>Reload</v-list-item-title>
                </v-list-item>
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

      <v-speed-dial
        v-model="fab"
        bottom
        right
        fixed
        direction="top"
        open-on-hover
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="mainBlue" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else id="addBttn">mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="secondaryBlue"
              v-bind="attrs"
              v-on="on"
              @click="addButton('zoom')"
            >
              <v-icon color="white">mdi-video</v-icon>
            </v-btn>
          </template>
          <span>Add Zoom Meeting</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="secondaryBlue"
              v-bind="attrs"
              v-on="on"
              @click="addButton('link')"
            >
              <v-icon color="white">mdi-link-variant</v-icon>
            </v-btn>
          </template>
          <span>Add Meeting Link</span>
        </v-tooltip>
      </v-speed-dial>

      <AddEditPopup
        :show-dialog="showAddDialog"
        add
        :init-data="meetingData"
        :key="addKey"
        :zoom="isZoom"
        @update-show-dialog="updateShowDialog($event)"
      />

      <Notifications
        :dialog="showNotifDialog"
        @close-notif-dialog="closeNotifDialog($event)"
      />

      <v-tour
        name="appTour"
        :steps="steps"
        :callbacks="{ onFinish: onTourFinish, onSkip: onTourFinish }"
      ></v-tour>

      <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please stand by
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
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
    loadingDialog: false,
    fab: false,
    addKey: 0,
    showMenu: false,
    sortMenu: [
      { icon: "mdi-sort-alphabetical-ascending", method: "A-Z" },
      { icon: "mdi-sort-clock-ascending", method: "Upcoming" },
    ],
    meetingData: {},
    showNotifDialog: false,
    isZoom: true,
    steps: [
      {
        target: "#logo",
        content: "Start Walk-through",
      },
      {
        target: "#logo",
        content:
          "<img src='/icons/Autofill.png' width='100%'> Autofill Zoom Meetings with URL by <strong> navigating to the tab with the URL open, and opening the extension <strong/>",
        params: {
          placement: "top-start",
        },
      },
      {
        target: "#addBttn",
        content: "Add Meetings by clicking here",
        params: {
          placement: "left",
        },
      },
      {
        target: "#menu",
        content: "Open Menu for Notification and Sort Customization",
        params: {
          highlight: true,
        },
      },
      {
        target: "#notif0",
        content: "Turn Individual Meeting Notifications On and Off",
        params: {
          highlight: true,
        },
      },
      {
        target: "#copy0",
        content: "Copy the Link for Your Meeting",
        params: {
          highlight: true,
        },
      },
      {
        target: "#join0",
        content: "Button to instantly join the Your Meeting",
        params: {
          highlight: true,
        },
      },
      {
        target: "#edit0",
        content: "Click to Edit Meeting Details",
        params: {
          highlight: true,
        },
      },
      {
        target: "#delete0",
        content: "Click to Permanently Delete Meeting",
        params: {
          highlight: true,
        },
      },
    ],
  }),
  async created() {
    await this.$store.dispatch("onStartup");
    this.$vuetify.theme.dark = this.$store.state.darkTheme;
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
  mounted() {
    if (this.$store.state.first) {
      this.startTour();
    }
  },
  computed: {
    getSortModeIndex() {
      const x = this.$store.state.sortMode;
      return this.sortMenu.findIndex((value) => value.method === x);
    },
  },
  methods: {
    startTour() {
      this.showMenu = false;
      this.$store.dispatch("startTour");
      this.$tours["appTour"].start();
    },
    onTourFinish() {
      this.$store.dispatch("endTour");
    },
    updateSort(value) {
      this.$store.dispatch("changeAndRefreshSort", {
        mode: value,
      });
      this.showMenu = false;
    },
    reloadApp() {
      this.showMenu = false;
      this.$store.commit("setUpdateAvailable", false);
      browser.runtime.reload();
    },
    updateShowDialog(showDialog) {
      this.showAddDialog = showDialog;
      this.meetingData = {};
    },
    closeNotifDialog(dialog) {
      this.showNotifDialog = dialog;
    },
    addButton(type) {
      if (type === "zoom") {
        this.isZoom = true;
      } else {
        this.isZoom = false;
      }
      this.addKey++;
      this.showAddDialog = !this.showAddDialog;
    },
  },
};
</script>

<style>
html,
body {
  width: 550px;
  height: 550px;
}
</style>
