import type Stringable from "../Stringable";

export default class Abs implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `abs(${this.value.string()})`   
    }
}