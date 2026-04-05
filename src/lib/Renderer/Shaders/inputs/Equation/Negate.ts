import type Stringable from "../Stringable";

export default class Negate implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `(-${this.value.string()})`   
    }
}