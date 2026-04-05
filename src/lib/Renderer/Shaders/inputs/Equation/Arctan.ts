import type Stringable from "../Stringable";

export default class Arctan implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `atan(${this.value.string()})`   
    }
}