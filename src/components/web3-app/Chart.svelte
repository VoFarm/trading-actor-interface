<script>
  import { onMount } from "svelte";
  import "@carbon/charts/styles.min.css";

  export let graphData
  let chart

  onMount(async () => {
    const charts = await import("@carbon/charts-svelte");
    chart = charts.LineChart;
  });

</script>

<svelte:component
    this={chart}
    data={graphData}
    options={{
    title: "",
    height: "400px",
    axes: {
		"left": {
			"mapsTo": "value",
			"title": "Amount of Token",
			"scaleType": "linear",
			"min": 0
		},
		"bottom": {
			"title": "Time",
			"mapsTo": "date",
			"scaleType": "time"
		},
    },
  }}
/>