<script>
  import "carbon-components-svelte/css/white.css";
  import { Router, Route } from "svelte-navigator";
  import Root from "./pages/Root.svelte";
  import Web3App from "./pages/App.svelte";
  import Header from "./components/root/Header.svelte";
  import { pageSize } from "./stores/iterations";
  import { amountOfPrices as amountOfPricesWritable } from "./stores/prices";

  export let amountOfIterations
  export let amountOfPrices

  pageSize.set(amountOfIterations)
  amountOfPricesWritable.set(amountOfPrices)

  let url = "";
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
      <Web3App/>
    </Route>
  </div>
</Router>

<style>
    header {
        width: 65%;
        margin: 36px auto 0;
        text-align: right;
    }

    :global(.bx--select-input) {
        margin: 0 !important;
    }

    :global(.bx--accordion__item--active .bx--accordion__content) {
        padding: 0 !important;
        margin: 0 !important;
    }

    :global(.bx--structured-list) {
        margin: 0 !important;
    }

    :global(.bx--dropdown__wrapper) {
        width: 100% !important;
    }
</style>
