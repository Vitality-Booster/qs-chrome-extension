import {storage} from "webextension-polyfill"
import {IUser, UserModel} from "../models/userModel";
import {genSaltSync, hashSync, compareSync} from "bcrypt-ts";
import {Schema, Types} from "mongoose";

const CURRENT_USER = "currUser"

export class ObjectId extends Types.ObjectId {

}
export async function getCurrUserId(): Promise<ObjectId | null> {
    const userRec = await storage.local.get(CURRENT_USER)
    return userRec[CURRENT_USER] ?? null
}

async function setCurrUser(userId: ObjectId): Promise<void> {
    await storage.local.set({[CURRENT_USER]: userId})
}

export async function logIn(user: IUser): Promise<IUser> {
    const currUserId = await getCurrUserId()
    if (currUserId)
        throw Error("You are already logged in. Log out first, please")
    const dbUser: IUser | null = await UserModel.findOne({
        email: user.email
    })
    if (!dbUser)
        throw Error("User not Found")
    if (compareSync(user.password ?? "", dbUser.password ?? "---")) {
        await setCurrUser(dbUser._id ?? new ObjectId(""))
        return dbUser
    } else {
        throw Error("Wrong password. Try again")
    }
}

export async function signUp(user: IUser): Promise<IUser> {
    if (!user.email || !user.password)
        throw Error("Both email and password must be provided to create an account!")
    try {
        const salt = genSaltSync()
        user.password = hashSync(user.password, salt)
        const currUser: IUser = await UserModel.create(user)
        await setCurrUser(currUser._id ?? new ObjectId(""))
        return currUser
    } catch (er: any) {
        throw Error("Didn't manage to create a user. With message from Mongoose: " + er.message)
    }
}

export async function logOut() {
    const currUserId = await getCurrUserId()
    if (currUserId)
        await storage.local.remove(CURRENT_USER)
}