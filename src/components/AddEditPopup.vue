<template>
  <v-dialog v-model="isDialog" persistent>
    <v-card rounded>
      <v-row justify="space-between" no-gutters>
        <v-col>
          <v-card-title class="text-h5" v-if="add">
            {{ step == 1 ? "Add Meeting" : "Add Meeting (Schedule)" }}
          </v-card-title>
          <v-card-title class="text-h5" v-else>
            {{ step == 1 ? "Edit Meeting" : "Edit Meeting (Schedule)" }}
          </v-card-title>
        </v-col>
        <v-col cols="1" class="mt-3">
          <v-btn icon @click="exit">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-window v-model="step">
        <v-form v-model="formValid">
          <v-window-item :value="1">
            <v-card-text class="pt-6">
              <v-text-field
                v-model="name"
                label="Meeting Name"
                dense
                autofocus
                outlined
                required
                :rules="[(v) => !!v || 'Name is required']"
                shaped
                clearable
              >
              </v-text-field>

              <div>
                <v-btn
                  :color="isZoom ? 'green accent-2' : 'light-blue accent-1'"
                  small
                  block
                  rounded
                  @click="isZoom = !isZoom"
                >
                  {{
                    isZoom
                      ? "Click here to Enter Non-Zoom Meeting"
                      : "Click here to Enter Zoom Meeting"
                  }}
                </v-btn>
              </div>

              <div
                style="outline: #64b5f6 dashed medium; outline-offset: 5px"
                class="mt-5"
                v-if="isZoom"
              >
                <v-text-field
                  v-model="id"
                  label="Meeting ID"
                  dense
                  required
                  :rules="[(v) => !!v || 'Meeting ID is required']"
                  outlined
                  clearable
                  type="number"
                >
                </v-text-field>
                <v-text-field
                  v-model="password"
                  label="Meeting Password (optional)"
                  dense
                  outlined
                  clearable
                >
                </v-text-field>
                <v-text-field
                  v-model="username"
                  label="Your Meeting Username (optional)"
                  dense
                  outlined
                  clearable
                >
                </v-text-field>
              </div>
              <div v-else class="mt-5">
                <v-text-field
                  v-model="link"
                  autofocus
                  label="Enter Your Meeting Link"
                  :rules="[(v) => isLinkValid(v)]"
                  dense
                  outlined
                  clearable
                >
                </v-text-field>
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-menu
                ref="menuS"
                v-model="menuS"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="startTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formatStartTime"
                    label="Start Time"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'start time is required']"
                    prepend-icon="mdi-clock-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menuS"
                  v-model="startTime"
                  scrollable
                  @click:minute="$refs.menuS.save(startTime)"
                ></v-time-picker>
              </v-menu>

              <v-menu
                ref="menuE"
                v-model="menuE"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="endTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formatEndTime"
                    label="End Time"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'end time is required']"
                    prepend-icon="mdi-clock-time-seven-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menuE"
                  v-model="endTime"
                  scrollable
                  @click:minute="$refs.menuE.save(endTime)"
                ></v-time-picker>
              </v-menu>
              <div class="text-subtitle-2">Occurrence</div>
              <v-radio-group v-model="scheduleSelection" column>
                <v-radio label="Once" value="once"></v-radio>
                <v-radio
                  label="Every Day"
                  value="daily"
                  @click="weekdays = getDays.slice()"
                ></v-radio>
                <v-radio
                  label="Every Week"
                  value="weekly"
                  @click="weekdays = weekdays.length == 7 ? [] : weekdays"
                ></v-radio>
              </v-radio-group>

              <v-menu
                v-if="scheduleSelection == 'once'"
                v-model="menuD"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="computedDateFormatted"
                    label="Select Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="[(v) => !!v || 'Date is required']"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  :min="getToday"
                  @input="menuD = false"
                ></v-date-picker>
              </v-menu>

              <v-select
                v-else-if="scheduleSelection !== null"
                v-model="weekdays"
                multiple
                small-chips
                label="Select Day(s)"
                :items="getDays"
                @change="radioValidater"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="toggle">
                    <v-list-item-action>
                      <v-icon>{{ getSelectAllIcon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Select All</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-card-text>
          </v-window-item>
        </v-form>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions class="py-3">
        <v-tooltip right v-if="step == 1">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="clearFields">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Clear All Fields</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="step == 1"
          color="blue darken-1"
          text
          @click="step = 1"
          >Back</v-btn
        >
        <v-btn
          v-if="step == 2"
          color="blue darken-1"
          text
          :disabled="saveDisabled"
          @click="save"
          >Save
        </v-btn>
        <v-btn v-else color="blue darken-1" text @click="step = 2">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddEditPopup",
  props: {
    add: { type: Boolean, default: false },
    showDialog: { type: Boolean, default: false },
    initData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data: () => ({
    formValid: false,
    isZoom: true,
    name: null,
    id: null,
    password: null,
    username: null,
    link: null,
    step: 1,
    scheduleSelection: null,
    menuS: false,
    menuE: false,
    menuD: false,
    startTime: null,
    endTime: null,
    weekdays: [],
    date: null,
    uuid: null,
    notification: true,
  }),
  computed: {
    isDialog() {
      return this.showDialog;
    },
    saveDisabled() {
      return !(
        this.formValid &&
        (this.isZoom ? this.id : this.link) &&
        this.name &&
        this.startTime &&
        this.endTime &&
        this.scheduleSelection &&
        (this.date || this.weekdays.length > 0)
      );
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    formatStartTime() {
      return this.formatTime(this.startTime);
    },
    formatEndTime() {
      return this.formatTime(this.endTime);
    },
    getToday() {
      return new Date().toISOString().slice(0, 10);
    },
    getDays() {
      return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
    },
    getSelectAllIcon() {
      if (this.weekdays.length >= 7) return "mdi-close-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  mounted() {
    if (Object.keys(this.initData).length) {
      this.name = this.initData.name;
      if (this.initData.id) {
        this.isZoom = true;
        this.id = this.initData.id;
      } else if (this.initData.link) {
        this.isZoom = false;
        this.link = this.initData.link;
      }

      this.uuid = this.initData.uuid;
      this.notification = this.initData.notification;
      if (this.initData.pwd) this.password = this.initData.pwd;
      if (this.initData.uname) this.username = this.initData.uname;

      if (this.initData.schedule) {
        this.scheduleSelection = this.initData.schedule.mode;
        this.startTime = this.initData.schedule.startTime;
        this.endTime = this.initData.schedule.endTime;
        if (this.initData.schedule.days)
          this.weekdays = this.initData.schedule.days;
        if (this.initData.schedule.date)
          this.date = this.initData.schedule.date;
      }
    }
  },
  methods: {
    isLinkValid(v) {
      try {
        // eslint-disable-next-line no-unused-vars
        const url = new URL(v);
        if (url.hostname.includes("zoom.us")) {
          return "You must Enter this meeting as a Zoom Meeting";
        }
        return true;
      } catch (e) {
        return "Invalid URL";
      }
    },
    exit() {
      this.$emit("update-show-dialog", false);
    },
    clearFields() {
      this.name = null;
      this.id = null;
      this.password = null;
    },
    async save() {
      let when;
      if (this.add) {
        this.addItem();
        when =
          this.$store.getters.getNextDate(this.$store.state.data.length - 1) -
          this.$store.state.notificationTime * 60000;
      } else {
        this.editItem(this.initData.index);

        //Alarms
        await browser.alarms.clear(this.initData.uuid);
        when =
          this.$store.getters.getNextDate(this.initData.index) -
          this.$store.state.notificationTime * 60000;
      }

      if (when > Date.now() && this.notification) {
        browser.alarms.create(this.uuid, {
          when,
        });
      }

      this.$store.commit("refreshSort");
      this.clearFields();
      this.exit();
    },
    addItem() {
      const itemData = {
        name: this.name,
        uuid: uuidv4(),
        notification: true,
      };
      this.uuid = itemData.uuid;
      if (this.isZoom) {
        itemData.id = this.id;
        if (this.password) itemData.pwd = this.password;
        if (this.username) itemData.uname = this.username;
      } else {
        itemData.link = this.link;
      }

      const schedule = {
        startTime: this.startTime,
        endTime: this.endTime,
        mode: this.scheduleSelection,
      };
      if (this.scheduleSelection == "once") {
        schedule.date = this.date;
      } else {
        schedule.days = this.weekdays;
      }
      itemData.schedule = schedule;
      this.$store.commit("addItem", itemData);
    },
    editItem(index) {
      const itemData = {
        name: this.name,
        uuid: this.initData.uuid,
        notification: this.initData.notification,
      };
      if (this.isZoom) {
        itemData.id = this.id;
        if (this.password) itemData.pwd = this.password;
        if (this.username) itemData.uname = this.username;
      } else {
        itemData.link = this.link;
      }
      const schedule = {
        startTime: this.startTime,
        endTime: this.endTime,
        mode: this.scheduleSelection,
      };
      if (this.scheduleSelection == "once") {
        schedule.date = this.date;
      } else {
        schedule.days = this.weekdays;
      }
      itemData.schedule = schedule;
      this.$store.commit("updateItem", { item: itemData, index });
    },
    toggle() {
      this.$nextTick(() => {
        if (this.weekdays.length >= 7) {
          this.weekdays = [];
        } else {
          this.weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].slice();
        }
      });
    },
    radioValidater() {
      if (this.scheduleSelection === "daily" && this.weekdays.length < 7) {
        this.scheduleSelection = "weekly";
      } else if (
        this.scheduleSelection === "weekly" &&
        this.weekdays.length === 7
      ) {
        this.scheduleSelection = "daily";
      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    formatTime(time) {
      if (!time) return null;

      let [hours, minutes] = time.split(":");
      const ampm = hours >= 12 ? "P.M." : "A.M.";
      hours = hours % 12;
      if (hours == 0) hours = 12;
      return `${hours}:${minutes} ${ampm}`;
    },
  },
};
</script>

<style scoped></style>
