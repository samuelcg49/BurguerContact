<template>
  <div id="app">
    <Header />
    <Router-view></Router-view>
    <Footer />
  </div>
</template>

<script>
import header from "./components/Header.vue";
import footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header: header,
    Footer: footer,
  },
};
</script>

<style></style>
