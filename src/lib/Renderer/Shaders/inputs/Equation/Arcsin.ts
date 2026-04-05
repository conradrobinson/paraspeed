import type Stringable from "../Stringable";

export default class Arcsin implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `asin(${this.value.string()})`   
    }
}