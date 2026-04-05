import type Stringable from "../Stringable";

export default class Tan implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `tan(${this.value.string()})`   
    }
}