export class Sound {
    static lastId = 0;

    private _id: number;

    constructor(
        public name: string,
        public duration: string
    ) {
        this._id = ++Sound.lastId;
    }

    public get id() {
        return this._id;
    }
}