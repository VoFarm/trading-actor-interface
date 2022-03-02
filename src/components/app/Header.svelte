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
  import { contractList, fetchContractList, newContractSelected, selectedServerSideContract } from "../../stores/contract.ts";
  import { contractNames } from "../../stores/contract";
  import { page } from "../../stores/iterations";
  import { graphData } from "../../stores/prices";

  let isSideNavOpen = false
  const navigate = useNavigate();

  function createDropdownList(contractList, contractNameDict) {
    return contractList.map((contract) => {
      try {
        return { id: contract, text: `${ contractNameDict[contract] ?? "" } (${ contract })` }
      } catch {
        return undefined
      }
    }).filter((contract) => contract)
  }

  function updateDashboard(address) {
    graphData.set(null)
    fetchContractList(address)
  }

  function updateAddress(event) {
    page.set(1)
    graphData.set(null)
    newContractSelected(event.detail.selectedId)
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

  fetchContractList()
</script>

<Header company="Volatility Farm" platformName="App Dashboard" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent/>
  </svelte:fragment>
  <HeaderUtilities>
    {#if $selectedServerSideContract && $selectedServerSideContract.chainID}
      <Account/>
    {/if}
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
    {#if $selectedServerSideContract && $contractList.length !== 0}
      <Dropdown
          id="contractSelector"
          on:select={updateAddress}
          titleText="Contracts"
          selectedId="{$selectedServerSideContract.address}"
          items={createDropdownList($contractList, $contractNames)}
      />
    {:else}
      <SkeletonPlaceholder style="height: 45px; width: 100%;"/>
    {/if}
    <div id="refreshButton">
      <Button on:click={() => updateDashboard($selectedServerSideContract.address)} kind="primary" iconDescription="Reload" icon={Renew32}/>
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
