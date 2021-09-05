export interface Role {
    _id?: string,
    name: string;
    description?: string,
    permissions?: any[],
    work_spaces?: any[]
}