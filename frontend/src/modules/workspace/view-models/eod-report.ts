export interface EodReport {
    _id?: string,
    report: string,
    date: string,
    work_space?: any,

    created_at?: number,
    updated_at?: number,
    created_by?: any,
    updated_by?: any,
    //virtual attributes
    createdAgo?: any,

}