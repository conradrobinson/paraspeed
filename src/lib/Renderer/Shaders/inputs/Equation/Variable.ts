import type Stringable from "../Stringable";


export default class Variable implements Stringable {
    identifier: string;
    constructor(identifier: string) {
        this.identifier = identifier;
    }
    string(): string {
        return this.identifier;
    }
}