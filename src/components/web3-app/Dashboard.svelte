<script>
  import Iterations from "./Iterations.svelte";
  import { Column, Grid, Row, SkeletonPlaceholder, Tile } from "carbon-components-svelte";
  import Chart from "./Chart.svelte";
  import { connected, chainId as chainIdWeb3 } from 'svelte-web3'

  export let amountOfIterations
  export let transactionExplorer
  export let contractAddress
  export let amountOfPrices
  export let chainId
  let iterations = []
  let graphData = []
  let counter = 0
  let graphCounter = 0
  let successfulIterations = 0
  let amountIterationsValue = 0
  let tradedIterationsValue = 0
  let calculatedFees = 0
  let secondaryName = ""
  let depositedBalance = 0
  let depositedCurrency = "ETH"
  let roi = 5

  function fetchGraphData() {
    if (contractAddress !== "") {
      graphData = []
      // get max amount of iterations
      fetch(`/${ contractAddress }/priceCount`).then(async (countResponse) => {
        graphCounter = await countResponse.json()

        let primaryName = String(JSON.parse(await (await fetch(`/${ contractAddress }/primaryName`)).text())).replaceAll('"', '')
        secondaryName = String(JSON.parse(await (await fetch(`/${ contractAddress }/secondaryName`)).text())).replaceAll('"', '')

        // get past iterations
        for (let i = graphCounter; i >= ((graphCounter - amountOfPrices) < 0 ? 0 : (graphCounter - amountOfPrices)); i--) {
          const response = await fetch(`/${ contractAddress }/price?id=${ i }`)
          let price = JSON.parse(await response.json())

          graphData.push({
            "group": primaryName,
            "date": price.date,
            "primary": Number(price.primary) / (10 ** 18)
          })
          graphData.push({
            "group": secondaryName,
            "date": price.date,
            "secondary": Number(price.secondary) / (10 ** 18)
          })
        }
        // assign to create iterations component
        graphData = graphData
      })
    }
  }

  function fetchData() {
    if (contractAddress !== "") {
      iterations = []
      counter = 0
      successfulIterations = 0
      amountIterationsValue = 0
      tradedIterationsValue = 0
      calculatedFees = 0
      // get max amount of iterations
      fetch(`/${ contractAddress }/count`).then(async (countResponse) => {
        counter = await countResponse.json()

        // get past iterations
        for (let i = counter; i >= ((counter - amountOfIterations) < 0 ? 0 : (counter - amountOfIterations)); i--) {
          const response = await fetch(`/${ contractAddress }/iteration?id=${ i }`)
          iterations.push(await response.json())
        }
        // assign to create iterations component
        iterations = iterations
        refreshDashboardStats()
      })
    }
  }

  /**
   * returns amount of successful iterations
   *
   * @return {number}
   */
  function amountSuccessfulIterations() {
    return iterations.filter((iteration) => iteration.success && !iteration.inProgress).length
  }

  /**
   * returns amount of fetched iterations
   *
   * @return {number}
   */
  function amountIterations() {
    return iterations.length
  }

  /**
   * return amount of traded iterations
   *
   * @return {number}
   */
  function tradedIterations() {
    return iterations.filter((iteration) => iteration.traded === "buy" || iteration.traded === "sell").length
  }

  /**
   * estimate amount of fees spent for previous iterations
   *
   * @return {number}
   */
  function calculateFees() {
    return iterations.reduce((prev, iteration) => prev + iteration.tx.reduce((prev, current) => current.gasLimit * current.gasPrice + prev, 0), 0) / (10 ** 18)
  }

  function drawDashboard() {
    return iterations.length > 0 && contractAddress !== ""
  }

  function refreshDashboardStats() {
    successfulIterations = amountSuccessfulIterations()
    amountIterationsValue = amountIterations()
    tradedIterationsValue = tradedIterations()
    calculatedFees = calculateFees().toFixed(8)
  }

  $:{
    fetchData()
    fetchGraphData()
    contractAddress = contractAddress
  }
</script>

{#if contractAddress !== ""}
  <main id="dashboard">
    <h2 style="margin-top: -52px;">Chart</h2>
    {#if graphData.length <= 0}
      <SkeletonPlaceholder style="height: 400px; width: 100%;"/>
    {:else }
      <Chart bind:graphData="{graphData}" bind:secondaryName={secondaryName}/>
    {/if}
    <h2 style="margin-top: 48px;">Dashboard</h2>
    <Grid narrow class="titleGrid">
      {#if $connected && parseInt($chainIdWeb3, 16) === chainId}
        <Row padding="30px">
          <Column>
            <Tile>
              Deposited Balance
              <div class="userAccount">{depositedBalance} {depositedCurrency}</div>
            </Tile>
          </Column>
          <Column>
            <Tile>
              Return On Investment
              <div class="userAccount" style="color: {roi > 0 ? 'green' : roi < 0 ? 'red' : 'unset'}">{roi}%</div>
            </Tile>
          </Column>
        </Row>
      {/if}
      <Row padding="30px">
        <Column>
          <Tile>
            {successfulIterations} / {amountIterationsValue} Successful Iterations
          </Tile>
        </Column>
        <Column>
          <Tile>
            {tradedIterationsValue} Swap Operations
          </Tile>
        </Column>
        <Column>
          <Tile>
            {calculatedFees} Eth Fees in the Past {amountIterationsValue} Transactions
          </Tile>
        </Column>
      </Row>
    </Grid>
    {#if iterations.length <= 0}
      <SkeletonPlaceholder style="height: 400px; width: 100%;"/>
    {:else }
      <Iterations iterations={iterations} counter={counter} transactionExplorer={transactionExplorer}/>
    {/if}
  </main>
{/if}

<style>
    .userAccount {
        padding-top: 8px;
    }
</style>