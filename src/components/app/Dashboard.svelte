<script>
  import Iterations from "./Iterations.svelte";
  import { Column, Grid, Pagination, Row, SkeletonPlaceholder, SkeletonText, Tile } from "carbon-components-svelte";
  import Chart from "./Chart.svelte";
  import { connected, selectedAccount, chainId, web3 } from 'svelte-web3'
  import { selectedServerSideContract } from "../../stores/contract";
  import { accountDashboardData, getAccountDashboardData, validChain, validConnection } from "../../stores/wallet";
  import { fetchIteration, iterationData, page, pageSize } from "../../stores/iterations";
  import { amountOfPrices, fetchGraphData, graphData } from "../../stores/prices";
  import { onMount } from "svelte";

  // pagitaion
  page.set(1)

  // dashboard
  let successfulIterations
  let amountIterationsValue
  let tradedIterationsValue
  let calculatedFees

  /**
   * returns amount of successful iterations
   *
   * @return {number}
   */
  function amountSuccessfulIterations(iterations) {
    return iterations.filter((iteration) => iteration.success && !iteration.inProgress).length
  }

  /**
   * returns amount of fetched iterations
   *
   * @return {number}
   */
  function amountIterations(iterations) {
    return iterations.length
  }

  /**
   * return amount of traded iterations
   *
   * @return {number}
   */
  function tradedIterations(iterations) {
    return iterations.filter((iteration) => iteration.traded === "buy" || iteration.traded === "sell").length
  }

  /**
   * estimate amount of fees spent for previous iterations
   *
   * @return {number}
   */
  function calculateFees(iterations) {
    return iterations.reduce((prev, iteration) => prev + iteration.tx.reduce((prev, current) => current.gasLimit * current.gasPrice + prev, 0), 0) / (10 ** 18)
  }

  /**
   * refresh all components with new data
   */
  function refreshDashboardStats(iterations) {
    successfulIterations = amountSuccessfulIterations(iterations)
    amountIterationsValue = amountIterations(iterations)
    tradedIterationsValue = tradedIterations(iterations)
    calculatedFees = calculateFees(iterations).toFixed(8)
  }

  onMount(async () => {
    selectedServerSideContract.subscribe(async (contract) => {
      await fetchIteration(contract, $pageSize, $page)
      await fetchGraphData(contract, $amountOfPrices)
    })

    iterationData.subscribe((iterationDataArray) => {
      if (iterationDataArray) {
        refreshDashboardStats(iterationDataArray)
      }
    })
  });


</script>
<h2></h2>
{#if $selectedServerSideContract}
  <main id="dashboard">
    <h2 style="margin-top: -68px;">Chart</h2>
    {#if $graphData}
      <Chart graphData={$graphData}
             primaryName={$selectedServerSideContract.primaryTokenName}
             secondaryName={$selectedServerSideContract.secondaryTokenName}/>
    {:else}
      <SkeletonPlaceholder style="height: 350px; width: 100%;"/>
    {/if}

    <h2 style="margin: 48px 0 16px 0;">Personal Dashboard</h2>
    <div>
      <Grid narrow class="titleGrid">
        <Row padding="30px">
          {#if validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
            {#await getAccountDashboardData($selectedAccount, $selectedServerSideContract.address, $web3)}
            {:then _}
              {#each $accountDashboardData as investment}
                <Column>
                  <Tile>
                    Deposited Balance
                    <div class="userAccount">{(investment.currentBalance * (10 ** (-18))).toFixed(18)} {investment.depositedCurrency}</div>
                  </Tile>
                </Column>
              {/each}
            {:catch error}
            {/await}
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
    <Pagination on:update={fetchIteration($selectedServerSideContract, $pageSize, $page)}
                bind:page="{$page}" totalItems={$selectedServerSideContract.iterationCounter}
                pageSizes={[10, 25, 50]}
                bind:pageSize={$pageSize}/>

    {#if $iterationData}
      <Iterations iterations={$iterationData} counter={$selectedServerSideContract.iterationCounter}
                  upperLimit="{$selectedServerSideContract.iterationCounter - ($pageSize * $page) + $pageSize}"
                  transactionExplorer={$selectedServerSideContract.explorer}/>
    {:else}
      <SkeletonPlaceholder style="height: 3500px; width: 100%;"/>
    {/if}
  </main>
{/if}

<style>
    .userAccount {
        padding-top: 8px;
    }
</style>
