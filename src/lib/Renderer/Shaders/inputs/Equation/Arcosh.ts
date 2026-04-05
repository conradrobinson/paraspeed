import type Stringable from "../Stringable";

export default class Arcosh implements Stringable {
    value: Stringable;
    constructor(value: Stringable) {
        this.value = value;
    }
    string(): string {
        return `acosh(${this.value.string()})`   
    }
}