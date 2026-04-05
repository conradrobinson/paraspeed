import type Stringable from "../Stringable";

export default class Arccos implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `acos(${this.value.string()})`   
    }
}