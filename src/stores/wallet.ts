import { writable } from "svelte/store";
import { TradingContractABI } from "../components/app/abi/trading";
import { defaultContract } from "../components/app/abi/defaultContract";
import { web3 } from "svelte-web3";
import { approveTokenSelected, depositTokenSelected, tokens } from "./tokenSwap";
import { withdrawTokenSelected } from "./withdraw";

export function validConnection(connected, selectedAccount) {
  return !!connected && !!selectedAccount
}

export function validChain(chainID, requiredChainID) {
  try {
    let parsedChainID = chainID
    if (String(chainID).slice(0, 2) == '0x') {
      parsedChainID = parseInt(chainID, 16);
    }

    return !!parsedChainID && !!requiredChainID && parsedChainID === requiredChainID
  } catch {
    return false
  }
}

interface AccountDashboard {
  currentBalance: number,
  depositedCurrency: string
}

export const accountDashboardData = writable<Array<AccountDashboard>>([])

export async function getUseableTokens(contractAddress, web3) {
  try {
    tokens.set(null)
    /*
    const tokenContract = new web3.eth.Contract(TradingContractABI, contractAddress, {});
    const primaryAddress = await tokenContract.methods.getPrimaryToken().call()
    const primaryContract = generateContractForBalanceRequest(primaryAddress, web3)
    const primaryName = await primaryContract.methods.name().call();

    const secondaryAddress = await tokenContract.methods.getSecondaryToken().call()
    const secondaryContract = generateContractForBalanceRequest(secondaryAddress, web3)
    const secondaryName = await secondaryContract.methods.name().call();

    tokens.set([
      { name: primaryName, address: primaryAddress },
      { name: secondaryName, address: secondaryAddress }
    ])
    */

    tokens.set([
      { name: "WETH", address: "0xc778417E063141139Fce010982780140Aa0cD5Ab" },
      { name: "DAI", address: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa" }
    ])
    approveTokenSelected.set("0xc778417E063141139Fce010982780140Aa0cD5Ab")
    depositTokenSelected.set("0xc778417E063141139Fce010982780140Aa0cD5Ab")
    withdrawTokenSelected.set("0xc778417E063141139Fce010982780140Aa0cD5Ab")
  } catch (e) {
    console.log(e)
    tokens.set(null)
  }
}

export async function getAccountDashboardData(selectedAccount, selectedContract, web3) {
  const tokenContract = new web3.eth.Contract(TradingContractABI, selectedContract, {});

  const primaryAddress = await tokenContract.methods.getPrimaryToken().call()
  const primaryContract = generateContractForBalanceRequest(primaryAddress, web3)
  const primaryName = await primaryContract.methods.name().call();

  const secondaryAddress = await tokenContract.methods.getSecondaryToken().call()
  const secondaryContract = generateContractForBalanceRequest(secondaryAddress, web3)
  const secondaryName = await secondaryContract.methods.name().call();

  accountDashboardData.set([
    { currentBalance: Number(await tokenContract.methods.getEarned(primaryAddress).call()), depositedCurrency: primaryName },
    { currentBalance: Number(await tokenContract.methods.getEarned(secondaryAddress).call()), depositedCurrency: secondaryName },
  ]);
}

export function generateContractForBalanceRequest(contractAddress: string, web3) {
  return new web3.eth.Contract(defaultContract, contractAddress, {});
}