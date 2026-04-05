import type Stringable from "../Stringable";

export default class Tanh implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `tanh(${this.value.string()})`   
    }
}