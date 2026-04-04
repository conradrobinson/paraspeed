import type Stringable from "./Stringable";

export default class InjectedString implements Stringable {
    value: string;
    constructor(value: string){
        this.value = value;
    }
    string(): string {
        return this.value;
    }
    public static Default(): InjectedString {
        return new InjectedString("");
    }
}