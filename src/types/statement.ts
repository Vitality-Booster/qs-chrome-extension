import {Website} from "../helpers/websites";

export interface Statement {
    actor: string,
    action: string,
    object: Website,
    openedAt: string,
    closedAt?: string
}