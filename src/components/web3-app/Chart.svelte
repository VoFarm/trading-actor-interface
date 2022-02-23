<script>
  import { onMount } from "svelte";
  import "@carbon/charts/styles.min.css";

  export let graphData
  export let primaryName
  export let secondaryName
  let chart

  onMount(async () => {
    const charts = await import("@carbon/charts-svelte");
    chart = charts.LineChart;
  });

  const formatYAxes = (value) => {
    const formatted = Number(value).toFixed(8)
    const splitted = formatted.split(".")
    if (splitted[1] === "00000000") {
      return splitted[0]
    }
    return formatted
  }

</script>

<svelte:component
    this={chart}
    data={graphData}
    options={{
    title: "",
    height: "350px",
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
			"title": primaryName,
			"scaleType": "linear",
			"ticks": {"formatter": (value) => formatYAxes(value)},
      "correspondingDatasets": [
				primaryName
			],
			},
    "right": {
			"mapsTo": "secondary",
			"title": secondaryName,
			"scaleType": "linear",
      "correspondingDatasets": [
				secondaryName
			],
			"ticks": {"formatter": (value) => formatYAxes(value)},
		},
		"bottom": {
			"title": "Time",
			"mapsTo": "date",
			"scaleType": "time"
		},
    },
  }}
/>