<script>
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading, ProgressIndicator, ProgressStep,
    Select,
    SelectItem, SkeletonPlaceholder,
    SkeletonText, StructuredList, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow,
    ToastNotification
  } from "carbon-components-svelte";
  import { chainId, connected, web3, selectedAccount, makeContractStore } from "svelte-web3";
  import { TradingContractABI } from "./abi/trading.ts";
  import Renew16 from "carbon-icons-svelte/lib/Renew16";
  import { generateContractForBalanceRequest, getUseableTokens, validChain, validConnection } from "../../stores/wallet";
  import { selectedServerSideContract } from "../../stores/contract";
  import { amountApproval, approveTokenSelected, depositTokenSelected, tokens } from "../../stores/tokenSwap";
  import { availableFunds, withdrawTokenSelected } from "../../stores/withdraw";
  import { ERC20ABI } from "./abi/erc20";

  let tokenContract
  let selectedTokenContract
  let transactions = []
  // withdraw
  let index = 0
  let completeWithdraw = false
  let sentWithdraw = false
  let disabledInput = true

  async function withdrawAmount() {
    index = 0
    completeWithdraw = false
    transactions = []
    index = index
    completeWithdraw = completeWithdraw
    transactions = transactions

    try {
      const withdraw = $tokenContract.methods.withdraw().encodeABI();

      let tx = (await $web3.eth.sendTransaction({
        gasLimit: await $tokenContract.methods.withdraw().estimateGas({ from: $selectedAccount }),
        from: $selectedAccount,
        to: $selectedServerSideContract.address,
        value: 0,
        data: withdraw
      }))
      transactions.push({
        title: "Success",
        kind: "success",
        subtitle: "Transaction Dispatched for Withdraw",
        caption: `<a href="${ $selectedServerSideContract.explorer }tx/${ tx.transactionHash }" target="_blank">${ tx.transactionHash }</a>`
      })
      completeWithdraw = true
      index = 1
    } catch (e) {
      transactions.push({
        title: "Failed",
        kind: "error",
        subtitle: `Transaction Failed for Withdraw`,
        caption: `${ e.message }`
      })
    }
    transactions = transactions
  }

  async function getBalance() {
    availableFunds.set(null)
    try {
      const decimals = Number(await $selectedTokenContract.methods.decimals().call())

      availableFunds.set(String(Number(await $tokenContract.methods.getEarned().call({ from: $selectedAccount })) * (10 ** -decimals)));
    } catch (e) {
      availableFunds.set(null)
      setTimeout(() => getBalance(), 1000)
      transactions = transactions
    }
  }

  selectedServerSideContract.subscribe(async (contract) => {
    index = 0
    completeWithdraw = false
    if (contract && contract.address) {
      tokenContract = makeContractStore(TradingContractABI, contract.address)
    }

    if ($web3 && validConnection($connected, $selectedAccount) && validChain($chainId, contract.chainID)) {
      tokens.set(null)
      await getUseableTokens(contract.address, $web3)
      await getBalance()
    }
  })
  withdrawTokenSelected.subscribe(async (tokenSelected) => {
    if ($tokens && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)) {
      await getBalance()
    }

    if (tokenSelected) {
      selectedTokenContract = makeContractStore(ERC20ABI, tokenSelected)
    }

  })

  tokens.subscribe((tokenList) => {
    index = 0
    completeWithdraw = false
  })
</script>

<div id="withdraw">
  <div class="form">
    <Form on:submit={withdrawAmount}>
      {#if $web3 && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
        {#await $tokens ? new Promise((res) => res(true)) : getUseableTokens($selectedServerSideContract.address, $web3)}
          <SkeletonPlaceholder style="height: 64px; width: 100%; margin:18px 0;"/>
        {:then _}
          <FormGroup>
            <Select
                disabled={!validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID)}
                id="select-1" labelText="Token To Withdraw" bind:selected={$withdrawTokenSelected}>
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
          <Select disabled={true} id="select-1" labelText="Token To Withdraw"/>
        </FormGroup>
      {/if}

      {#if $tokens && ($availableFunds !== null) && ($availableFunds >= 0) && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
        <div class="balance">
          Balance: {$availableFunds} {$tokens.find((token) => token.address === $withdrawTokenSelected).name}
          <Button style="margin: 2px 8px" on:click={getBalance} kind="ghost" iconDescription="Reload" icon={Renew16}/>
        </div>
      {:else if validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
        <p class="balance">
          <SkeletonText style="height: 40px"/>
        </p>
      {:else}
        <div style="height: 40px;"></div>
      {/if}

      <div class="actionButtons">
        <div style="display: flex;flex-direction: row;">
          <Button
              disabled={!$tokens || !$availableFunds || !validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID)}
              type="submit">
            Withdraw Balance
          </Button>
          {#if sentWithdraw}
            <InlineLoading style="margin-left: 15px;" description="Sending Transaction..."/>
          {/if}
        </div>
      </div>
    </Form>
  </div>
  <div>
    <ProgressIndicator spaceEqually={true} preventChangeOnClick currentIndex={index}>
      <ProgressStep complete={completeWithdraw} label="Withdraw"/>
    </ProgressIndicator>
  </div>


  {#if transactions.length > 0}
    <div style="margin: 48px 0">
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
  {/if}

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

    #withdraw {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        align-items: stretch;
        margin: 0 auto;
    }

    .balance {
        display: flex;
        flex-direction: row;
        align-content: stretch;
        align-items: center;
        text-align: start;
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