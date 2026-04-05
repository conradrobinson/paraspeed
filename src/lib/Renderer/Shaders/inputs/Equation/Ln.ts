import type Stringable from "../Stringable";

export default class Ln implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `log(${this.value.string()})`   
    }
}