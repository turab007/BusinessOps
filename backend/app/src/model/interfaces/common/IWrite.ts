
interface IWrite<T> {
    create: (item: T) => void;
    update: (_id: string, item: T) => void;
    findByIdAndUpdate: (_id: string, item: T) => void;
    delete: (_id: string) => void;
    deleteAllByAttributes: (cond: Object) => void;
}

export = IWrite;