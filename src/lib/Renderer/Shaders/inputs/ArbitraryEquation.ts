import type Stringable from "./Stringable";
import WGSLFloat from "./WGSLFloat";

export default class ArbitraryEquation implements Stringable {
    values: Stringable[];
    constructor(values: Stringable[]) {
        this.values = values;
    }
    string(): string {
        let output = "";
        for (const each of this.values) {
            output += each.string()
        }
        return output;
    }
    public static Default(): ArbitraryEquation {
        return new ArbitraryEquation([WGSLFloat.Default()]);
    }
}