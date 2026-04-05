import type Stringable from "../Stringable";

export default class Max implements Stringable {
    values: Stringable[];
    constructor(values: Stringable[]) {
        this.values = values;
    }
    string(): string {
        //4
        //max(max(max(a,c),b),c)
        let output = ""
        for (let i = 0; i < this.values.length-1; i++) {
            output += "max("
        }
        output += this.values[0].string()
        for (let i = 1; i < this.values.length; i++) {
            output += `,${this.values[i].string()})`
        }
        return output
    }
}