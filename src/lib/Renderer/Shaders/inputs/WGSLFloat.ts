import type Stringable from "./Stringable";

export default class WGSLFloat implements Stringable {
    value: number;
    constructor(value: number) {
        this.value = value
    }
    string(): string {
        const output = this.value.toString();
        return `f32(${output})`;
    }
    public static Default(): WGSLFloat {
        return new WGSLFloat(0)
    }

}

