import {storage} from "webextension-polyfill"
import {User} from "../types/user";

const api = "http://localhost:8081/users/"
const CURRENT_USER = "currUser"

export async function getCurrUserId(): Promise<string | null> {
    const userRec = await storage.local.get(CURRENT_USER)
    return userRec[CURRENT_USER] ?? null
}

async function setCurrUser(userId: string): Promise<void> {
    await storage.local.set({[CURRENT_USER]: userId})
}

export async function logIn(user: User): Promise<void> {
    const currUserId = await getCurrUserId()
    if (currUserId)
        throw Error("You are already logged in. Log out first, please")
    const res = await fetch(api + "login", { method: "POST",  headers: {
            "Content-Type": "application/json" }, body: JSON.stringify(user) });

    const data = await res.json()
    const userRes: User = data.user

    // if (!dbUser)
    //     throw Error("User not Found")
    await setCurrUser(userRes._id ? userRes._id.toString() : "1234")
}

export async function signUp(user: User): Promise<void> {
    if (!user.email || !user.password)
        throw Error("Both email and password must be provided to create an account!")
    try {
        const res = await fetch(api + "signup", { method: "POST",  headers: {
                "Content-Type": "application/json" }, body: JSON.stringify(user) });

        const userRes: User = await res.json()

        console.log("The user I get after signup: " + JSON.stringify(userRes))
        console.log("This is the userRes._id: " + userRes._id)
        await setCurrUser(userRes._id ? userRes._id.toString() : "1234")
    } catch (er: any) {
        throw Error("Didn't manage to create a user. With message from Mongoose: " + er.message)
    }
}

export async function logOut() {
    const currUserId = await getCurrUserId()
    if (currUserId)
        await storage.local.remove(CURRENT_USER)
}