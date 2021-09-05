export interface Attachment {

    _id?: string,
    originalname: string,
    filename: string,
    path: string,
    created_by?: any
    created_at?: number,
    size: number,
    encoding: string,
    mimetype: string,
    destination: string,
    //virtual attributes
    createdAgo?: any,
}