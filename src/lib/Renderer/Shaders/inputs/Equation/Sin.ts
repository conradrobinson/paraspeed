import type Stringable from "../Stringable";

export default class Sin implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `sin(${this.value.string()})`   
    }
}