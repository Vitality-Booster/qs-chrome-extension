import {OverallWebsite} from "../types/statistics";
import {storage} from "webextension-polyfill";

const api = "http://localhost:8081/statistics/"

export async function getWebsiteStats(): Promise<void> {
    const res = await fetch(api + "overall-websites/:id", { method: "GET",  headers: {
            "Content-Type": "application/json" }})

    const data = await res.json()
    console.log(data)
}

export async function getOverallWebsites() {

}

export async function setOverallWebsites(overalWebsites: OverallWebsite[]) {
    await storage.local.set({[CURRENT_USER]: overalWebsites})
}

export async function getCurrUserId(): Promise<string | null> {
    const userRec = await storage.local.get(CURRENT_USER)
    return userRec[CURRENT_USER] ?? null
}

async function setCurrUser(userId: string): Promise<void> {
    await storage.local.set({[CURRENT_USER]: userId})
}
