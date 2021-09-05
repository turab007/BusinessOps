
export interface List {
    _id?: string,
    name?: string,
    work_space?: string,
    weight?: number,
    visibility?: string,
    description?: string,
    archived?: boolean,
    status?: boolean,
    created_by?: any,
    items?:any[],
    //helping variables 
    // displaySettings?:boolean,
    listStyle?:string,
    shareEmail: string,
    newItem?:string //TEMP VARIABLE TO STORE NEW ITEM IN LIST
}