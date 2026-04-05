import type Stringable from "../Stringable";

export default class Ceil implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `ceil(${this.value.string()})`   
    }
}