import {getCurrUserId} from "./users";
import {Website} from "./websites";
import {Statement} from "../types/statement";
import {storage} from "webextension-polyfill";

const api = "http://localhost:8081/statements/"
const STATEMENTS = "statements"
const LATEST_UPDATE_TIME = "latestUpdateTime"

export enum ActionEnum {
    Opened = "opened",
    Closed = "closed",
}

export async function createStatement(website: Website) {
    const userId = await getCurrUserId();
    if (!userId)
        throw Error("Login before registering your activity")

    const statement: Statement = {actor: userId, action: ActionEnum.Opened, object: website, openedAt: new Date().toISOString()}

    return statement
    // const statement: Statement = {actor: userId, action: action, object: website}
    //
    // await fetch(api, { method: "POST",  headers: {
    //         "Content-Type": "application/json" }, body: JSON.stringify(statement) });
}

export async function updateStatements(newWebsite: Website): Promise<void> {
    const statements = await getStatements()
    if (statements.length === 0) {
        console.log("Adding the first statement")
        const lastStatement = await createStatement(newWebsite)
        statements.push(lastStatement)
        await setStatements(statements)
        await setLatestUpdateTime(new Date().toISOString())
        return
    }

    const lastStatement = statements.at(-1)
    if (lastStatement && lastStatement.object.hostname !== newWebsite.hostname) {
        console.log("Updating the statements...")
        // Creating a "Closed action statement" for the previous Website
        if (lastStatement.action === ActionEnum.Closed)
            throw Error("Something went wrong")

        const timeEpoch = Date.now()

        // Update last statement by making it Closed and creating closedAt timestamp
        statements[statements.length - 1] = {...lastStatement, action: ActionEnum.Closed, closedAt: new Date(timeEpoch).toISOString()}

        // Creating new statement
        const newStatement = await createStatement(newWebsite)

        await uploadStatements(timeEpoch, statements, newStatement)

    }
}

async function uploadStatements(updateTimeEpoch: number, statements: Statement[], newStatement: Statement): Promise<void> {
    const latestUpdate = await getLatestUpdateTime()

    // Time difference in minutes
    const timeDiff = (updateTimeEpoch - new Date(latestUpdate).getTime()) / (1000.0 * 60.0)

    if (timeDiff < 1) {
        console.log("Updated statements and cached them")
        statements.push(newStatement)
        await setStatements(statements)
        return
    }

    console.log("Updated statements and sent them to the DB")
    await setStatements([newStatement])
    await setLatestUpdateTime(new Date(updateTimeEpoch).toISOString())

    const res = await fetch(api + "all", { method: "POST",  headers: {
            "Content-Type": "application/json" }, body: JSON.stringify(statements) });
}

export async function setStatements(statements: Statement[]): Promise<void> {
    await storage.local.set({[STATEMENTS]: statements})
}

export async function getStatements(): Promise<Statement[]> {
    const websiteRec = await storage.local.get(STATEMENTS)
    return websiteRec[STATEMENTS] ?? null
}

export async function setLatestUpdateTime(time: string): Promise<void> {
    await storage.local.set({[LATEST_UPDATE_TIME]: time})
}

async function getLatestUpdateTime(): Promise<string> {
    const timeRec = await storage.local.get(LATEST_UPDATE_TIME)
    return timeRec[LATEST_UPDATE_TIME]
}