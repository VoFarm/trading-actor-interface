<script>
  import Header from "../components/web3-app/Header.svelte";
  import Dashboard from "../components/web3-app/Dashboard.svelte";
  import Deposit from "../components/web3-app/Deposit.svelte";
  import { Route, Router } from "svelte-navigator";
  import { Content } from "carbon-components-svelte";

  export let amountOfIterations
  export let transactionExplorer
  export let amountOfPrices

  let contractAddress = ""
  let url = "app"
</script>

<Header bind:contractAddress={contractAddress}/>

<Content>
  <Router url="{url}">
    <div>
      <Route path="/">
        {#if contractAddress !== ""}
          <Dashboard bind:contractAddress={contractAddress} amountOfIterations={amountOfIterations}
                     transactionExplorer={transactionExplorer} amountOfPrices="{amountOfPrices}"/>
        {/if}
      </Route>
      <Route path="deposit">
        <Deposit bind:contractAddress={contractAddress}/>
      </Route>
    </div>
  </Router>
</Content>