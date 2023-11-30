export interface Statement {
    actor: string,
    action: string,
    object: string,
    createdAt: string,
    updatedAt?: string
}

export interface RetrStatement {
    object: string,
    action: string,
    createdAt: Date,
    updatedAt: Date
}