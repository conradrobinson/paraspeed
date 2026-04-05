import type Stringable from "../Stringable";

export default class Sign implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `sign(${this.value.string()})`   
    }
}