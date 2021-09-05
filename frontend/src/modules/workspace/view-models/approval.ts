
export interface Approval {
    _id?: string,
    work_space?: any,
    name: string,
    description?: string,
    assign_to_workspace?: any,
    assign_to_user?:any,
    comments?: any[],
    attachments?: any[],
    due_date?: String,
    weight?: number,
    status?: string,
    //virtual attributes
    created_by?: any
    createdAgo?: any,
    createdDate?: any,
    created_at: number,
}