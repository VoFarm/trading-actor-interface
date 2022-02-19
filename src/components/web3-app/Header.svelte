<script>
  import "carbon-components-svelte/css/white.css";
  import {
    Content,
    Header,
    SideNav, SideNavDivider,
    SideNavItems,
    SideNavLink
  } from "carbon-components-svelte";
  import { Dropdown } from "carbon-components-svelte";
  import { useNavigate } from "svelte-navigator";

  export let contractAddress

  let isSideNavOpen = true
  let selections = []
  const navigate = useNavigate();

  fetch("/contractList").then(async (response) => {
    selections = (await response.text()).split(",")
    selections.pop()
    contractAddress = selections[0]
    selections = selections.map((selection) => {
      return { id: selection, text: selection }
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

<Header company="Volatility Farm" platformName="App Dashboard"/>
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