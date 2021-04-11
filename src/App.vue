<template>
  <Main />
</template>

<script>
import Main from "./screens/Main.vue";

export default {
  name: "App",
  components: {
    Main,
  },
};
</script>

<style>
:root {
  --var-box-shadow-s: 10px 10px 20px 0 #d1d9e6, -10px -10px 20px 0 #ffffff;
  --var-box-shadow-m: 12px 12px 16px 0 #d1d9e6, -8px -8px 16px 0 #ffffff;
  --var-primary-color: #ecf0f3;
}

* {
  box-sizing: border-box;
}

html,
body {
  font-size: 16px;
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--var-primary-color);
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
