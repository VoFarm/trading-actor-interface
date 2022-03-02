<script>
  import { Button } from "carbon-components-svelte";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();

  function startApp() {
    navigate("/app")
  }
</script>

<Button style="margin: 12px 0" on:click="{startApp}">
  <h5>Start App</h5>
</Button>
