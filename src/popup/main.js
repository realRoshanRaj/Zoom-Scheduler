import Vue from "vue";
import App from "./App.vue";
import store from "../store";
import vuetify from "../plugins/vuetify";
import VueClipboard from "vue-clipboard2";
import VuetifyConfirm from "vuetify-confirm";

Vue.use(VueClipboard);
Vue.use(VuetifyConfirm, { vuetify, color: "warning" });

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  vuetify,
  render: (h) => h(App),
});
