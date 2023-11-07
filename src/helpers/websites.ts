import {storage} from "webextension-polyfill"
import {ActionEnum, createStatement} from "./statements";
import {getCurrUserId} from "./users";

const PREVIOUS_WEBSITE: string = "prevWebsite"

// TODO Consider storing it in a DB
export type Website = {
    hostname: string,
    fullUrl: string,
    title?: string,
    favIconUrl?: string
}

export async function updatePrevWebsite(newWebsite: Website): Promise<void> {
    const prevWebsite = await getPrevWebsite()
    if (prevWebsite?.hostname !== newWebsite.hostname) {
        // Creating a "Closed action statement" for the previous Website
        const userId = await getCurrUserId()
        if (!userId)
            throw Error("Please, login first!")
        if (prevWebsite)
            await createStatement(userId, prevWebsite, ActionEnum.Closed)

        // Creating an "Opened action statement" for the new Website
        await createStatement(userId, newWebsite, ActionEnum.Opened)
        console.log(`Updated the latest Website to: Hostname --- ${newWebsite.hostname}, Full URL --- ${newWebsite.fullUrl}`)
        await setPrevWebsite(newWebsite)
    }
}

async function setPrevWebsite(website: Website): Promise<void> {
    await storage.local.set({[PREVIOUS_WEBSITE]: website})
}

export async function getPrevWebsite(): Promise<Website | null> {
    const websiteRec = await storage.local.get(PREVIOUS_WEBSITE)
    return websiteRec[PREVIOUS_WEBSITE] ?? null
}