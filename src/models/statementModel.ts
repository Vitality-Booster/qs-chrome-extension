import {Schema, model, Types} from "mongoose"

export interface IStatement {
    actor: Types.ObjectId,
    action: string,
    object: string,
    createdAt: Date,
    updatedAt: Date
}

const statementSchema = new Schema<IStatement>(
    {
    actor: {type: Schema.Types.ObjectId, ref: "Users"},
    action: {type: String, required: true},
    object: String
    },
    {
        timestamps: true
    })

export const StatementModel = model<IStatement>("Statements", statementSchema)