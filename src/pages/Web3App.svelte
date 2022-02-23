<script>
  import Header from "../components/web3-app/Header.svelte";
  import Dashboard from "../components/web3-app/Dashboard.svelte";
  import Deposit from "../components/web3-app/Deposit.svelte";
  import { Route, Router } from "svelte-navigator";
  import { Content } from "carbon-components-svelte";

  export let amountOfIterations
  export let transactionExplorer
  export let amountOfPrices
  export let chainId

  let url = "app"

  /*
   * root file for selected contractAddress
   * changes can be made by the header
   */
  let contractAddress = ""

  $: {
    contractAddress = contractAddress
  }
</script>

<Header bind:contractAddress={contractAddress} chainId="{chainId}"/>

<Content>
  <Router url="{url}">
    <div>
      <Route path="/">
        {#if contractAddress !== ""}
          <Dashboard chainId="{chainId}" bind:contractAddress={contractAddress} amountOfIterations={amountOfIterations}
                     transactionExplorer={transactionExplorer} amountOfPrices="{amountOfPrices}"/>
        {/if}
      </Route>
      <Route path="deposit">
        <Deposit bind:contractAddress={contractAddress} chainId="{chainId}"/>
      </Route>
    </div>
  </Router>
</Content>
