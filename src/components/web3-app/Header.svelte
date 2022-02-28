<script>
  import "carbon-components-svelte/css/white.css";
  import {
    Button,
    Content,
    Header, HeaderUtilities,
    SideNav, SideNavDivider,
    SideNavItems,
    SideNavLink, SkeletonPlaceholder, SkipToContent
  } from "carbon-components-svelte";
  import { Dropdown } from "carbon-components-svelte";
  import Renew32 from "carbon-icons-svelte/lib/Renew32";
  import { useNavigate } from "svelte-navigator";
  import Account from "./Account.svelte";

  export let contractAddress
  export let chainId

  let isSideNavOpen = false
  let selections = []
  const navigate = useNavigate();

  async function getContractList() {
    const response = await fetch("/contractList")

    // parse one lined list
    let tempSelection = (await response.text()).split(",")
    let contractNames = {}

    if (contractAddress === "" || !tempSelection.includes(contractAddress)) {
      contractAddress = tempSelection[0]
    } else {
      contractAddress = contractAddress
    }

    for (const selection of tempSelection) {
      try {
        contractNames[selection] = JSON.parse((await (await fetch(`/${ selection }/contractName`)).text())).replaceAll('"', '')
      } catch {
      }
    }
    selections = tempSelection.map((selection) => {
      return { id: selection, text: `${ contractNames[selection] ?? "" } (${ selection })` }
    }).filter((selection) => selection)
  }

  function navigateDeposit() {
    navigate("/app/deposit")
  }

  function navigateWithdraw() {
    navigate("/app/withdraw")
  }

  function navigateDashboard() {
    navigate("/app")
  }

  function updateAddress(event) {
    contractAddress = event.detail.selectedId
  }

  $: {
    contractAddress = contractAddress
  }

  getContractList()
</script>

<Header company="Volatility Farm" platformName="App Dashboard" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent/>
  </svelte:fragment>
  <HeaderUtilities>
    <Account chainId="{chainId}"/>
  </HeaderUtilities>
</Header>
<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink on:click={navigateDashboard} text="Dashboard"/>
    <SideNavLink on:click={navigateDeposit} text="Deposit"/>
    <SideNavLink on:click={navigateWithdraw} text="Withdraw"/>
    <SideNavDivider/>
    <SideNavLink href="/" text="Home"/>
    <SideNavLink href="https://github.com/VoFarm" text="Source Code"/>
    <SideNavLink href="https://github.com/VoFarm" text="VoFarm Smart Contract"/>
    <SideNavLink href="https://github.com/VoFarm" text="Community"/>
  </SideNavItems>
</SideNav>

<Content>
  <div id="contentWrapper">
    {#if selections.length !== 0}
      <Dropdown
          id="contractSelector"
          on:select={updateAddress}
          titleText="Contracts"
          bind:selectedId="{contractAddress}"
          items={selections}
      />
    {:else}
      <SkeletonPlaceholder style="height: 45px; width: 100%;"/>
    {/if}
    <div id="refreshButton">
      <Button on:click={getContractList} kind="primary" iconDescription="Reload" icon={Renew32}/>
    </div>
  </div>
</Content>

<style>
    #contentWrapper {
        display: inline-flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-items: flex-end;
    }

    #refreshButton {
        margin: 0 16px !important;
    }

    :global(.bx--side-nav__items) {
        text-align: center !important;
    }
</style>
