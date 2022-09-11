import { writable } from "svelte/store"

/** @type {Session | null} **/
export const userSession = writable(false)