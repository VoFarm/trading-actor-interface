<script>
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    ProgressIndicator,
    ProgressStep,
    Select,
    SelectItem,
    SkeletonPlaceholder,
    SkeletonText,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
    TextInput,
    ToastNotification
  } from "carbon-components-svelte";
  import { web3, connected, chainId, selectedAccount } from 'svelte-web3'
  import { TradingContractABI } from "./abi/trading.ts";
  import { ERC20ABI } from "./abi/erc20.ts";
  import Renew16 from "carbon-icons-svelte/lib/Renew16";
  import {
    amountAllowance,
    amountApproval, amountDeposit,
    approveTokenSelected,
    depositTokenSelected,
    tokens
  } from "../../stores/tokenSwap";
  import { selectedServerSideContract } from "../../stores/contract";
  import { getUseableTokens, validChain, validConnection } from "../../stores/wallet";

  let index = 0

  let transactions = []

  // approval
  let completeApproval = false
  let sentApproval = false

  // deposit
  let completeDeposit = false
  let sentDeposit = false

  let disabledInput = true

  async function getAllowance(tokenAddress) {
    try {
      amountAllowance.set(null)
      const tokenContract = new $web3.eth.Contract(ERC20ABI, tokenAddress, {});
      amountAllowance.set($web3.utils.fromWei(await tokenContract.methods.allowance($selectedAccount, $selectedServerSideContract.address).call(), 'ether'));
    } catch {
      amountAllowance.set(null)
    }
  }

  async function approveAmount() {
    try {
      let sanitizedAmount = $web3.utils.toBN($web3.utils.toWei($amountApproval, 'ether'))
      const tokenContract = new $web3.eth.Contract(ERC20ABI, $approveTokenSelected, {});
      const approve = tokenContract.methods.approve($selectedServerSideContract.address, sanitizedAmount).encodeABI();

      try {
        sentApproval = true
        let tx = (await $web3.eth.sendTransaction({
          gasLimit: await tokenContract.methods.approve($selectedServerSideContract.address, sanitizedAmount).estimateGas({ from: $selectedAccount }),
          from: $selectedAccount,
          to: $approveTokenSelected,
          value: 0,
          data: approve
        }))
        transactions.push({
          title: "Success",
          kind: "success",
          subtitle: "Transaction Dispatched for Approval",
          caption: `<a href="${ $selectedServerSideContract.explorer }tx/${ tx.transactionHash }" target="_blank">Transaction</a>`
        })
        completeApproval = true
        depositAmount(sanitizedAmount)
      } catch (e) {
        console.log(e)
        transactions.push({
          title: "Failed",
          kind: "error",
          subtitle: "Transaction Failed for Approval",
          caption: ""
        })
      }
    } catch (e) {
      console.log(e)
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

  async function depositAmount(sanitizedAmount) {
    index = 1
    try {
      const tradingContract = new $web3.eth.Contract(TradingContractABI, $selectedServerSideContract.address, {});
      const deposit = tradingContract.methods.deposit($approveTokenSelected, sanitizedAmount).encodeABI();

      try {
        sentDeposit = true
        let tx = (await $web3.eth.sendTransaction({
          gasLimit: await tradingContract.methods.deposit($approveTokenSelected, sanitizedAmount).estimateGas({ from: $selectedAccount }),
          from: $selectedAccount,
          to: $selectedServerSideContract.address,
          value: 0,
          data: deposit
        }))
        transactions.push({
          title: "Success",
          kind: "success",
          subtitle: "Transaction Dispatched for Deposit",
          caption: `<a href="${ $selectedServerSideContract.explorer }tx/${ tx.transactionHash }" target="_blank">Transaction</a>`
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
      console.log(e)
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

  async function getMetaData() {
    if ($web3 && validConnection(connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)) {
      index = 0
      tokens.set(null)
      await getUseableTokens($selectedServerSideContract.address, $web3)
      await getAllowance($approveTokenSelected)
    }
  }

  chainId.subscribe((id) => getMetaData())

  connected.subscribe((connected) => getMetaData())

  selectedServerSideContract.subscribe(async (contract) => {
    if (contract && $web3 && validConnection($connected, $selectedAccount) && validChain($chainId, contract.chainID)) {
      index = 0
      tokens.set(null)
      await getUseableTokens(contract.address, $web3)
      await getAllowance($approveTokenSelected)
    }
  })

  approveTokenSelected.subscribe(async (tokenSelected) => {
    if (tokenSelected && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)) {
      await getAllowance(tokenSelected)
    }
  })

  depositTokenSelected.subscribe(async (tokenSelected) => {
    if (tokenSelected && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)) {
      await getAllowance(tokenSelected)
    }
  })
</script>


<div id="deposit">
  <div class="form">
    <Form on:submit={approveAmount}>
      {#if $tokens && $web3 && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
        {#await $tokens ? new Promise((res) => res(true)) : getUseableTokens($selectedServerSideContract.address, $web3)}
          <SkeletonPlaceholder style="height: 64px; width: 100%; margin:18px 0;"/>
        {:then _}
          <FormGroup>
            <Select
                disabled={!validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID)}
                id="select-1" labelText="Token To Deposit" bind:selected={$approveTokenSelected}>
              {#each $tokens as token}
                <SelectItem value="{token.address}" text="{token.name}"/>
              {/each}
            </Select>
          </FormGroup>
        {:catch error}
          <SkeletonPlaceholder style="height: 64px; width: 100%; margin:18px 0;"/>
        {/await}
      {:else}
        <FormGroup>
          <Select disabled={true} id="select-1" labelText="Token To Deposit"/>
        </FormGroup>
      {/if}

      <FormGroup>
        <TextInput bind:value={$amountApproval}
                   disabled={!validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID)}
                   inline labelText="Amount" placeholder="0.2"/>
      </FormGroup>
      <div class="actionButtons">
        <div style="display: flex;flex-direction: row;">
          <Button
              disabled={!$approveTokenSelected || !validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID)}
              type="submit">
            Deposit
          </Button>
          {#if sentApproval}
            <InlineLoading style="margin-left: 15px;" description="Sending Transaction..."/>
          {/if}
        </div>
      </div>
    </Form>
  </div>
  <div>
    <ProgressIndicator spaceEqually={true} preventChangeOnClick currentIndex={index}>
      <ProgressStep complete={completeApproval} label="Approval"/>
      <ProgressStep complete={completeDeposit} label="Deposit"/>
    </ProgressIndicator>
  </div>

  <div style="margin: 24px 0">
    <StructuredList>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Status</StructuredListCell>
          <StructuredListCell head>Message</StructuredListCell>
          <StructuredListCell head>Transaction</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      {#each transactions as transaction}
        <StructuredListBody>
          <StructuredListRow>
            <StructuredListCell>{transaction.title}</StructuredListCell>
            <StructuredListCell>{transaction.subtitle}</StructuredListCell>
            <StructuredListCell>{@html transaction.caption}</StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      {/each}
    </StructuredList>
  </div>

</div>

<footer>
  {#if $selectedServerSideContract && (!validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID))}
    <ToastNotification
        kind="info"
        title="Please Connect Your Wallet"
        subtitle="Deposits can be done with a Connected Wallet"
    />
  {/if}
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