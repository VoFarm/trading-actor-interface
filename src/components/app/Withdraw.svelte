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
  import { chainId, connected, web3, selectedAccount } from "svelte-web3";
  import { TradingContractABI } from "./abi/trading.ts";
  import Renew16 from "carbon-icons-svelte/lib/Renew16";
  import { generateContractForBalanceRequest, getUseableTokens, validChain, validConnection } from "../../stores/wallet";
  import { selectedServerSideContract } from "../../stores/contract";
  import { approveTokenSelected, depositTokenSelected, tokens } from "../../stores/tokenSwap";
  import { availableFunds, withdrawTokenSelected } from "../../stores/withdraw";
  import { ERC20ABI } from "./abi/erc20";

  let transactions = []
  // withdraw
  let index = 0
  let completeWithdraw = false
  let sentWithdraw = false
  let disabledInput = true

  async function withdrawAmount() {
    try {
      const tokenContract = new $web3.eth.Contract(TradingContractABI, $selectedServerSideContract.address, {});
      const withdraw = tokenContract.methods.withdraw().encodeABI();

      let tx = (await $web3.eth.sendTransaction({
        gasLimit: await tokenContract.methods.withdraw().estimateGas({ from: $selectedAccount }),
        from: $selectedAccount,
        to: $selectedServerSideContract.address,
        value: 0,
        data: withdraw
      }))
      transactions.push({
        title: "Success",
        kind: "success",
        subtitle: "Transaction Dispatched for Withdraw",
        caption: `<a href="${ $selectedServerSideContract.explorer }tx/${ tx.transactionHash }" target="_blank">Transaction</a>`
      })
      completeWithdraw = true
      index = 1
    } catch (e) {
      console.log(e)
      transactions.push({
        title: "Failed",
        kind: "error",
        subtitle: "Transaction Failed for Withdraw",
        caption: ""
      })
    }
    transactions = transactions
  }

  async function getBalance() {
    availableFunds.set(null)
    try {
      const tokenContract = new $web3.eth.Contract(TradingContractABI, $selectedServerSideContract.address, {});
      console.log(await tokenContract.methods.getEarned().call({ from: $selectedAccount }))
      availableFunds.set($web3.utils.fromWei(await tokenContract.methods.getEarned().call({ from: $selectedAccount }), 'ether'));
    } catch (e) {
      console.log(e)
      availableFunds.set(null)
      transactions.push({
        title: "Failed",
        kind: "error",
        subtitle: "Couldn't Fetch Balance",
        caption: ""
      })
      transactions = transactions
    }
  }

  selectedServerSideContract.subscribe(async (contract) => {
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

      {#if $tokens && $availableFunds && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
        <div class="balance">
          Balance: {$availableFunds} {$tokens.find((token) => token.address === $withdrawTokenSelected).name}
          <Button on:click={getBalance} kind="ghost" iconDescription="Reload" icon={Renew16}/>
        </div>
      {:else if !$availableFunds && validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
        <p class="balance">
          <SkeletonText style="height: 40px"/>
        </p>
      {:else}
        <div style="height: 45px"></div>
      {/if}

      <div class="actionButtons">
        <div style="display: flex;flex-direction: row;">
          <Button
              disabled={!$tokens || !$availableFunds || !validConnection($connected, $selectedAccount) || !validChain($chainId, $selectedServerSideContract.chainID)}
              type="submit">Withdraw Complete Balance
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
        width: max-content;
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