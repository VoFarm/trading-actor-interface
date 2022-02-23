import Home from './Home.svelte';

const home = new Home({
  target: document.body,
  props: { amountOfIterations: 25, amountOfPrices: 250, transactionExplorer: 'https://rinkeby.etherscan.io/tx/', chainId: 4 },
});

export default home;