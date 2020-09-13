<template>
  <v-container>
    <v-card class="my-2" v-for="(item, index) in getData" :key="index">
      <v-card-title>
        {{ item.name }}
        <v-spacer />
        <!--        <span class="text&#45;&#45;disabled">@ Saturday 4:30 P.M.</span>-->
      </v-card-title>

      <v-card-actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="copyItem(item)">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy Zoom Link</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-information</v-icon>
            </v-btn>
          </template>
          <span>View Meeting Info</span>
        </v-tooltip>

        <v-spacer />

        <v-btn color="blue lighten-3" @click="openZoom(item)">Join Zoom</v-btn>

        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
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
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ItemList",
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
          item.id +
          (item.pwd ? "?pwd=" + item.pwd : "") +
          (item.uname ? "&uname=" + item.uname : "")
        }`;
      }
      console.log(url);
      browser.tabs.create({ url });
    },
    deleteItem(index) {
      this.$store.commit("deleteDataIndex", index);
    },
    copyItem(item) {
      // eslint-disable-next-line no-unused-vars
      const url = `https://zoom.us/j/${
        item.id +
        (item.pwd ? "?pwd=" + item.pwd : "") +
        (item.uname ? "&uname=" + item.uname : "")
      }`;
      this.$copyText(url);
    },
  },
  computed: {
    getData() {
      return this.$store.state.data;
    },
  },
};
</script>

<style scoped></style>
