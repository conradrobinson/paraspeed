import type Stringable from "../Stringable";

export default class Sinh implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `sinh(${this.value.string()})`   
    }
}