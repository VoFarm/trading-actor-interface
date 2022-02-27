<script>
  import {
    Button,
    Form,
    FormGroup, InlineLoading,
    ProgressIndicator,
    ProgressStep,
    Select,
    SelectItem, SkeletonText,
    TextInput,
    ToastNotification
  } from "carbon-components-svelte";
  import { web3, connected, chainId as chainIdWeb3, selectedAccount } from 'svelte-web3'
  import { TradingContractABI } from "./abi/trading.ts";
  import { ERC20ABI } from "./abi/erc20.ts";
  import Renew16 from "carbon-icons-svelte/lib/Renew16";

  export let contractAddress
  export let chainId
  export let transactionExplorer

  let index = 0
  let tokens = [
    { name: "WETH", address: "0xc778417E063141139Fce010982780140Aa0cD5Ab" },
    { name: "WBTC", address: "0x577d296678535e4903d59a4c929b718e1d575e0a" }
  ]

  let transactions = []

  // approval
  let completeApproval = false
  let selectedTokenApprove = tokens[0].address
  let amountApproval = 0
  let amountAllowance
  let sentApproval = false

  // deposit
  let completeDeposit = false
  let errorDeposit = 0
  let selectedTokenDeposit = tokens[1].address
  let amountDeposit = 0
  let sentDeposit = false

  let disabledInput = true

  async function getDepositableTokens(contractAddress) {
    try {
      const contract = new $web3.eth.Contract(TradingContractABI, contractAddress, {})
      //tokens = (await contract.methods.name().call()).split("/")
    } catch {
      disabledInput = true
    }
  }

  async function getAllowance() {
    amountAllowance = undefined
    const tokenContract = new $web3.eth.Contract(ERC20ABI, selectedTokenApprove, {});
    amountAllowance = $web3.utils.fromWei(await tokenContract.methods.allowance($selectedAccount, contractAddress).call(), 'ether');
  }

  async function approveAmount() {
    try {

      let sanitizedAmount = Number($web3.utils.toWei(amountApproval, 'ether')).toFixed(0)
      const tokenContract = new $web3.eth.Contract(ERC20ABI, selectedTokenApprove, {});
      const approve = tokenContract.methods.approve(contractAddress, sanitizedAmount).encodeABI();

      try {
        sentApproval = true
        let tx = (await $web3.eth.sendTransaction({
          gasLimit: await tokenContract.methods.approve(contractAddress, sanitizedAmount).estimateGas({ from: $selectedAccount }),
          from: $selectedAccount,
          to: selectedTokenApprove,
          value: 0,
          data: approve
        }))
        transactions.push({
          title: "Success",
          kind: "success",
          subtitle: "Transaction Dispatched for Approval",
          caption: `<a href="${ transactionExplorer }${ tx.transactionHash }" target="_blank">Transaction</a>`
        })
      } catch (e) {
        transactions.push({
          title: "Failed",
          kind: "error",
          subtitle: "Transaction Failed for Approval",
          caption: ""
        })
      }
    } catch {
      transactions.push({
        title: "Failed",
        kind: "error",
        subtitle: "Input for Transaction is Wrong",
        caption: ""
      })
    }
    transactions = transactions
    sentApproval = false
  }

  async function depositAmount() {
    try {
      let sanitizedAmount = Number($web3.utils.toWei(amountDeposit, 'ether')).toFixed(0)
      const tradingContract = new $web3.eth.Contract(ERC20ABI, TradingContractABI, {});
      await getAllowance()

      if (amountAllowance < sanitizedAmount) {
        transactions.push({
          title: "Failed",
          kind: "error",
          subtitle: "Amount to Deposit is Higher than Allowance",
          caption: "Please Adjust the Allowance"
        })
        transactions = transactions
        return
      }

      const deposit = tradingContract.methods.deposit(contractAddress, sanitizedAmount).encodeABI();

      try {
        sentDeposit = true
        let tx = (await $web3.eth.sendTransaction({
          gasLimit: await tradingContract.methods.deposit(contractAddress, sanitizedAmount).estimateGas({ from: $selectedAccount }),
          from: $selectedAccount,
          to: selectedTokenApprove,
          value: 0,
          data: deposit
        }))
        transactions.push({
          title: "Success",
          kind: "success",
          subtitle: "Transaction Dispatched for Deposit",
          caption: `<a href="${ transactionExplorer }${ tx.transactionHash }" target="_blank">Transaction</a>`
        })
        completeDeposit = true
      } catch (e) {
        console.log(e)
        transactions.push({
          title: "Failed",
          kind: "error",
          subtitle: "Transaction Failed for Deposit",
          caption: ""
        })
      }
    } catch (e) {
      transactions.push({
        title: "Failed",
        kind: "error",
        subtitle: "Input for Transaction is Wrong",
        caption: ""
      })
    }
    transactions = transactions
    sentDeposit = false
  }

  function skipApprove() {
    completeApproval = true
    index = 1
  }

  function toApprove() {
    completeApproval = false
    index = 0
  }

  $: {
    selectedTokenApprove = selectedTokenApprove
    if (selectedTokenApprove && $connected) {
      getAllowance()
    }
  }

  $: {
    selectedTokenDeposit = selectedTokenDeposit
    if (selectedTokenDeposit && $connected) {
      getAllowance()
    }
  }

  $: {
    if ($connected && parseInt($chainIdWeb3, 16) === chainId) {
      getDepositableTokens(contractAddress)
      disabledInput = false
    } else {
      disabledInput = true
      //tokens = []
    }
  }
