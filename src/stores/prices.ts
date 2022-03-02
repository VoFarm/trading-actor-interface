import { writable } from "svelte/store";

export const graphData = writable<Array<object> | null>(null)

export const amountOfPrices = writable<number>(0)

export async function fetchGraphData(contract, amountOfPrices) {
  try {
    const response = await (await fetch(`/${ contract.address }/priceRange?earliestID=${ contract.priceCounter }&lastID=${ (contract.priceCounter - amountOfPrices) < 0 ? 0 : (contract.priceCounter - amountOfPrices) }`)).json()
    graphData.set(response.map((data) => {
      data = JSON.parse(data)
      return [
        {
          "group": contract.primaryTokenName,
          "date": data.date,
          "primary": Number(data.primary)
        },
        {
          "group": contract.secondaryTokenName,
          "date": data.date,
          "secondary": Number(data.secondary)
        }
      ]
    }).flatMap(value => value))
  } catch {
    graphData.set(null)
  }
}