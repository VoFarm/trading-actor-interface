<script>
  import { onMount } from "svelte";
  import "@carbon/charts/styles.min.css";

  export let graphData
  export let secondaryName
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
    tooltip: {
      "valueFormatter": (value, type) => {
        if (type === "Time") {
          return value.toTimeString()
        }
        return Number(value).toFixed(18)
        },
      "showTotal": false
    },
    axes: {
		"left": {
			"mapsTo": "primary",
			"title": "Amount of Token",
			"scaleType": "linear",
			"ticks": {"min": 0}
		},
    "right": {
			"mapsTo": "secondary",
			"title": "Amount of Token",
			"scaleType": "linear",
			"ticks": {"min": 0},
      "correspondingDatasets": [
				secondaryName
			]
		},
		"bottom": {
			"title": "Time",
			"mapsTo": "date",
			"scaleType": "time"
		},
    },
  }}
/>