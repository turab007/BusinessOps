
interface IRead<T> {
    count: (cond: Object, params: Object) => void;
    retrieve: ()=> void;
    find: (cond: Object, pageQuery) => void;
    findAllByAttributes: (cond: Object) => void;
    findById: (_id: string) => void;    
    findByAttribute: (cond: Object) => void;
       
}

export = IRead;