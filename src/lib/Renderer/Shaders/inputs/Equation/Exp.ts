import type Stringable from "../Stringable";

export default class Exp implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `exp(${this.value.string()})`   
    }
}