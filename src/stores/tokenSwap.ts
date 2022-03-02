import { writable } from "svelte/store";

export const tokens = writable<Array<{ name: String, address: String }> | null>(null)

export const approveTokenSelected = writable<String | null>(null)
export const amountApproval = writable<number | null>(null)

export const amountAllowance = writable<number | null>(null)

export const depositTokenSelected = writable<String | null>(null)
export const amountDeposit = writable<number>(null)
