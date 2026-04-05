import type Stringable from "../Stringable";

export default class UserFunction implements Stringable {
    identifier: string;
    args: Stringable[];
    constructor(identifier: string, args: Stringable[]) {
        this.identifier = identifier;
        this.args = args
    }
    string(): string {
        const strings = this.args.map((e) => e.string())
        return `${this.identifier}(${strings.join(", ")})`
    }
}