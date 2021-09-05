
export interface Comment {
    _id?: string,
    comment?: string,
    approved?: boolean,
    created_by?: any,
    //virtual attributes
    createdAgo?: any,
    createdDate?: any,
}