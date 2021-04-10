<template>
  <h1 class="title">
    <img class="team-avatar" :src="team.avatar" :alt="team.name" />
    {{ team.name }}
  </h1>
  <div class="space-container" v-if="spaces.length > 0">
    <Space v-for="space in spaces" :key="space.id" :space="space" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import API from "@/services/api";
import Space from "./Space.vue";

const BLACKLIST = ["Business Requirements"];

export default defineComponent({
  components: { Space },
  props: {
    team: {
      type: Object,
      required: true,
    },
  },

  setup: ({ team }) => {
    const state = reactive({
      spaces: [],
    });

    onMounted(async () => {
      const spaces = await API.spaces(team.id);
      state.spaces = spaces.filter((space) => !BLACKLIST.includes(space.name));
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.title {
  margin-top: 0;
}

.team-avatar {
  max-height: 2rem;
  vertical-align: sub;
}

.space-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
}
</style>
