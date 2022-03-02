import { writable } from "svelte/store";
import { TradingContractABI } from "../components/app/abi/trading";
import { defaultContract } from "../components/app/abi/defaultContract";
import { web3 } from "svelte-web3";

export function validConnection(connected, selectedAccount) {
  return !!connected && !!selectedAccount
}

export function validChain(chainID, requiredChainID) {
  return !!chainID && !!requiredChainID && parseInt(chainID, 16) === requiredChainID
}

interface AccountDashboard {
  currentBalance: number,
  depositedCurrency: string
}

export const accountDashboardData = writable<Array<AccountDashboard>>([])

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