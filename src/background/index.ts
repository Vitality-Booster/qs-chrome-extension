import {runtime, storage, tabs} from 'webextension-polyfill'
import {getCurrentTab, updatePreviousTab, Tab} from '../helpers/tabs'
import {Website} from "../helpers/websites";
import {logIn, signUp} from "../helpers/users";
import {setStatements, updateStatements} from "../helpers/statements";
import {getWebsiteStats} from "../helpers/statistics";

type Message = {
    from: string
    to: string
    action: string
}

async function incrementsStoredValue(tabId: string) {
    const data = await storage.local.get(tabId)
    const currentValue = data?.[tabId] ?? 0

    return storage.local.set({[tabId]: currentValue + 1})
}

export async function init() {
    await storage.local.clear()
    await logIn({email: "testuser@gmail.com", password: "12345678"})
    await setStatements([])
    await getWebsiteStats()
    runtime.onMessage.addListener(async (message: Message) => {
        if (message.to === 'background') {
            console.log('background handled: ', message.action)

            const tab = await getCurrentTab()
            const tabId = tab.id

            if (tabId)
                return incrementsStoredValue(tabId.toString())
        }
    })
}

tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        const url = new URL(changeInfo.url)
        const website: Website = {hostname: url.hostname, title: tab.title, favIconUrl: tab.favIconUrl}
        await updateStatements(website)
    }
});

tabs.onActivated.addListener(async (activeInfo) => {
    const currentTab = await tabs.get(activeInfo.tabId)
    if (currentTab.url) {
        const url = new URL(currentTab.url)
        const website: Website = {
            hostname: url?.hostname ?? "Starting page",
            title: currentTab.title,
            favIconUrl: currentTab.favIconUrl
        }
        await updateStatements(website)
    }
    await updatePreviousTab(activeInfo.tabId)
})

// todo Shall I create a matrix for tab data (?)

runtime.onInstalled.addListener(() => {
    init().then(() => {
        console.log("[background] loaded")
    })
})