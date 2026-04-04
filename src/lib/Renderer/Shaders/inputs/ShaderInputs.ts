import WGSLArray from "./WGSLArray";
import WGSLLines from "./WGSLLines";
import EquationDataStruct from "./EquationDataStruct";
import WGSLInt from "./WGSLInt";
import DerivedVar from "./DerivedVar";


export default class ShaderInputs {
    DERIVED_VARS: WGSLLines<DerivedVar>;
    NUMBER_EQUATIONS: WGSLInt;
    EQUATION_DATA: WGSLArray<EquationDataStruct>;
    constructor(derivedVars: WGSLLines<DerivedVar>, equationData: WGSLArray<EquationDataStruct>, numberEquations: number) {
        this.NUMBER_EQUATIONS = new WGSLInt(numberEquations);
        this.DERIVED_VARS = derivedVars;
        this.EQUATION_DATA = equationData;
    }
}
const emptyInputs = new ShaderInputs(
    new WGSLLines<DerivedVar>([]),
    new WGSLArray<EquationDataStruct>([EquationDataStruct.Default()]),
    0)

export {emptyInputs};