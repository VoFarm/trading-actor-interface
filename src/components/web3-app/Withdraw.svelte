<script>
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    Select,
    SelectItem,
    SkeletonText,
    TextInput,
    ToastNotification
  } from "carbon-components-svelte";
  import { chainId as chainIdWeb3, connected, web3 } from "svelte-web3";
  import { TradingContractABI } from "./abi/trading.ts";
  import Renew16 from "carbon-icons-svelte/lib/Renew16";

  export let contractAddress
  export let chainId
  export let transactionExplorer

  let tokens = [
    { name: "WETH", address: "0xc778417E063141139Fce010982780140Aa0cD5Ab" },
    { name: "WBTC", address: "0x577d296678535e4903d59a4c929b718e1d575e0a" }
  ]

  let transactions = []

  // withdraw
  let completeWithdraw = false
  let selectedTokenWithdraw = tokens[0].address
  let amountWithdraw = 0
  let sentWithdraw = false
  let availableFunds

  let disabledInput = true

  async function getDepositableTokens(contractAddress) {
    try {
      const contract = new $web3.eth.Contract(TradingContractABI, contractAddress, {})
      //tokens = (await contract.methods.name().call()).split("/")
    } catch {
      disabledInput = true
    }
  }

  function withdrawAmount() {
    transactions.push({
      title: "Failed",
      kind: "error",
      subtitle: "Transaction Failed for Withdraw",
      caption: ""
    })
    transactions = transactions
  }

  async function getBalance() {
    availableFunds = undefined
    try {
      const tokenContract = new $web3.eth.Contract(TradingContractABI, contractAddress, {});
      availableFunds = await tokenContract.methods.getBalance(selectedTokenWithdraw).call();
    } catch {
      availableFunds = 0
      transactions.push({
        title: "Failed",
        kind: "error",
        subtitle: "Couldn't Fetch Balance",
        caption: ""
      })
      transactions = transactions
    }
  }

  $: {
    selectedTokenWithdraw = selectedTokenWithdraw
    if ($connected && parseInt($chainIdWeb3, 16) === chainId) {
      getDepositableTokens(contractAddress)
      getBalance()
      disabledInput = false
    } else {
      disabledInput = true
      //tokens = []
    }
  }
</script>

<div id="deposit">
  <div class="form">
    <Form on:submit={withdrawAmount}>
      <FormGroup>
        <Select disabled={disabledInput} id="select-1" labelText="Token To Withdraw" bind:selected="{selectedTokenWithdraw}">
          {#each tokens as token}
            <SelectItem value="{token.address}" text="{token.name}"/>
          {/each}
        </Select>
      </FormGroup>

      <FormGroup>
        <TextInput bind:value={amountWithdraw} disabled={disabledInput} inline labelText="Amount" placeholder="0.2"/>
      </FormGroup>

      {#if availableFunds >= 0 && $connected && parseInt($chainIdWeb3, 16) === chainId}
        <div class="balance">
          <Button on:click={getBalance} kind="ghost" iconDescription="Reload" icon={Renew16}/>
          Balance: {amountWithdraw} {tokens.find((token) => token.address === selectedTokenWithdraw).name}
        </div>
      {:else if !availableFunds && $connected && parseInt($chainIdWeb3, 16) === chainId}
        <p class="balance">
          <SkeletonText/>
        </p>
      {/if}

      <div class="actionButtons">
        <div style="display: flex;flex-direction: row;">
          <Button disabled={disabledInput} type="submit">Withdraw</Button>
          {#if sentWithdraw}
            <InlineLoading style="margin-left: 15px;" description="Sending Transaction..."/>
          {/if}
        </div>
      </div>
    </Form>
  </div>
</div>

<footer>
  {#if disabledInput}
    <ToastNotification
        kind="info"
        title="Please Connect Your Wallet"
        subtitle="Deposits can be done with a Connected Wallet"
    />
  {/if}
  {#each transactions as transaction}
    <ToastNotification
        title="{transaction.title}"
        kind="{transaction.kind}"
        subtitle="{transaction.subtitle}"
    >
      <div style="margin-bottom: 15px">
        <strong>{@html transaction.caption}</strong>
      </div>
    </ToastNotification>
  {/each}
</footer>

<style>
    .form {
        box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.10);
        padding: 36px;
    }

    #deposit {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        align-items: stretch;
        margin: 0 auto;
    }

    .balance {
        display: flex;
        flex-direction: row-reverse;
        align-content: stretch;
        align-items: center;
        text-align: end;
        color: #00000099;
    }

    .actionButtons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 25px;
    }

    footer {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>