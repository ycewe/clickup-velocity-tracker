<template>
  <p>Average: {{ average }}</p>
  <div :class="`chart-${name}`"></div>
</template>

<script>
import { defineComponent, reactive, toRefs, computed, onMounted } from "vue";
import * as d3 from "d3";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/en-sg";

dayjs.locale("en-sg");
dayjs.extend(isBetween);

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    tasks: {
      type: Object,
      required: true,
    },
  },

  setup: ({ name, tasks }) => {
    const state = reactive({
      sprints: computed(() => {
        const now = dayjs();
        const firstSprintStart = dayjs(new Date(2020, 11, 1)); // 1st December 2020 SGT

        let sprints = [];
        let count = 0;
        let start = firstSprintStart;

        do {
          let end = start.add("14", "day");

          count++;

          sprints.push({
            sprint: count,
            start: start.format("DD/MMM/YY"),
            end: end.subtract("1", "day").format("DD/MMM/YY"),
            points: tasks
              .filter(
                (task) =>
                  // get only tasks that have been closed
                  task.date_closed &&
                  dayjs(parseInt(task.date_closed)).isBetween(
                    start,
                    end.subtract("1", "day"),
                    "second",
                    "[]"
                  )
              )
              .map((task) => {
                // newer stories may have custom field
                const customFieldPoints = task.custom_fields.find(
                  (field) => (field?.name ?? "").toLowerCase() === "Points"
                );

                // parse points for each task
                // clickup for teams may limit the number of assigned points to 100
                if (task.points) {
                  return task.points;
                } else if (customFieldPoints) {
                  return customFieldPoints.value ?? 0;
                } else {
                  // assumption: story title is appended with the story points
                  // separated by a dash or "-" should the
                  // clickup points limit exceed team pricing
                  const taskNameArr = task.name.split("-");
                  const points = parseInt(
                    taskNameArr[taskNameArr.length - 1].trim()
                  );

                  return points ?? 0;
                }
              })
              .reduce((accumulator, points) => accumulator + points, 0),
          });

          start = end;
        } while (start.isBefore(now));

        return sprints.filter((sprint) => sprint.points);
      }),

      average: computed(() => {
        const aggregate = state.sprints.reduce(
          (accumulator, sprint) => accumulator + sprint.points,
          0
        );

        return aggregate / state.sprints.length || 0;
      }),
    });

    onMounted(() => {
      // draw bar chart
      const width = 500;
      const height = state.sprints.length * 25;
      const transition = d3.transition().duration(1000);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(state.sprints, (d) => d.points)])
        .range([0, width * 0.55]);

      const y = d3
        .scaleBand()
        .domain(state.sprints.map((d) => d.sprint))
        .range([0, height])
        .padding(0.2);

      const svg = d3
        .select(`.chart-${name}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const bars = svg
        .selectAll("rect")
        .data(state.sprints)
        .join("g")
        .attr("transform", (d) => `translate(0, ${y(d.sprint)})`);

      bars
        .append("rect")
        .attr("height", y.bandwidth())
        .attr("fill", "#008B8B")
        .transition(transition)
        .attr("width", (d) => x(d.points));

      const text = bars
        .append("g")
        .attr("transform", `translate(0, ${y.bandwidth()})`);

      // sprint count
      text
        .append("text")
        .text((d) => d.sprint)
        .attr("x", 25)
        .attr("dy", "-0.2em")
        .attr("fill", "white")
        .attr("font-size", 16)
        .attr("text-anchor", "end")
        .transition(transition)
        .attr("opacity", 1);

      // points
      text
        .append("text")
        .text((d) => d.points)
        .attr("x", (d) => x(d.points) + 15)
        .attr("font-size", 16)
        .attr("dy", "-0.2em")
        .transition(transition)
        .attr("opacity", 1);

      // start date and end date
      text
        .append("text")
        .text((d) => `(${d.start} - ${d.end})`)
        .attr("x", (d) => x(d.points) + 40)
        .attr("fill", "#008B8B")
        .attr("font-size", 16)
        .attr("dy", "-0.2em")
        .transition(transition)
        .attr("opacity", 1);
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>
