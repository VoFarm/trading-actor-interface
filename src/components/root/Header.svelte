<script>
  import { Button } from "carbon-components-svelte";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();

  function startApp() {
    navigate("/app")
  }
</script>

<Button on:click="{startApp}">
  <h5>Start App</h5>
</Button>
