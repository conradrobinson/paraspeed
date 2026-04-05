import type Stringable from "../Stringable";

export default class Floor implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `floor(${this.value.string()})`   
    }
}