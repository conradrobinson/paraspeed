import type Stringable from "./Stringable";


export default class WGSLLines<T extends Stringable> implements Stringable {
    values: T[];
    constructor(values: T[]) {
        this.values = values;
    }
    string(): string {
        const lines: string[] = this.values.map((e) => e.string())
        const output = lines.join("\n")
        return output + "\n"
    }

}