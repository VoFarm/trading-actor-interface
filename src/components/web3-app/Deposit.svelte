<script>
  import {
    Button,
    Form,
    FormGroup,
    ProgressIndicator,
    ProgressStep,
    Select,
    SelectItem,
    TextInput,
    ToastNotification
  } from "carbon-components-svelte";
  import { web3, connected, chainId as chainIdWeb3 } from 'svelte-web3'
  import { TradingContractABI } from "./abi/trading.ts";

  export let contractAddress
  export let chainId

  let index = 0
  let completeApproval = false
  let completeDeposit = false
  let tokens = []
  let disabledInput = true

  async function getDepositableTokens(contractAddress) {
    try {
      const contract = new $web3.eth.Contract(TradingContractABI, contractAddress, {})
      tokens = (await contract.methods.name().call()).split("/")
    } catch {
      disabledInput = true
    }
  }

  function submit(a) {
    console.log(a)
  }

  $: {
    if ($connected && parseInt($chainIdWeb3, 16) === chainId) {
      getDepositableTokens(contractAddress)
      disabledInput = false
    } else {
      disabledInput = true
      tokens = []
    }
  }
</script>


<div id="deposit">
  {#if index === 0}
    <div class="form">
      <Form on:submit={submit}>
        <FormGroup>
          <Select disabled={disabledInput} id="select-1" labelText="Token To Approve" value="placeholder-item">
            {#each tokens as token}
              <SelectItem value="{token}" text="{token}"/>

            {/each}
          </Select>
        </FormGroup>

        <FormGroup>
          <TextInput disabled={disabledInput} inline labelText="Amount" placeholder="0.2"/>
        </FormGroup>

        <Button disabled={disabledInput} type="submit">Approve</Button>
      </Form>
    </div>
  {/if}

  {#if index === 1}
    <div class="form">
      <Form on:submit={submit}>
        <FormGroup>
          <Select disabled={disabledInput} id="select-1" labelText="Token To Deposit" value="placeholder-item">
            {#each tokens as token}
              <SelectItem value="{token}" text="{token}"/>

            {/each}
          </Select>
        </FormGroup>

        <FormGroup>
          <TextInput disabled={disabledInput} inline labelText="Amount" placeholder="0.2"/>
        </FormGroup>

        <Button disabled={disabledInput} type="submit">Deposit</Button>
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

    footer {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>