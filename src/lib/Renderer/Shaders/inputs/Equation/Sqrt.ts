import type Stringable from "../Stringable";

export default class Sqrt implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `sqrt(${this.value.string()})`   
    }
}