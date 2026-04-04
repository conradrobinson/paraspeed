import ArbitraryEquation from "./ArbitraryEquation";
import type Stringable from "./Stringable";
import WGSLFloat from "./WGSLFloat";
import WGSLVec3Float from "./WGSLVec3Float";


export default class EquationDataStruct implements Stringable {
    value: ArbitraryEquation;
    colour: WGSLVec3Float;
    lineThickness: WGSLFloat;
    lineOpacity: WGSLFloat;
    constructor(value: ArbitraryEquation, colour: WGSLVec3Float, lineThickness: WGSLFloat, lineOpacity: WGSLFloat) {
        this.value = value;
        this.colour = colour;
        this.lineThickness = lineThickness;
        this.lineOpacity = lineOpacity;
    }
    string(): string {
        return `EquationData(${this.value.string()},${this.colour.string()},${this.lineThickness.string()},${this.lineOpacity.string()})`
    }
    public static Default(): EquationDataStruct {
        return new EquationDataStruct(ArbitraryEquation.Default(), WGSLVec3Float.Default(), WGSLFloat.Default(), WGSLFloat.Default());
    }
}