import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: []
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    })
  ],
  mutations: {
    setData: (state, value) => {
      state.data = value;
    }
  },
  actions: {},
  modules: {}
});
