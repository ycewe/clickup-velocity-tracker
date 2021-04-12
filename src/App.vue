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

<style lang="scss">
:root {
  --var-box-shadow-s: 8px 8px 14px 0 #d1d9e6, -8px -8px 14px 0 #ffffff80;
  --var-box-shadow-m: 12px 12px 16px 0 #d1d9e6, -8px -8px 16px 0 #ffffff80;
  --var-title-shadow: -8px 5px 8px #d1d9e6, 8px -5px 12px #ffffff80;
  --var-image-shadow: inset 7px 7px 15px #d1d9e6, inset -7px -7px 20px #ffffff,
    0px 0px 4px #ffffff40;

  --var-primary-color: #ecf0f3;
  --var-secondary-color: #20b2aa;
  --var-tertiary-color: #708090;

  --var-error-color: #8b0000;
}

*,
*::before,
*::after {
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
