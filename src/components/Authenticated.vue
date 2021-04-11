<template>
  <section class="team-container">
    <Team :key="team.id" v-for="team in teams" :team="team" />
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import Team from "../components/Team.vue";
import API from "@/services/api";

export default defineComponent({
  components: {
    Team,
  },

  setup: () => {
    const state = reactive({
      teams: {},
    });

    onMounted(async () => {
      state.teams = await API.teams();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.team-container {
  margin-top: 2rem;
}
</style>
