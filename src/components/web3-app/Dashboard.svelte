<script>
  import Iterations from "./Iterations.svelte";
  import { Column, Grid, Pagination, Row, SkeletonPlaceholder, SkeletonText, Tile, ToastNotification } from "carbon-components-svelte";
  import Chart from "./Chart.svelte";
  import { connected, chainId as chainIdWeb3 } from 'svelte-web3'

  export let amountOfIterations
  export let transactionExplorer
  export let contractAddress
  export let amountOfPrices
  export let chainId

  // requested data
  let iterations = []
  let graphData = []

  // pagitaion
  let page = 1
  let pageSize = amountOfIterations

  // last input for graph and iterations
  let counter = 0
  let graphCounter = 0

  // dashboard
  let successfulIterations
  let amountIterationsValue
  let tradedIterationsValue
  let calculatedFees

  // meta information
  let primaryName = ""
  let secondaryName = ""

  // wallet info
  let depositedBalance = 0
  let depositedCurrency = "ETH"
  let roi = 5

  /**
   * fetch and restructure graph data
   *
   * @return {Promise<void>}
   */
  async function fetchGraphData() {
    graphData = []
    if (contractAddress !== "") {
      // get max amount of iterations
      graphCounter = await (await fetch(`/${ contractAddress }/priceCount`)).json()
      primaryName = String(JSON.parse(await (await fetch(`/${ contractAddress }/primaryName`)).text())).replaceAll('"', '')
      secondaryName = String(JSON.parse(await (await fetch(`/${ contractAddress }/secondaryName`)).text())).replaceAll('"', '')

      try {
        const response = await (await fetch(`/${ contractAddress }/priceRange?earliestID=${ graphCounter }&lastID=${ (counter - amountOfPrices) < 0 ? 0 : (counter - amountOfPrices) }`)).json()
        graphData = response.map((data) => {
          data = JSON.parse(data)
          return [
            {
              "group": primaryName,
              "date": data.date,
              "primary": Number(data.primary) / (10 ** 18)
            },
            {
              "group": secondaryName,
              "date": data.date,
              "secondary": Number(data.secondary) / (10 ** 18)
            }
          ]
        }).flatMap(value => value)
      } catch {
        graphData = []
      }
    }
  }

  /**
   * fetch iteration data
   *
   * @return {Promise<void>}
   */
  async function fetchIteration() {
    if (contractAddress !== "") {
      iterations = []
      successfulIterations = 0
      amountIterationsValue = 0
      tradedIterationsValue = 0
      calculatedFees = 0

      // get max amount of iterations
      const countResponse = await fetch(`/${ contractAddress }/count`)
      counter = await countResponse.json()

      let lastID = counter - (pageSize * page) + 1

      // get past iterations
      try {
        iterations = await (await fetch(`/${ contractAddress }/iterationRange?earliestID=${ Number(counter - (pageSize * page)) + Number(pageSize) }&lastID=${ lastID < 0 ? 0 : lastID }`)).json()
      } catch {
        iterations = []
      }
      refreshDashboardStats()
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

  /**
   * refresh all components with new data
   */
  function refreshDashboardStats() {
    successfulIterations = amountSuccessfulIterations()
    amountIterationsValue = amountIterations()
    tradedIterationsValue = tradedIterations()
    calculatedFees = calculateFees().toFixed(8)
  }

  $:{
    fetchIteration()
    contractAddress = contractAddress
    page = page
    pageSize = pageSize
  }
  $: {
    contractAddress = contractAddress
    fetchGraphData()
    page = 1
  }
</script>
<h2></h2>
{#if contractAddress !== ""}
  <main id="dashboard">
    <h2 style="margin-top: -68px;">Chart</h2>
    {#if graphData.length <= 0}
      <SkeletonPlaceholder style="height: 350px; width: 100%;"/>
    {:else }
      <Chart bind:graphData="{graphData}" bind:primaryName={primaryName} bind:secondaryName={secondaryName}/>
    {/if}
    <h2 style="margin: 48px 0 16px 0;">Personal Dashboard</h2>
    <div>
      <Grid narrow class="titleGrid">
        <Row padding="30px">
          {#if $connected && parseInt($chainIdWeb3, 16) === chainId}
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
          {:else}
            <Column>
              <Tile>Information can be accessed with a Connected Wallet</Tile>
            </Column>
          {/if}
        </Row>
      </Grid>
    </div>

    <h2 style="margin: 48px 0 16px 0;">Dashboard</h2>
    <Grid narrow class="titleGrid">
      <Row padding="30px">
        <Column>
          <Tile>
            {#if successfulIterations && amountIterationsValue}
              {successfulIterations} / {amountIterationsValue} Successful Iterations
            {:else}
              <SkeletonText/>
            {/if}
          </Tile>
        </Column>
        <Column>
          <Tile>
            {#if tradedIterationsValue}
              {tradedIterationsValue} Swap Operations
            {:else}
              <SkeletonText/>
            {/if}
          </Tile>
        </Column>
        <Column>
          <Tile>
            {#if calculatedFees && amountIterationsValue}
              {calculatedFees} Eth Fees in the Past {amountIterationsValue} Transactions
            {:else}
              <SkeletonText/>
            {/if}
          </Tile>
        </Column>
      </Row>
    </Grid>
    <Pagination bind:page="{page}" totalItems={counter} pageSizes={[10, amountOfIterations, 50]} bind:pageSize={pageSize}/>
    {#if iterations.length <= 0}
      <SkeletonPlaceholder style="height: 1400px; width: 100%;"/>
    {:else }
      <Iterations iterations={iterations} counter={counter} upperLimit="{counter - (pageSize * page) + pageSize}"
                  transactionExplorer={transactionExplorer}/>
    {/if}
  </main>
{/if}

<style>
    .userAccount {
        padding-top: 8px;
    }
</style>
