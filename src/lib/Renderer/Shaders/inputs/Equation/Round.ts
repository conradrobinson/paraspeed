import type Stringable from "../Stringable";

export default class Round implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `round(${this.value.string()})`   
    }
}