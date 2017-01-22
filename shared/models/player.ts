export default class Player {
    private id: number;
    private name: string;

    constructor(_id: number, _name: string) {
        this.id = _id;
        this.name = _name;
    }

    getId(): number {
        return this.id;
    }

    setName(_name: string) {
        this.name = _name;
    }

    getName(): string {
        return this.name;
    }
}