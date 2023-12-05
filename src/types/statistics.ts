export interface OverallWebsite {
    hostname: string,
    favIconUrl: string, // probably will need to change to 'favIconUrl?: string'
    length: number
}

export interface OverallWebsiteRes {
    _id: string, // here the '_id' is the equivalent to the 'hostname', but that's what the back-end sends
    favIconUrl: string, // probably will need to change to 'favIconUrl?: string'
    length: number
}