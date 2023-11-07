import {Schema, model, Types} from "mongoose"

export interface IUser {
    _id: Types.ObjectId,
    email: string,
    name?: string,
    password?: string,
}

const userSchema = new Schema<IUser>({
    email: {type: String, required: true},
    name: String,
    password: String
});

export const UserModel = model<IUser>("Users", userSchema)