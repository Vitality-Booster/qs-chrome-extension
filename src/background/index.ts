import {runtime, storage, tabs} from 'webextension-polyfill'
import {getCurrentTab, updatePreviousTab, Tab} from '../helpers/tabs'
import {updatePrevWebsite, Website} from "../helpers/websites";
import {connect} from "mongoose";
import {logIn, signUp} from "../helpers/users";

// TODO
//  1. Solve an issue with Mongoose
//  2. Solve an issue with env file and webpack / cra
const DB_CONNECT_STRING = process.env.DB_CONNECT ?? "mongodb://127.0.0.1:27017/myapp";

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
    console.log("This is the DB_CONNECT value: " + DB_CONNECT_STRING)
    await connect(DB_CONNECT_STRING, {dbName: "quantified_student"});
    await signUp({email: "testuser@gmail.com", password: "12345678"})
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
    if (changeInfo.url && tab.active) {
        const url = new URL(changeInfo.url)
        const website: Website = {hostname: url.hostname, fullUrl: changeInfo.url, title: tab.title, favIconUrl: tab.favIconUrl}
        await updatePrevWebsite(website)
    }
});

tabs.onActivated.addListener(async (activeInfo) => {
    const currentTab = await tabs.get(activeInfo.tabId)
    if (currentTab.url) {
        const url = new URL(currentTab.url)
        const website: Website = {
            hostname: url?.hostname ?? "Starting page",
            fullUrl: currentTab.url ?? "Starting page",
            title: currentTab.title,
            favIconUrl: currentTab.favIconUrl
        }
        await updatePrevWebsite(website)
    }
    await updatePreviousTab(activeInfo.tabId)
})

// todo Shall I create a matrix for tab data (?)

// runtime.onStartup.addListener(async () => {
//     await mongoose.connect(DB_CONNECT_STRING, {dbName: "quantified_student"});
//     await signUp({email: "testuser@gmail.com", password: "12345678"})
// })

runtime.onInstalled.addListener(() => {
    init().then(() => {
        console.log("[background] loaded")
    })
})