import type Stringable from "../Stringable";

export default class Cos implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `cos(${this.value.string()})`   
    }
}