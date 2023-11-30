import {getCurrUserId} from "./users";
import {Website} from "./websites";
import {RetrStatement, Statement} from "../types/statement";

const api = "http://localhost:8081/statements/"

export enum ActionEnum {
    Opened = "opened",
    Closed = "closed",
}

export async function createStatement(website: Website, action: ActionEnum) {
    const userId = await getCurrUserId();
    if (!userId)
        throw Error("Login before registering your activity")

    const statement: Statement = {actor: userId, action: action, object: website.hostname, createdAt: Date.now().toString(), updatedAt: Date.now().toString()}

    await fetch(api, { method: "POST",  headers: {
            "Content-Type": "application/json" }, body: JSON.stringify(statement) });
}

export async function getStatements() {
    // todo change later
    const statements: RetrStatement[] = []
    return statements
}