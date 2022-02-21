<script>
  import { connected, selectedAccount, chainId as chainIdWeb3 } from 'svelte-web3'
  import { defaultEvmStores } from 'svelte-web3'
  import { Button } from "carbon-components-svelte";
  import Wallet24 from "carbon-icons-svelte/lib/Wallet24";

  export let chainId

  async function connectWallet() {
    defaultEvmStores.setProvider()
  }
</script>

{#if !$connected}
  <p>
    <Button id="connect" on:click={connectWallet}>Connect Wallet</Button>
  </p>
{:else if $connected && parseInt($chainIdWeb3, 16) !== chainId}
  <p class="accountAddress">
    Please switch to chain {chainId}
  </p>
{:else}
  <div>
    <Wallet24 id="walletAccount"/>
  </div>
  <p class="accountAddress">
    {$selectedAccount}
  </p>
{/if}


<style>
    :global(#connect) {
        margin: 0 !important;
    }

    :global(#walletAccount) {
        height: 100% !important;
    }

    div {
        color: white;
    }

    .accountAddress {
        color: white;
        align-self: center;
        padding: 0 12px;
    }
</style>