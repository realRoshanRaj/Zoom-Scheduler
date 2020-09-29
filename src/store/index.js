import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
const platform = require("platform");
import { v4 as uuidv4 } from "uuid";
import SecureLS from "secure-ls";
const ls = new SecureLS();

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
    sortMode: "Upcoming",
    notificationTime: 5,
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
    changeSortMode(state, value) {
      state.sortMode = value;
    },
    refreshSort(state) {
      //Refresh Sort
      if (state.data.length > 1) {
        if (state.sortMode == sortModes[0]) {
          //A-Z
          state.data.sort((a, b) => a.name.localeCompare(b.name));
        } else if (state.sortMode == sortModes[1]) {
          //Upcoming
          state.data.sort(
            (a, b) => getNearestDate(a, true) - getNearestDate(b, true)
          );
        }
      }
      console.log(state.data);
    },
    updateNotificationTime(state, value) {
      state.notificationTime = value;
    },
    toggleNotification(state, index) {
      state.data[index].notification = !state.data[index].notification;
    },
  },
  getters: {
    getNextDate: (state) => (index) => {
      return getNearestDate(state.data[index], false);
    },
    getElementFromUUID: (state) => (uuid) => {
      return state.data.filter((value) => value.uuid == uuid);
    },
  },
  actions: {
    changeAndRefreshSort(store, { mode }) {
      store.commit("changeSortMode", mode);
      store.commit("refreshSort");
    },
    onStartup(store) {
      store.commit("refreshSort");
      store.state.data.forEach((item) => {
        if (!item.uuid) item.uuid = uuidv4();
        if (!item.notification) item.notification = true;
      });
    },
  },
  modules: {},
});
/* eslint-disable no-unused-vars */
function getNearestDate(item, end) {
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
        const et = end ? item.schedule.endTime : item.schedule.startTime;
        //Check Times
        const current = today.toString().substr(16, 5);
        if (et < current) {
          diff += 7;
        }
      }

      if (diff < leastDiff) {
        leastDiff = diff;
        nextDay = i;
      }
    }
    date.setDate(date.getDate() + leastDiff);
    date.setHours(item.schedule.startTime.split(":")[0]);
    date.setMinutes(item.schedule.startTime.split(":")[1]);
    date.setSeconds(0);
  }
  return date;
}
