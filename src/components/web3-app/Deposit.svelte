<script>
  import { Button, Form, FormGroup, Select, SelectItem, TextInput } from "carbon-components-svelte";
  import { connected, chainId as chainIdWeb3 } from 'svelte-web3'

  export let contractAddress
  export let chainId
</script>

<div id="form">
  <Form on:submit>
    <FormGroup>
      <Select id="select-1" labelText="Token To Deposit" value="placeholder-item">
        <SelectItem value="option-1" text="ETH"/>
        <SelectItem value="option-2" text="USDT"/>
        <SelectItem value="option-3" text="WETH"/>
      </Select>
    </FormGroup>

    <FormGroup>
      <TextInput inline labelText="Amount" placeholder="0.2"/>
    </FormGroup>

    {#if $connected && parseInt($chainIdWeb3, 16) === chainId}
      <Button type="submit">Deposit</Button>
    {:else}
      <Button disabled type="submit">Deposit</Button>
    {/if}
  </Form>
</div>

<style>
    #form {
        box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.10);
        padding: 36px;
        max-width: 700px;
        margin: 0 auto;
    }
</style>