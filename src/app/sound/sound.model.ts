export interface ISound {
    name: string,
    duration: string
}

export class Sound {
    static lastId = 0;

    constructor(
        public id: number,
        public name: string,
        public duration: string
    ) {}
}