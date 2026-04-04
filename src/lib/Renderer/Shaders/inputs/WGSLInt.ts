import type Stringable from "./Stringable";

export default class WGSLInt implements Stringable {
    value: number;
    constructor(value: number) {
        this.value = value
    }
    string(): string {
        return this.value.toFixed(0);
    }
    public static Default(): WGSLInt {
        return new WGSLInt(0);
    }

}

