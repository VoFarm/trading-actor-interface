<script>
  import {
    Accordion,
    AccordionItem,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Tag,
    Link
  } from "carbon-components-svelte";

  export let iterations
  export let counter
  export let transactionExplorer
  export let upperLimit

  /**
   * return color for status tag
   *
   * @param iteration
   * @return {string}
   */
  function decideColorForProgress(iteration) {
    if (iteration.success && !iteration.inProgress) {
      return "green"
    } else if (iteration.inProgress) {
      return "warm-gray"
    }
    return "red"
  }

  /**
   * translate color for progress to text
   *
   * @param color
   * @return {string}
   */
  function translateColorToTex(color) {
    switch (color) {
      case "green":
        return "Success";
      case "warm-gray":
        return "In Progress";
      case "red":
        return "Failed"
      default:
        return "Unknown Status"
    }
  }

  /**
   * returns color for trade swap
   *
   * @param iteration
   * @return {string}
   */
  function decideColorForTrade(iteration) {
    if (iteration.traded !== "hold") return "blue"
    return "gray"
  }

  /**
   * return color for performance
   *
   * @param iteration
   * @return {string}
   */
  function decideColorForPerformance(iteration) {
    if (Number(iteration.seconds) > 30) return "red"
    return "green"
  }

  /**
   * format date to show date and time
   *
   * @param iteration
   * @return {string}
   */
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toDateString() + " " + date.toTimeString()
  }
</script>

{#if iterations}
  <Accordion align="start">
    {#each iterations as iteration}
      <AccordionItem style="margin: 0 auto; text-align-last: center">
        <svelte:fragment slot="title">
          <h5 class="fragment">Iteration {upperLimit - iterations.indexOf(iteration) + 1}</h5>
          <div class="fragment">
            <Tag type={decideColorForProgress(iteration)}>
              {translateColorToTex(decideColorForProgress(iteration))}
            </Tag>

            {#if !iterations.inProgress && iteration.success}
              <Tag type={decideColorForTrade(iteration)}>
                {iteration.traded}
              </Tag>
              <Tag type={decideColorForPerformance(iteration)}>
                {iteration.seconds} s
              </Tag>
            {/if}
          </div>
          <div class="fragment">
            {formatDate(iteration.startDate)}
          </div>
        </svelte:fragment>
        <div class="contentWrapper">
          {#if iteration.tx.length}
            <h3 style="margin: 12px 0">Transactions</h3>
            <StructuredList>
              <StructuredListRow head>
                <StructuredListCell head>Transaction ID</StructuredListCell>
                <StructuredListCell head>Type</StructuredListCell>
                <StructuredListCell head>Gas Price</StructuredListCell>
                <StructuredListCell head>Gas Limit</StructuredListCell>
                <StructuredListCell head>Estimated Cost</StructuredListCell>
              </StructuredListRow>

              <StructuredListBody>
                {#each iteration.tx as transaction}
                  <StructuredListRow>
                    <StructuredListCell>
                      <Link href="{transactionExplorer}tx/{transaction.tx}" target="_blank">{transaction.tx}</Link>
                    </StructuredListCell>
                    <StructuredListCell>{transaction.descriptor}</StructuredListCell>
                    <StructuredListCell>{transaction.gasPrice}</StructuredListCell>
                    <StructuredListCell>{transaction.gasLimit}</StructuredListCell>
                    <StructuredListCell>{((transaction.gasLimit * transaction.gasPrice) / (10 ** 18)).toFixed(6)} Eth</StructuredListCell>
                  </StructuredListRow>
                {/each}
              </StructuredListBody>
            </StructuredList>
          {/if}

          <h3 style="margin: 12px 0">Logs</h3>
          <StructuredList>
            <StructuredListBody>
              {#each iteration.messages as message}
                <StructuredListRow>
                  <StructuredListCell>{formatDate(message.date)} | {JSON.stringify(message.message)}</StructuredListCell>
                </StructuredListRow>
              {/each}
            </StructuredListBody>
          </StructuredList>
        </div>
      </AccordionItem>
    {/each}
  </Accordion>
{/if}

<style>
    .fragment {
        margin: 8px auto;
    }

    .contentWrapper {
        margin: 0 auto;
    }
</style>