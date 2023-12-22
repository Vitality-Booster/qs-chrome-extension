import {OverallWebsite, OverallWebsiteRes} from "../types/statistics";
import {storage} from "webextension-polyfill";
import {getCurrUserId} from "./users";

const api = "http://localhost:8081/statistics/"
const OVERALL_WEBSITES = "overallWebsites"

export async function getWebsiteStats(): Promise<OverallWebsite[]> {
    const currUserId = await getCurrUserId()
    if (!currUserId)
        throw Error("Please, Log in first")

    const res = await fetch(api + `overall-websites/${currUserId}`, { method: "GET",  headers: {
            "Content-Type": "application/json" }})

    const data = await res.json()
    const statisticsRes: OverallWebsiteRes[] = data.statistics

    const statistics: OverallWebsite[] = await toOverallWebsitesAll(statisticsRes)

    await setOverallWebsites(statistics)

    return statistics
}

export async function toOverallWebsite(overallWebsiteRes: OverallWebsiteRes): Promise<OverallWebsite> {
    return {hostname: overallWebsiteRes._id, favIconUrl: overallWebsiteRes.favIconUrl, length: overallWebsiteRes.length}
}

export async function toOverallWebsitesAll(overallWebsitesRes: OverallWebsiteRes[]): Promise<OverallWebsite[]> {
    const overallWebsites: OverallWebsite[] = []

    overallWebsitesRes.forEach(async (web) => overallWebsites.push(await toOverallWebsite(web)))

    return overallWebsites
}

export async function getOverallWebsites() {
    const websitesRec = await storage.local.get(OVERALL_WEBSITES)
    return websitesRec[OVERALL_WEBSITES] ?? null
}

export async function setOverallWebsites(overalWebsites: OverallWebsite[]) {
    await storage.local.set({[OVERALL_WEBSITES]: overalWebsites})
}
