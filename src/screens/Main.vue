<template>
  <main class="container">
    <Authenticated v-if="isAuthenticated" @logout="setIsAuthenticated(false)" />

    <transition v-else name="fade">
      <Authentication @login="setIsAuthenticated(true)" />
    </transition>
  </main>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import Authentication from "@/components/Authentication.vue";
import Authenticated from "@/components/Authenticated.vue";
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

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  min-width: 100vw;
  padding: 1rem;
}
</style>
