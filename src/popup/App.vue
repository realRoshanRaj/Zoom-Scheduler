<template>
  <v-container justify="center">
    Hello
    <hello-world />
    <v-btn>HI THERE</v-btn>
  </v-container>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "App",
  components: { HelloWorld }
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
