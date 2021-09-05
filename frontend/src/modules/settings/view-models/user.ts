export interface User {
    _id: string,
    first_name: string,
    last_name: string,
    initials?:string,
    user_id: string,
    fullname:string,
    status: boolean,
    is_admin: boolean,//TODO:low: Remove it.. Its only for demo
    roles?: any[],
    businessGroups?: any[],
    work_spaces?:any[]
}