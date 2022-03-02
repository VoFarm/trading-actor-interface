<script>
  import Header from "../components/app/Header.svelte";
  import Dashboard from "../components/app/Dashboard.svelte";
  import Deposit from "../components/app/Deposit.svelte";
  import Withdraw from "../components/app/Withdraw.svelte"
  import { Route, Router } from "svelte-navigator";
  import { Content } from "carbon-components-svelte";
  import { selectedServerSideContract } from "../stores/contract.ts";

  let url = "app"
</script>

<Header/>

<Content>
  <Router url="{url}">
    <div>
      <Route path="/">
        {#if $selectedServerSideContract}
          <Dashboard/>
        {/if}
      </Route>
      <Route path="deposit">
        <Deposit/>
      </Route>
      <Route path="withdraw">
        <Withdraw/>
      </Route>
    </div>
  </Router>
</Content>
