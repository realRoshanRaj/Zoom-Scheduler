<template>
  <v-dialog v-model="showDialog" scrollable>
    <v-card rounded>
      <v-row class="justify-center">
        <v-card-title class="text-h5" v-if="add"> Add Meeting </v-card-title>
      </v-row>
      <v-divider />

      <v-card-text class="pt-6">
        <v-text-field
          v-model="name"
          label="Meeting Name"
          dense
          outlined
          shaped
          clearable
        >
        </v-text-field>
        <v-text-field
          v-model="id"
          label="Meeting ID"
          dense
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
      </v-card-text>
      <v-card-actions>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="clearFields">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Clear All Fields</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="exit()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="add ? addItem : editItem"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddEditPopup",
  props: {
    add: { type: Boolean, default: true },
    showDialog: { type: Boolean, default: false },
  },
  data: () => ({
    name: null,
    id: null,
    password: null,
    username: null,
  }),
  methods: {
    exit() {
      this.$emit("updateShowDialog", false);
    },
    clearFields() {
      this.name = null;
      this.id = null;
      this.password = null;
    },
    addItem() {
      const itemData = {
        name: this.name,
        id: this.id,
      };
      if (this.password) itemData.pwd = this.password;
      if (this.username) itemData.uname = this.username;
      this.$store.commit("addItem", itemData);
      this.clearFields();
      this.exit();
    },
    editItem() {},
  },
};
</script>

<style scoped></style>
