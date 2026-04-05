import type DerivedVariableData from "./DerivedVariableData";
import type EquationData from "./EquationData";
import type FunctionData from "./FunctionData";
import type LeafVariableData from "./LeafVariableData";
type ParserOutput = LeafVariableData | FunctionData | DerivedVariableData | EquationData
export type {ParserOutput}