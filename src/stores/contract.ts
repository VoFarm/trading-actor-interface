import { writable } from "svelte/store";
import { amountOfPrices, fetchGraphData } from "./prices";

interface Contract {
  address: string,
  primaryTokenName: string | null,
  secondaryTokenName: string | null,
  chainID: string | null,
  explorer: string | null,
  priceCounter: number | null,
  iterationCounter: number | null
}

export const contractList = writable<Array<string>>([])

export const contractNames = writable<{ [key: string]: string }>({})

export async function fetchContractList(lastAddress?: string) {
  const response = await fetch("/contractList")
  // parse one lined list
  let selections = (await response.text()).split(",")

  let contractAddressToName = {}
  for (const selection of selections) {
    try {
      contractAddressToName[selection] = JSON.parse((await (await fetch(`/${ selection }/contractName`)).text())).replaceAll('"', '')
    } catch {
    }
  }
  contractList.set(selections)
  contractNames.set(contractAddressToName)

  if (lastAddress && selections.find((selection) => selection === lastAddress)) {
    return;
  } else if (selections[0]) {
    await newContractSelected(selections[0])
  } else {
    selectedServerSideContract.set(null)
  }
}

export const selectedServerSideContract = writable<Contract>(null);

export async function newContractSelected(address: string) {
  const primaryTokenName = await (await fetch(`/${ address }/primaryName`)).json()
  const secondaryTokenName = await (await fetch(`/${ address }/secondaryName`)).json()
  const chainID = await (await fetch(`/${ address }/chainID`)).json()
  const explorer = await (await fetch(`/${ address }/tradingActorExplorer`)).json()
  const priceCounter = await (await fetch(`/${ address }/priceCount`)).json()
  const iterationCounter = await (await fetch(`/${ address }/count`)).json()

  selectedServerSideContract.set({
    address,
    primaryTokenName,
    secondaryTokenName,
    chainID,
    explorer,
    priceCounter: Number(priceCounter),
    iterationCounter: Number(iterationCounter)
  })
}
