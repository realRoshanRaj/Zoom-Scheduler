<template>
  <v-container>
    <v-card class="my-2" v-for="(item, index) in getData" :key="index">
      <v-card-title>
        {{ item.name }}
        <v-spacer />
        <span class="text--disabled">@ {{ item.schedule.startTime }}</span>
      </v-card-title>

      <v-card-actions>
        <v-row no-gutters>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                :disabled="$store.state.notificationTime <= 0"
                @click="toggleNotification(index)"
              >
                <v-icon>{{
                  item.notification ? "mdi-bell" : "mdi-bell-off"
                }}</v-icon>
              </v-btn>
            </template>
            <span>Notification: {{ item.notification ? "On" : "Off" }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="copyItem(item)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy Zoom Link</span>
          </v-tooltip>

          <v-col class="mx-3">
            <v-btn color="blue lighten-2" block @click="openZoom(item)">
              Join Zoom
            </v-btn>
          </v-col>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="editItem(index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="deleteItem(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-row>
      </v-card-actions>
      <AddEditPopup
        v-if="editIndex != -1"
        :key="componentKey"
        :show-dialog="showDialog"
        :init-data="modifiedData(index)"
        @updateShowDialog="closeEditDialog($event)"
      />
    </v-card>
    <v-snackbar
      top
      shaped
      v-model="showSnackbar"
      :color="snackColor"
      :timeout="3000"
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showSnackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <!--    <div class="my-9"></div>-->
    <v-row justify="center" v-if="getData.length > 0">
      <v-img src="../assets/logo.png" max-width="150" aspect-ratio="1"></v-img>
    </v-row>
  </v-container>
</template>

<script>
import AddEditPopup from "./AddEditPopup";
export default {
  name: "ItemList",
  components: { AddEditPopup },
  data: () => ({
    showDialog: false,
    editIndex: -1,
    componentKey: 0,
    message: "",
    showSnackbar: false,
    snackColor: "",
  }),
  methods: {
    openZoom(item) {
      const os = this.$store.state.os;
      let url;
      if (os.toLowerCase() == "windows" || os.toLowerCase() == "macos") {
        url = `zoommtg://zoom.us/join?confno=${
          item.id +
          (item.pwd ? "&pwd=" + item.pwd : "") +
          (item.uname ? "&uname=" + item.uname : "")
        }`;
      } else {
        url = `https://zoom.us/j/${
          item.id + (item.pwd ? "?pwd=" + item.pwd : "")
        }`;
      }
      // console.log(url);
      browser.tabs.create({ url });
    },
    async deleteItem(index) {
      const res = await this.$confirm(
        "Are you sure you would like to delete this?"
      );
      if (res) {
        await browser.alarms.clear(this.$store.state.data[index].uuid);
        this.$store.commit("deleteDataIndex", index);
      }
    },
    copyItem(item) {
      // eslint-disable-next-line no-unused-vars
      const url = `https://zoom.us/j/${
        item.id + (item.pwd ? "?pwd=" + item.pwd : "")
      }`;
      try {
        this.$copyText(url);
        this.message = "Copy Successful";
        this.snackColor = "success";
        this.showSnackbar = true;
      } catch (e) {
        this.message = "Copy Failed";
        this.snackColor = "error";
        this.showSnackbar = true;
      }
    },
    editItem(index) {
      this.editIndex = index;
      this.showDialog = true;
      this.componentKey++;
    },
    closeEditDialog(showDialog) {
      this.showDialog = showDialog;
      this.index = -1;
    },
    async toggleNotification(index) {
      this.$store.commit("toggleNotification", index);
      const item = this.$store.state.data[index];
      if (item.notification) {
        const when =
          this.$store.getters.getNextDate(index) -
          this.$store.state.notificationTime * 60000;
        if (when > Date.now()) {
          browser.alarms.create(item.uuid, {
            when,
          });
        }
      } else {
        await browser.alarms.clear(this.$store.state.data[index].uuid);
      }
    },
  },
  computed: {
    getData() {
      return this.$store.state.data;
    },
    modifiedData() {
      if (this.editIndex != -1) {
        const data = this.$store.state.data;
        let mod = data[this.editIndex];
        mod.index = this.editIndex;
        return function () {
          return mod;
        };
      }
      return function () {
        return {};
      };
    },
  },
};
</script>

<style scoped></style>
