import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS();
const platform = require("platform");

Vue.use(Vuex);

const sortModes = ["A-Z", "Upcoming"];
const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

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
    updateItem: (state, { item, index }) => {
      state.data[index] = item;
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
    refreshSort(state) {
      //Refresh Sort
      if (state.data.length > 1) {
        if (state.sortMode == sortModes[0]) {
          //A-Z
          state.data.sort((a, b) => a.name.localeCompare(b.name));
        } else if (state.sortMode == sortModes[1]) {
          //Upcoming
          state.data.sort((a, b) => getNearestDate(b) - getNearestDate(a));
        }
      }
    },
  },
  actions: {
    changeAndRefreshSort(store) {
      store.commit("changeSortMode");
      store.commit("refreshSort");
    },
  },
  modules: {},
});
/* eslint-disable no-unused-vars */
function getNearestDate(item) {
  let date = new Date();
  if (item.schedule.mode == "once") {
    const year = item.schedule.date.split("-")[0],
      month = item.schedule.date.split("-")[1],
      day = item.schedule.date.split("-")[2];
    date.setFullYear(year, parseInt(month) - 1, day);
    date.setHours(item.schedule.startTime.split(":")[0]);
    date.setMinutes(item.schedule.startTime.split(":")[1]);
    date.setSeconds(0);
  } else {
    const today = new Date();

    let leastDiff = 8,
      nextDay;
    for (const i of item.schedule.days) {
      let diff = days[i.toLowerCase()] - today.getDay();
      if (diff < 0) diff += 7;
      if (diff == 0) {
        const et = item.schedule.endTime;
        //Check Times
        if (et < `${today.getHours()}:${today.getMinutes()}`) {
          diff += 7;
        }
      }

      if (diff < leastDiff) {
        leastDiff = diff;
        nextDay = i;
      }
    }
    console.log("least dif", leastDiff);
    date.setDate(date.getDate() + leastDiff);
    date.setHours(item.schedule.startTime.split(":")[0]);
    date.setMinutes(item.schedule.startTime.split(":")[1]);
    date.setSeconds(0);
  }
  return date;
}
