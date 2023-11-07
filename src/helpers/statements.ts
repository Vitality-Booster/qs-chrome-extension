import {StatementModel, IStatement} from "../models/statementModel"
import {ObjectId} from "./users";
import {Website} from "./websites";

export enum ActionEnum {
    Opened = "opened",
    Closed = "closed",
}

export async function createStatement(userId: ObjectId, website: Website, action: ActionEnum) {
    const statement: IStatement = {actor: userId, action: action, object: website.hostname}

    await StatementModel.create(statement)
}