import {storage, Tabs, tabs} from 'webextension-polyfill'

const PREVIOUS_TAB: string = "prevTab"

export async function getCurrentTab(): Promise<Tab> {
    const list = await tabs.query({ active: true, currentWindow: true })

    return list[0]
}

export type Tab = Tabs.Tab

export async function updatePreviousTab(tabId: number) {
    const newTab = await tabs.get(tabId)
    console.log(`Updated the Tab to the: ID --- ${newTab.id}, web --- ${newTab.url}`)
    return storage.local.set({[PREVIOUS_TAB]: tabId})
}

export async function getPreviousTab(): Promise<Tab | null> {
    const previousTabRec: Record<string, number> = await storage.local.get(PREVIOUS_TAB)
    const previousTabId: number | null = previousTabRec[PREVIOUS_TAB] ?? null
    return previousTabId ? tabs.get(previousTabId) : null
}