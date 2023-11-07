import {Schema, model, Types} from "mongoose"

export interface IUser {
    _id?: Types.ObjectId,
    email: string,
    name?: string,
    password?: string,
}

const userSchema = new Schema<IUser>({
    email: {type: String, required: true, unique: true},
    name: String,
    password: {type: String, required: true}
});

export const UserModel = model<IUser>("Users", userSchema, "users")