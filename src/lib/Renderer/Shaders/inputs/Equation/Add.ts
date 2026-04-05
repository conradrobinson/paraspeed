import type Stringable from "../Stringable";

export default class Add implements Stringable {
    values: Stringable[];
    constructor(values: Stringable[]) {
        this.values = values;
    }
    string(): string {
        const strings = this.values.map((e) => e.string())
        return `(${strings.join(" + ")})`
    }
}