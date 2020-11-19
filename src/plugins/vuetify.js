import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi", // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        mainBlue: colors.blue,
        secondaryBlue: colors.blue.lighten2,
      },
      dark: {
        mainBlue: colors.blue,
        secondaryBlue: colors.blue.darken1,
      },
    },
  },
});