</script>


<div id="deposit">
  {#if index === 0}
    <div class="form">
      <Form on:submit={approveAmount}>
        <FormGroup>
          <Select disabled={disabledInput} id="select-1" labelText="Token To Approve" bind:selected="{selectedTokenApprove}">
            {#each tokens as token}
              <SelectItem value="{token.address}" text="{token.name}"/>
            {/each}
          </Select>
        </FormGroup>

        <FormGroup>
          <TextInput bind:value={amountApproval} disabled={disabledInput} inline labelText="Amount" placeholder="0.2"/>
        </FormGroup>
        {#if amountAllowance && $connected && parseInt($chainIdWeb3, 16) === chainId}
          <div class="allowance">
            <Button on:click={getAllowance} kind="ghost" iconDescription="Reload" icon={Renew16}/>
            Allowance: {amountAllowance} {tokens.find((token) => token.address === selectedTokenApprove).name}
          </div>
        {:else if !amountAllowance && $connected && parseInt($chainIdWeb3, 16) === chainId}
          <p class="allowance">
            <SkeletonText/>
          </p>
        {/if}
        <div class="actionButtons">
          <div style="display: flex;flex-direction: row;">
            <Button disabled={disabledInput} type="submit">Approve</Button>
            {#if sentApproval}
              <InlineLoading style="margin-left: 15px;" description="Sending Transaction..."/>
            {/if}
          </div>
          <Button disabled={disabledInput} on:click={skipApprove} kind="ghost">Continue</Button>
        </div>
      </Form>
    </div>
  {/if}

  {#if index === 1}
    <div class="form">
      <Form on:submit={depositAmount}>
        <FormGroup>
          <Select disabled={disabledInput} id="select-1" labelText="Token To Deposit" bind:selected="{selectedTokenApprove}">
            {#each tokens as token}
              <SelectItem value="{token.address}" text="{token.name}"/>
            {/each}
          </Select>
        </FormGroup>

        <FormGroup>
          <TextInput bind:value={amountDeposit} disabled={disabledInput} inline labelText="Amount" placeholder="0.2"/>
        </FormGroup>
        {#if amountAllowance && $connected && parseInt($chainIdWeb3, 16) === chainId}
          <div class="allowance">
            <Button on:click={getAllowance} kind="ghost" iconDescription="Reload" icon={Renew16}/>
            Allowance: {amountAllowance} {tokens.find((token) => token.address === selectedTokenApprove).name}
          </div>
        {:else if !amountAllowance && $connected && parseInt($chainIdWeb3, 16) === chainId}
          <p class="allowance">
            <SkeletonText/>
          </p>
        {/if}
        <div class="actionButtons">
          <div style="display: flex;flex-direction: row;">
            <Button disabled={disabledInput} type="submit">Deposit</Button>
            {#if sentDeposit}
              <InlineLoading style="margin-left: 15px;" description="Sending Transaction..."/>
            {/if}
          </div>
          <Button disabled={disabledInput} on:click={toApprove} kind="ghost">Back</Button>
        </div>
      </Form>
    </div>
  {/if}

  <div>
    <ProgressIndicator spaceEqually={true} preventChangeOnClick currentIndex={index}>
      <ProgressStep complete={completeApproval} label="Approval"/>
      <ProgressStep complete={completeDeposit} label="Deposit"/>
    </ProgressIndicator>
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

    .allowance {
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