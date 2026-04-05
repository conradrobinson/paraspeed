import type Stringable from "../Stringable";

export default class Artanh implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `atanh(${this.value.string()})`   
    }
}