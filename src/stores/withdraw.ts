import { writable } from "svelte/store";

export const withdrawTokenSelected = writable<String | null>(null)
export const availableFunds = writable<String | null>(null)