import { writable } from "svelte/store";
import { TradingContractABI } from "../components/app/abi/trading";
import { defaultContract } from "../components/app/abi/defaultContract";
import { approveTokenSelected, depositTokenSelected, tokens } from "./tokenSwap";
import { withdrawTokenSelected } from "./withdraw";
import { fetchContractList } from "./contract";

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
    const tokenContract = new web3.eth.Contract(TradingContractABI, contractAddress, {});


    const depositableTokenAddress = await tokenContract.methods.getCurrentToken().call()
    const depositableTokenContract = generateContractForBalanceRequest(depositableTokenAddress, web3)
    const depositableTokenName = await depositableTokenContract.methods.name().call();

    /*
    const secondaryAddress = await tokenContract.methods.getSecondaryToken().call()
    const secondaryContract = generateContractForBalanceRequest(secondaryAddress, web3)
    const secondaryName = await secondaryContract.methods.name().call();
     */

    tokens.set([
      { name: depositableTokenName, address: depositableTokenAddress }
    ])

    approveTokenSelected.set(depositableTokenAddress)
    depositTokenSelected.set(depositableTokenAddress)
    withdrawTokenSelected.set(depositableTokenAddress)
  } catch (e) {
    console.log(e)
    tokens.set(null)
    await fetchContractList(contractAddress)
  }
}

export async function getAccountDashboardData(selectedAccount, selectedContract, web3) {
  const tokenContract = new web3.eth.Contract(TradingContractABI, selectedContract, {});

  const depositableTokenAddress = await tokenContract.methods.getCurrentToken().call()
  const depositableTokenContract = generateContractForBalanceRequest(depositableTokenAddress, web3)
  const depositableTokenName = await depositableTokenContract.methods.name().call();
  const depositableTokenDecimals = await depositableTokenContract.methods.decimals().call();

  /*
  const secondaryAddress = await tokenContract.methods.getSecondaryToken().call()
  const secondaryContract = generateContractForBalanceRequest(secondaryAddress, web3)
  const secondaryName = await secondaryContract.methods.name().call();
   */

  accountDashboardData.set([
    {
      currentBalance: Number(await tokenContract.methods.getEarned().call({ from: selectedAccount })) * (10 ** -depositableTokenDecimals),
      depositedCurrency: depositableTokenName
    }
  ]);
}

export function generateContractForBalanceRequest(contractAddress: string, web3) {
  return new web3.eth.Contract(defaultContract, contractAddress, {});
}