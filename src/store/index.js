import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS();
const platform = require("platform");

Vue.use(Vuex);

const sortModes = ["A-Z", "Upcoming"];

export default new Vuex.Store({
  state: {
    data: [],
    os: platform.os.family,
    sortMode: "A-Z",
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
  mutations: {
    setData: (state, value) => {
      state.data = value;
    },
    addItem: (state, value) => {
      state.data.push(value);
    },
    deleteDataIndex(state, value) {
      state.data.splice(value, 1);
    },
    changeSortMode(state) {
      const index = sortModes.indexOf(state.sortMode);
      if (index >= 0 && index < sortModes.length - 1) {
        state.sortMode = sortModes[index + 1];
      } else {
        state.sortMode = sortModes[0];
      }
    },
  },
  actions: {},
  modules: {},
});
