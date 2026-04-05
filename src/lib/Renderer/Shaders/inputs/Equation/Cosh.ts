import type Stringable from "../Stringable";

export default class Cosh implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `cosh(${this.value.string()})`   
    }
}