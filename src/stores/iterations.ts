import { writable } from "svelte/store";

export const iterationData = writable<Array<object>>(null)

export const page = writable<number>(1)
export const pageSize = writable<number>(1)

export async function fetchIteration(contract, pageSize, page) {
  try {
    iterationData.set(null)
    let lastID = contract.iterationCounter - (pageSize * page) + 1
    try {
      iterationData.set(await (await fetch(`/${ contract.address }/iterationRange?earliestID=${ Number(contract.iterationCounter - (pageSize * page)) + Number(pageSize) }&lastID=${ lastID < 0 ? 0 : lastID }`)).json())
    } catch {
      iterationData.set(null)
    }
  } catch {
    iterationData.set(null)
  }
}