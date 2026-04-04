import type Stringable from "./Stringable";


export default class WGSLArray<T extends Stringable> implements Stringable {
    values: T[];
    constructor(values: T[]) {
        this.values = values;
    }
    string(): string {
        let output = "array(";
        for (let i = 0; i < this.values.length-1; i++) {
            output += this.values[i].string();
            output += ", ";
        }
        //add the last value to the array if it exists
        if (this.values.length > 0) {
            output += this.values[this.values.length-1].string()
        }
        output += ")"
        return output;
    }
}