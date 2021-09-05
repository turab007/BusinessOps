
export interface TaskGroup {
    _id?: string,
    name?: string,
    description?: string,
    work_space?:any,
    weight?: number,
    status?: boolean,
    created_by?: any
    tasks?: any[]
    //helping variables 
    displaySettings?:boolean
}