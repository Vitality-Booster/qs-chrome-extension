import {storage} from "webextension-polyfill"
import {ActionEnum, createStatement} from "./statements";
import {getCurrUserId} from "./users";

const PREVIOUS_WEBSITE: string = "prevWebsite"

export type Website = {
    hostname: string,
    favIconUrl?: string
    title?: string,
}