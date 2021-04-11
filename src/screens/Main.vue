<template>
  <main class="container">
    <Authenticated v-if="isAuthenticated" />

    <Authentication v-else @authenticated="setIsAuthenticated" />
  </main>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import Authentication from "../components/Authentication.vue";
import Authenticated from "../components/Authenticated.vue";
import Session from "@/services/session";
import { CLICKUP_TOKEN } from "@/config/authentication";

export default defineComponent({
  components: {
    Authentication,
    Authenticated,
  },

  setup: () => {
    const state = reactive({
      isAuthenticated: false,
    });

    onMounted(() => {
      const token = Session.get(CLICKUP_TOKEN);

      state.isAuthenticated = !!token;
    });

    const setIsAuthenticated = (value) => {
      state.isAuthenticated = value;
    };

    return {
      ...toRefs(state),
      setIsAuthenticated,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
</style>
