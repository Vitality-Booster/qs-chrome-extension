import {runtime, storage, tabs} from 'webextension-polyfill'

type Message = {
    from: string
    to: string
    action: string
}

async function getCurrentTab() {
    const list = await tabs.query({active: true, currentWindow: true})

    return list[0]
}

async function incrementsStoredValue(tabId: string) {
    const data = await storage.local.get(tabId)
    const currentValue = data?.[tabId] ?? 0

    return storage.local.set({[tabId]: currentValue + 1})
}

export async function init() {
    await storage.local.clear()
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

runtime.onInstalled.addListener(() => {
    init().then(() => {
        console.log("[background] loaded")
    })
})