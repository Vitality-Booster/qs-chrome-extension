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
    console.log("This is the previous website data: " + JSON.stringify(prevWebsite))
    if (prevWebsite?.hostname !== newWebsite.hostname) {
        // Creating a "Closed action statement" for the previous Website
        const userId = await getCurrUserId()
        if (!userId)
            throw Error("Please, login first!")
        if (prevWebsite)
            await createStatement(prevWebsite, ActionEnum.Closed)

        console.log(`Updated the latest Website to: Hostname --- ${newWebsite.hostname}, Full URL --- ${newWebsite.fullUrl}`)
        await setPrevWebsite(newWebsite)
        // Creating an "Opened action statement" for the new Website
        await createStatement(newWebsite, ActionEnum.Opened)
    }
}

async function setPrevWebsite(website: Website): Promise<void> {
    console.log("The website that I get: " + JSON.stringify(website))
    await storage.local.set({[PREVIOUS_WEBSITE]: website})
}

export async function getPrevWebsite(): Promise<Website | null> {
    const websiteRec = await storage.local.get(PREVIOUS_WEBSITE)
    return websiteRec[PREVIOUS_WEBSITE] ?? null
}