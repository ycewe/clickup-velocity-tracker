<template>
  <h1 class="title">
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

<style lang="scss" scoped>
.title {
  -webkit-text-stroke: 2px #cccccc40;
  color: var(--var-primary-color);
  font-size: 5rem;
  letter-spacing: 1rem;
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  text-align: center;
  text-shadow: var(--var-title-shadow);
  text-transform: uppercase;
}

.team-avatar {
  border-radius: 2rem;
  max-height: 2.5rem;
  vertical-align: sub;
}

.space-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  grid-gap: 2rem;
}
</style>
