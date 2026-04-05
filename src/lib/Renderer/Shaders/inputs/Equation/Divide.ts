import type Stringable from "../Stringable";

export default class Divide implements Stringable {
    value1: Stringable;
    value2: Stringable;
    constructor(value1: Stringable, value2: Stringable) {
        this.value1 = value1;
        this.value2 = value2;
    }
    string(): string {
        return `(${this.value1.string()}/${this.value2.string()})`   
    }
}