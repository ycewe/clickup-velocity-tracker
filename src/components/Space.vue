<template>
  <section class="container">
    <h2>
      {{ space.name }}
    </h2>
    <Velocity v-if="tasks.length > 0" :name="space.name" :tasks="tasks" />
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import API from "@/services/api";
import Velocity from "./Velocity.vue";

export default defineComponent({
  components: { Velocity },
  props: {
    space: {
      type: Object,
      required: true,
    },
  },

  setup: ({ space }) => {
    const state = reactive({
      folders: [],
      lists: [],
      tasks: [],
    });

    onMounted(async () => {
      const folders = await API.folders(space.id);
      state.folders = folders.flat();

      const lists = await Promise.all(
        state.folders.map(async (folder) => await API.lists(folder.id))
      );
      state.lists = lists.flat();

      const tasks = await Promise.all(
        state.lists.map(async (list) => await API.tasks(list.id))
      );
      state.tasks = tasks.flat();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.container {
  margin-bottom: 2rem;
}
</style>
