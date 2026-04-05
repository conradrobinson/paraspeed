import type Stringable from "../Stringable";

export default class Arsinh implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `asinh(${this.value.string()})`   
    }
}