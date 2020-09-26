<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-row justify="space-between" no-gutters>
        <v-col>
          <v-card-title class="text-h5">
            Notifications
            <v-switch v-model="state" class="ml-3" inset></v-switch>
          </v-card-title>
        </v-col>
        <v-col cols="1" class="mt-3">
          <v-btn icon @click="exit">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-card-text class="mt-6">
        <v-form v-model="valid">
          <v-text-field
            v-model="minutes"
            :disabled="!state"
            label="Reminder Time"
            type="number"
            autofocus
            min="1"
            max="60"
            :rules="[rules.required, rules.max, rules.min]"
            suffix="minutes"
            outlined
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text :disabled="saveDisabled" @click="save"
          >Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Notifications",
  props: { dialog: Boolean },
  created() {
    this.minutes = this.$store.state.notificationTime;
    this.state = this.minutes > 0;
    if (this.minutes < 0) {
      this.minutes = 5;
    }
  },
  computed: {
    saveDisabled() {
      if (this.state) {
        return !this.valid;
      }
      return false;
    },
  },
  methods: {
    exit() {
      this.$emit("closeNotifDialog", false);
    },
    save() {
      this.$store.commit(
        "updateNotificationTime",
        this.state ? this.minutes : -1
      );
      browser.runtime.sendMessage("notif");
      this.exit();
    },
  },
  data: () => ({
    minutes: 1,
    rules: {
      required: (v) => !!v || "Required",
      min: (v) => v > 0 || "Reminder Time has to be a positive number",
      max: (v) => v <= 60 || "Reminder Time cannot exceed 1 hour (60 minutes)",
    },
    state: true,
    valid: false,
  }),
};
</script>

<style scoped></style>
