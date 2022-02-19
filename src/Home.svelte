<script>
  import "carbon-components-svelte/css/white.css";
  import { Router, Route } from "svelte-navigator";
  import Root from "./pages/Root.svelte";
  import Web3App from "./pages/Web3App.svelte";
  import Header from "./components/root/Header.svelte";

  export let amountOfIterations
  export let transactionExplorer
  export let amountOfPrices
  export let chainId
  export let url = "";
</script>

<Router url="{url}">
  <div>
    <Route path="/">
      <header>
        <Header/>
      </header>
      <Root/>
    </Route>
    <Route path="app/*">
      <Web3App chainId="{chainId}" amountOfIterations="{amountOfIterations}" transactionExplorer="{transactionExplorer}" amountOfPrices="{amountOfPrices}"/>
    </Route>
  </div>
</Router>

<style>

    header {
        width: 60%;
        margin: 0 auto;
        margin-top: 36px;
        text-align: right;
    }

    :global(.bx--accordion__item--active .bx--accordion__content) {
        padding: 0 !important;
        margin: 0 !important;
    }

    :global(.bx--structured-list) {
        margin: 0 !important;
    }
</style>
