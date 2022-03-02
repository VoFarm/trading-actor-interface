import { writable } from "svelte/store";
import { withdrawTokenSelected } from "./withdraw";
import { TradingContractABI } from "../components/app/abi/trading";
import { generateContractForBalanceRequest } from "./wallet";
import { defaultEvmStores } from 'svelte-web3'

export const tokens = writable<Array<{ name: String, address: String }> | null>(null)

export async function getUseableTokens(contractAddress, web3deac) {
  try {
    tokens.set(null)
    const tokenContract = new defaultEvmStores.$web3.eth.Contract(TradingContractABI, contractAddress, {});
    const primaryAddress = await tokenContract.methods.getPrimaryToken().call()
    const primaryContract = generateContractForBalanceRequest(primaryAddress)
    const primaryName = await primaryContract.methods.name().call();

    const secondaryAddress = await tokenContract.methods.getSecondaryToken().call()
    const secondaryContract = generateContractForBalanceRequest(secondaryAddress)
    const secondaryName = await secondaryContract.methods.name().call();


    tokens.set([
      { name: primaryName, address: primaryAddress },
      { name: secondaryName, address: secondaryAddress }
    ])
    approveTokenSelected.set(primaryAddress)
    depositTokenSelected.set(primaryAddress)
    withdrawTokenSelected.set(primaryAddress)
  } catch (e) {
    console.log(e)
    tokens.set(null)
  }
}

export const approveTokenSelected = writable<String | null>(null)
export const amountApproval = writable<number | null>(null)

export const amountAllowance = writable<number | null>(null)

export const depositTokenSelected = writable<String | null>(null)
export const amountDeposit = writable<number>(null)
