export interface StatusFlow {
    _id?: string,
    business_group_id?:string,
    type?:string,
    name: string,
    weight?:number,
    status?: boolean,
    description?: string
}