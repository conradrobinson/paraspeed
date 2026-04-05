import type Stringable from "../Stringable";

export default class Log2 implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `log2(${this.value.string()})`   
    }
}