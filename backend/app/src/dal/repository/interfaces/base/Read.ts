interface Read<T> {
    count: (cond?: Object)=> void;
    retrieve: ()=> void;
    find: (cond: Object) => void;
    findAllByAttributes: (cond: Object) => void;
    findById: (id: string) => void;    
    findByAttribute: (cond: Object) => void;
} 

export = Read;
