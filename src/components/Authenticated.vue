<template>
  <nav>
    <button class="logout-button" @click="logout">Logout</button>
  </nav>
  <section class="team-container">
    <Team :key="team.id" v-for="team in teams" :team="team" />
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import Team from "@/components/Team.vue";
import API from "@/services/api";
import Session from "@/services/session";
import { CLICKUP_TOKEN } from "@/config/authentication";

export default defineComponent({
  components: {
    Team,
  },

  setup: (_, { emit }) => {
    const state = reactive({
      teams: {},
    });

    onMounted(async () => {
      state.teams = await API.teams();
    });

    const logout = () => {
      Session.delete(CLICKUP_TOKEN);
      emit("logout");
    };

    return {
      ...toRefs(state),
      logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.logout-button {
  border: 0;
  background: inherit;
  box-shadow: var(--var-box-shadow-s);
  color: var(--var-tertiary-color);
  cursor: pointer;
  display: block;
  font-size: 1.2rem;
  letter-spacing: 0.1rem;
  margin-left: auto;
  padding: 0.5rem 1rem;
}
</style>
