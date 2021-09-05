
export interface WorkSpace {
    _id?:string,
    name: string,
    description: string,
    space_type?:string,
    lists_count?: number,
    groups_count?: number,
    users_count?: number,
    bg_color?: string,
    read_only?: boolean,
    is_active?: boolean,
    personal?: boolean,
    users?: any[],
    modules?: any[]
    roles?: any[],
    created_by?: any,
    updated_by?: string,

    user_role?:any[]

}