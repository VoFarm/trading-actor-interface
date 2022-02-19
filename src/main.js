import Home from './Home.svelte';

const home = new Home({
  target: document.body,
  props: { amountOfIterations: 24, amountOfPrices: 50, transactionExplorer: 'https://rinkeby.etherscan.io/tx/' },
});

export default home;