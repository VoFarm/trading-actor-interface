<script>
  import "carbon-components-svelte/css/white.css";
  import {
    Content,
    Header, HeaderUtilities,
    SideNav, SideNavDivider,
    SideNavItems,
    SideNavLink
  } from "carbon-components-svelte";
  import { Dropdown } from "carbon-components-svelte";
  import { useNavigate } from "svelte-navigator";
  import Account from "./Account.svelte";

  export let contractAddress
  export let chainId

  let isSideNavOpen = true
  let selections = []
  const navigate = useNavigate();

  fetch("/contractList").then(async (response) => {
    let contractNames = {}
    selections = (await response.text()).split(",")
    selections.pop()
    contractAddress = selections[0]

    for (const selection of selections) {
      try {
        contractNames[selection] = JSON.parse((await (await fetch(`/${ selection }/contractName`)).text())).replaceAll('"', '')
      } catch {
      }
    }
    selections = selections.map((selection) => {
      return { id: selection, text: `${ contractNames[selection] ?? '' } (${ selection })` }
    })
  })

  function navigateDeposit() {
    navigate("/app/deposit")
  }

  function navigateDashboard() {
    navigate("/app")
  }

  function updateAddress(event) {
    contractAddress = event.detail.selectedId
  }
</script>

<Header company="Volatility Farm" platformName="App Dashboard">
  <HeaderUtilities>
    <Account chainId="{chainId}"/>
  </HeaderUtilities>
</Header>
<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink on:click={navigateDashboard} text="Dashboard"/>
    <SideNavLink on:click={navigateDeposit} text="Deposit"/>
    <SideNavDivider/>
    <SideNavLink href="/" text="Home"/>
    <SideNavLink href="https://github.com/VoFarm" text="Source Code"/>
    <SideNavLink href="https://github.com/VoFarm" text="VoFarm Smart Contract"/>
    <SideNavLink href="https://github.com/VoFarm" text="Community"/>
  </SideNavItems>
</SideNav>

<Content>
  <Dropdown
      on:select={updateAddress}
      titleText="Contact"
      selectedId="{contractAddress}"
      items={selections}
  />
</Content>

<style>
    :global(.bx--btn) {
        margin: 12px auto !important;
    }

    :global(.bx--side-nav__items) {
        text-align: center !important;
    }
</style>