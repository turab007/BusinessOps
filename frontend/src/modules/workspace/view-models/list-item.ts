
export interface ListItem {
      _id?: string,
    name?: string,
    weight?:number,
    list_id?: any,
    description?: string,
    done?: boolean,
    created_by?: any

    //virutal variables
    // displaySettings?: boolean
    is_editAble?:boolean
}