
export interface Applet {
    _id? :string,
    name?: string,
    description?: string,
    status?: boolean,
    weight?: number,
    module_type?: string,
    work_spaces?: any[],
    created_by?: any,
    updated_by?: string,

    //virtual elements
    personal?: string,
}