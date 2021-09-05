export interface TimeZone {
    _id?: string,
    name: string,
    abbr: string,
    isdst?: boolean,
    offset?: number,
    description?: string,
    utc?: any[]
}