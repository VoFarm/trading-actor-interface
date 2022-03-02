<script>
  import { connected, selectedAccount, chainId } from 'svelte-web3'
  import { defaultEvmStores } from 'svelte-web3'
  import { Button } from "carbon-components-svelte";
  import Wallet24 from "carbon-icons-svelte/lib/Wallet24";
  import { selectedServerSideContract } from "../../stores/contract";
  import { validChain, validConnection } from "../../stores/wallet";

  async function connectWallet() {
    defaultEvmStores.setProvider()
  }
</script>

{#if validConnection($connected, $selectedAccount) && validChain($chainId, $selectedServerSideContract.chainID)}
  <div>
    <Wallet24 id="walletAccount"/>
  </div>
  <p class="accountAddress">
    {$selectedAccount}
  </p>
{:else if validConnection($connected, $selectedAccount) && !validChain($chainId, $selectedServerSideContract.chainID)}
  <p class="accountAddress">
    Please switch to chain {$selectedServerSideContract.chainID}
  </p>
{:else}
  <p>
    <Button id="connect" on:click={connectWallet}>Connect Wallet</Button>
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