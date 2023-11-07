import {runtime, storage, tabs} from 'webextension-polyfill'
import { getCurrentTab } from '../helpers/tabs'
import * as mongoose from "mongoose";
import {equal} from "assert";

const DB_CONNECT_STRING = process.env.DB_CONNECT ?? "mongodb://127.0.0.1:27017/myapp";

type Message = {
    from: string
    to: string
    action: string
}

// async function getCurrentTab() {
//     const list = await tabs.query({active: true, currentWindow: true})
//
//     return list[0]
// }

async function incrementsStoredValue(tabId: string) {
    const data = await storage.local.get(tabId)
    const currentValue = data?.[tabId] ?? 0

    return storage.local.set({[tabId]: currentValue + 1})
}

async function updatePreviousTab(tabId: number) {
    return storage.local.set({"prevTab": tabId})
}

async function getPreviousTab() {
    const previousTabRec: Record<string, number> = await storage.local.get("prevTab")
    const previousTabId: number = previousTabRec["prevTab"]
    return tabs.get(previousTabId)
}

export async function init() {
    await storage.local.clear()
    // await storage.local.set({"prevTab": 0})
    // the message receiver
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
    if (changeInfo.url) {
        const prevTab = await getPreviousTab()
        console.log(`Previous Tab Data: ID === ${prevTab.id}; Active === ${prevTab.active}; URL === ${prevTab.url}`)
        console.log(`'Change To' Tab Data: ID === ${tabId}; Active === ${tab.active}; URL === ${changeInfo.url}`)
        console.log(`Are Tab ID and tab.id equal? -> ${(tabId === tab.id)} \nTab ID: ${tabId}; tab.id: ${tab.id}`)
        console.log(`Are changeInfo.url and tab.url equal? -> ${(changeInfo.url === tab.url)} \nchangeInfo.url: ${changeInfo.url}; tab.url: ${tab.url}`)
        return;
    }
    // console.log("Yes: " + tab.url)
});

tabs.onActivated.addListener(async (activeInfo) => {
    const previousTabRec: Record<string, number> = await storage.local.get("prevTab")
    if (previousTabRec["prevTab"]) {
        const previousTab = await tabs.get(previousTabRec["prevTab"])
        // console.log(`Previous Tab data: Active === ${previousTab.active}; URL === ${previousTab.url}`)
    }
    const currentTab = await tabs.get(activeInfo.tabId)
    // console.log(`Current Tab data: Active === ${currentTab.active}; URL === ${currentTab.url}`)
    await updatePreviousTab(activeInfo.tabId)
})

// todo Shall I create a matrix for tab data (?)

runtime.onStartup.addListener(async () => {
    await mongoose.connect(DB_CONNECT_STRING);
})

runtime.onInstalled.addListener(() => {
    init().then(() => {
        console.log("[background] loaded")
    })
})