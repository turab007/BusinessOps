/**
 * 
 * @class Pagination
 */
class Pagination {

    private _defaultPageSize: number = 10000;

    /**
     * Page Size
     */
    private _pageSize: number;

    get pageSize(): number { return this._pageSize; }

    set pageSize(pageSize: number) { this._pageSize = pageSize; }


    /**
     * Page Number
     */
    private _pageNumber: number;

    get pageNumber(): number { return this._pageNumber; }

    set pageNumber(pageNumber: number) { this._pageNumber = pageNumber; }

    /**
     * Skip records/rows
     */
    private _skipRecords: number;

    get skipRecords(): number { return this._skipRecords; }

    set skipRecords(skipRecords: number) { this._skipRecords = skipRecords; }

    /**
     * query json 
     * {
     *      pageSize: 20,
     *      currentPage: 1
     * }
     */
    private _Query: any[];

    /**
     * @constant
     * @param query object
     */
    constructor(query) {

        this._Query = query;

        this._pageSize = (this._Query && this._Query['pageSize'] ? this._Query['pageSize'] : this._defaultPageSize)

        console.log(this._Query);
        console.log(this._pageSize);

        this._pageNumber = (this._Query && this._Query['currentPage'] ? this._Query['currentPage'] : 1)

        this._skipRecords = (this._pageNumber - 1) * this._pageSize;

    }

}

export = Pagination;