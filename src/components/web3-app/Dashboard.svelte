<script>
  import Iterations from "./Iterations.svelte";
  import { Column, Grid, Row, Tile } from "carbon-components-svelte";

  export let amountOfIterations
  export let transactionExplorer
  export let contractAddress
  let iterations = []
  let counter = 0
  let successfulIterations = 0
  let amountIterationsValue = 0
  let tradedIterationsValue = 0
  let calculatedFees = 0

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
    return iterations.filter((iteration) => iteration.traded !== "hold").length
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
    contractAddress = contractAddress
  }
</script>

{#if contractAddress !== ""}
  <h2 style="padding: 25px">Dashboard</h2>
  <Grid narrow class="titleGrid">
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

  <Iterations iterations={iterations} counter={counter} transactionExplorer={transactionExplorer}/>
{/if}
