import type Stringable from "./Stringable";
import ArbitraryEquation from "./ArbitraryEquation";
export default class DerivedVar implements Stringable {
    identifier: string;
    value: ArbitraryEquation;
    constructor(identifier: string, value: ArbitraryEquation) {
        this.value = value;
        this.identifier = identifier;
    }
    string(): string {
        return `var ${this.identifier} = ${this.value.string()};`;
    }
    public static Default(): DerivedVar {
        return new DerivedVar('a', ArbitraryEquation.Default())
    }
}

