import EquationData from "./EquationData";
import ParserInput from "./ParserInput";
import type {ParserOutput} from "./ParserOutput";
import type { MathJsonExpression, MathJsonFunctionObject, MathJsonNumberObject, MathJsonSymbol, MathJsonSymbolObject } from "@cortex-js/compute-engine/math-json";
import {isFunctionObject, isSymbolObject} from "@cortex-js/compute-engine/math-json"
import ParsingConstants from "./ParsingConstants";
import FunctionData from "./FunctionData";
import LeafVariableData from "./LeafVariableData";
import DerivedVariableData from "./DerivedVariableData";
import type Stringable from "$lib/Renderer/Shaders/inputs/Stringable";
import Variable from "$lib/Renderer/Shaders/inputs/Equation/Variable";
import type DependentData from "./DependentData";
import WGSLInt from "$lib/Renderer/Shaders/inputs/WGSLInt";
import WGSLFloat from "$lib/Renderer/Shaders/inputs/WGSLFloat";
import UserFunction from "$lib/Renderer/Shaders/inputs/Equation/UserFunction";
import Abs from "$lib/Renderer/Shaders/inputs/Equation/Abs";
import Add from "$lib/Renderer/Shaders/inputs/Equation/Add";
import Arccos from "$lib/Renderer/Shaders/inputs/Equation/Arccos";
import Arcosh from "$lib/Renderer/Shaders/inputs/Equation/Arcosh";
import Arcsin from "$lib/Renderer/Shaders/inputs/Equation/Arcsin";
import Arctan from "$lib/Renderer/Shaders/inputs/Equation/Arctan";
import Arctan2 from "$lib/Renderer/Shaders/inputs/Equation/Arctan2";
import Arsinh from "$lib/Renderer/Shaders/inputs/Equation/Arsinh";
import Artanh from "$lib/Renderer/Shaders/inputs/Equation/Artanh";
import Ceil from "$lib/Renderer/Shaders/inputs/Equation/Ceil";
import Cos from "$lib/Renderer/Shaders/inputs/Equation/Cos";
import Cosh from "$lib/Renderer/Shaders/inputs/Equation/Cosh";
import Divide from "$lib/Renderer/Shaders/inputs/Equation/Divide";
import Exp from "$lib/Renderer/Shaders/inputs/Equation/Exp";
import Floor from "$lib/Renderer/Shaders/inputs/Equation/Floor";
import Ln from "$lib/Renderer/Shaders/inputs/Equation/Ln";
import Log2 from "$lib/Renderer/Shaders/inputs/Equation/Log2";
import Max from "$lib/Renderer/Shaders/inputs/Equation/Max";
import Min from "$lib/Renderer/Shaders/inputs/Equation/Min";
import Mod from "$lib/Renderer/Shaders/inputs/Equation/Mod";
import Multiply from "$lib/Renderer/Shaders/inputs/Equation/Multiply";
import Negate from "$lib/Renderer/Shaders/inputs/Equation/Negate";
import Power from "$lib/Renderer/Shaders/inputs/Equation/power";
import Rational from "$lib/Renderer/Shaders/inputs/Equation/Rational";
import Round from "$lib/Renderer/Shaders/inputs/Equation/Round";
import Sign from "$lib/Renderer/Shaders/inputs/Equation/Sign";
import Sin from "$lib/Renderer/Shaders/inputs/Equation/Sin";
import Sinh from "$lib/Renderer/Shaders/inputs/Equation/Sinh";
import Sqrt from "$lib/Renderer/Shaders/inputs/Equation/Sqrt";
import Subtract from "$lib/Renderer/Shaders/inputs/Equation/Subtract";
import Tan from "$lib/Renderer/Shaders/inputs/Equation/Tan";
import Tanh from "$lib/Renderer/Shaders/inputs/Equation/Tanh";


type fnType = [MathJsonSymbol, ...MathJsonExpression[]];

type ParserReturnType = [ParserOutput?, Error?]
export type { ParserReturnType }

export default class Parser {
    Parse(input: ParserInput): ParserReturnType {
        let output;
        if (this.isFunctional(input.mathJSON)) {
            const baseFn = this.getFunction(input.mathJSON)
            if (baseFn[0] == "Equal") {
                if (baseFn.length < 3) {
                    return [undefined, new Error("Not enough arguments around '='")];
                }
                const left: MathJsonExpression = baseFn[1]
                const right: MathJsonExpression = baseFn[2]
                //if the left side is a function, 
                if (this.isFunctional(left)) {
                    const leftFn = this.getFunction(left)
                    if (ParsingConstants.Arithmetic.functions.includes(leftFn[0])) {
                        //if the left function is in list of reserved functions
                        // - it must be a call
                        // - it must be an equation
                        //process the left side normally
                        const equation = this.processEquation({left, right})
                        if (equation[1] != undefined) {
                            return [undefined, equation[1]]
                        }
                        output = equation[0]
                        
                    } else {
                        //the left side is not a reserved function

                        if (this.isError(leftFn)) {
                            return [undefined, new Error("Illegal left argument to '='")]
                        }

                        //determine if it is a call or definition
                        let isDefinition = true;
                        for (let i = 1; i < leftFn.length; i++) {
                            if (!this.isSymbolic(leftFn[i])) {
                                isDefinition = false;
                            }
                        }
                        if (isDefinition) {
                            //is a function definition
                            output = new FunctionData()
                            output.identifier = leftFn[0]
                            output.parameters = leftFn.slice(1) as string[]
                        } else {
                            //is a user function call
                            //process as normal equation
                            const equation = this.processEquation({left, right})
                            if (equation[1] != undefined) {
                                return [undefined, equation[1]]
                            }
                            output = equation[0]
                        }
                    }
                }
                //if the left side is a symbol
                if (this.isSymbolic(left)) {
                    //is the left symbol a constant?
                    if (ParsingConstants.Arithmetic.constants.includes(this.getSymbol(left))) {
                        //yes, its reserved
                        //definitely an equation
                        const equation = this.processEquation({left, right})
                        if (equation[1] != undefined) {
                            return [undefined, equation[1]]
                        }
                        output = equation[0]
                    } else {
                        //the left symbol is a user defined variable
                        //so the right side is...
                        if (this.isNumeric(right)) {
                            //leaf variable
                            output = new LeafVariableData(this.getSymbol(left), this.getNumber(right));
                        }
                        
                        if (this.isFunctional(right)) {
                            //derived variable
                            //process right side
                            output = new DerivedVariableData();  
                            output.identifier = this.getSymbol(left)
                            const equation = this.processEquation({right})
                            if (equation[1] != undefined) {
                                return [undefined, equation[1]]
                            }
                            //merges the objects, with equation[0] overwriting
                            output = Object.assign({}, output, equation[0])
                            
                        }
                    }
                }
           } else {
                //must be an equation
                //does not have an equals at the top level
                const equation = this.processEquation({left: baseFn})
                if (equation[1] != undefined) {
                    return [undefined, equation[1]]
                }
                output = equation[0]
           }
        } else {
            //must be an equation
            //does not have an equals at the top level
            const equation = this.processEquation({left: input.mathJSON})
            if (equation[1] != undefined) {
                return [undefined, equation[1]]
            }
            output = equation[0]
            
            
        }
        return [output, undefined]
    }
    
    private parseExpression(expression: MathJsonExpression, output: DependentData): [Stringable, DependentData, Error?] {
        //takes in an expression
        // - a tree of functions, variables and numbers
        // and creates an AST from the leaves up
        if (this.isNumeric(expression)) {
            //number
            const num = this.getNumber(expression)
            if (Number.isInteger(num)) {
                return [new WGSLInt(num), output]
            }
            return [new WGSLFloat(num), output]
        }
        if (this.isSymbolic(expression)) {
            //variable
            //add it to our variable list
            output.referencedVariables.push(this.getSymbol(expression))
            return [new Variable(this.getSymbol(expression)), output]
        }
        //it is a function -> call them
        if (this.isFunctional(expression)) {
            const fn = this.getFunction(expression);
            const identifier = fn[0];
            const args: Stringable[] = []
            if (identifier == "Error") {
                return [WGSLFloat.Default(), output, new Error("Error found in parsing.")]
            }
            for (let i = 1; i < fn.length; i++) {
                const res = this.parseExpression(fn[i], output)
                if (res[2] != undefined) {
                    return [WGSLFloat.Default(), output, res[2]]
                }
                output = res[1];
                args.push(res[0])
            }
            if (!ParsingConstants.Arithmetic.functions.includes(identifier)) {
                //is a user defined func
                //add it to list of used funcs
                
                output.referencedFunctions.push([identifier, fn.length - 1])
                
                return [new UserFunction(identifier, args), output];
            } else {
                //reserved function, call it and do the big old switch case.
                switch (identifier) {
                    case "Abs":
                        return [new Abs(args[0]), output]
                    case "Add":
                        return [new Add(args), output]
                    case "Arccos":
                        return [new Arccos(args[0]), output]
                    case "Arcosh":
                        return [new Arcosh(args[0]), output]
                    case "Arcsin":
                        return [new Arcsin(args[0]), output]
                    case "Arctan":
                        return [new Arctan(args[0]), output]
                    case "Arctan2":
                        return [new Arctan2(args[0], args[1]), output]
                    case "Arsinh":
                        return [new Arsinh(args[0]), output]
                    case "Artanh":
                        return [new Artanh(args[0]), output]
                    case "Ceil":
                        return [new Ceil(args[0]), output]
                    case "Cos":
                        return [new Cos(args[0]), output]
                    case "Cosh":
                        return [new Cosh(args[0]), output]
                    case "Divide":
                        return [new Divide(args[0], args[1]), output]
                    case "Exp":
                        return [new Exp(args[0]), output]
                    case "Floor":
                        return [new Floor(args[0]), output]
                    case "Ln":
                        return [new Ln(args[0]), output]
                    case "Log2":
                        return [new Log2(args[0]), output]
                    case "Max":
                        return [new Max(args), output]
                    case "Min":
                        return [new Min(args), output]
                    case "Mod":
                        return [new Mod(args[0], args[1]), output]
                    case "Multiply":
                        return [new Multiply(args), output]
                    case "Negate":
                        return [new Negate(args[0]), output]
                    case "Power":
                        return [new Power(args[0], args[1]), output]
                    case "Rational":
                        return [new Rational(args[0], args[1]), output]
                    case "Round":
                        return [new Round(args[0]), output]
                    case "Sign":
                        return [new Sign(args[0]), output]
                    case "Sin":
                        return [new Sin(args[0]), output]
                    case "Sinh":
                        return [new Sinh(args[0]), output]
                    case "Sqrt":
                        return [new Sqrt(args[0]), output]
                    case "Subtract":
                        return [new Subtract(args[0], args[1]), output]
                    case "Tan":
                        return [new Tan(args[0]), output]
                    case "Tanh":
                        return [new Tanh(args[0]), output]
                    default:
                        //reserved function I do not supported
                        return [WGSLFloat.Default(), output, new Error(`Unsupported reserved function: '${identifier}'`)]                                                                                                                                 
                }
            }
        }
        return [WGSLFloat.Default(), output, new Error("Internal parsing error.")]
    }

    private processEquation(input: {left?: MathJsonExpression, right?: MathJsonExpression}): [EquationData, Error?] {
        //this slightly complicated logic allows passing in either left or right of an
        //equation or both and getting out the correct equation data
        let output = new EquationData()
        let leftStringable;
        let rightStringable;
        if (input.left != undefined) {
            const leftTree = this.parseExpression(input.left, output);
            if (leftTree[2] != undefined) {
                //error
                return [output, leftTree[2]]
            }
            output = leftTree[1]
            output.syntaxTree = leftTree[0]
            leftStringable = leftTree[0]
        }
        
        if (input.right != undefined) {
            const rightTree = this.parseExpression(input.right, output);
            if (rightTree[2] != undefined) {
                //error
                return [output, rightTree[2]]
            }
            output = rightTree[1]
            output.syntaxTree = rightTree[0]
            rightStringable = rightTree[0]
        }
        if (input.right != undefined && input.left != undefined) {
            const subtraction = new Subtract(leftStringable!, rightStringable!)
            output.syntaxTree = subtraction;
        }
        return [output]
    }


    private parseNum(num: string): number {
        if (num == "+Infinity") {
            return Infinity
        }
        if (num == "-Infinity") {
            return -Infinity
        }
        if (num == "NaN") {
            return NaN
        }
        return Number.parseFloat(num)
    }
    private isNumber(value: MathJsonExpression) : value is number {
        return typeof value == "number"
    }
    private isSymbol(value: MathJsonExpression) : value is MathJsonSymbol {
        return typeof value == "string"
    }
    private isFunction(value: MathJsonExpression) : value is fnType {
        return Array.isArray(value) && value.length > 0 && this.isSymbol(value[0])
    }
    
    private isNumeric(value: MathJsonExpression) : value is number | MathJsonNumberObject {
        return (this.isNumberObject(value) || this.isNumber(value))
    }
    private isSymbolic(value: MathJsonExpression) : value is MathJsonSymbol | MathJsonSymbolObject {
        return (isSymbolObject(value) || this.isSymbol(value))
    }
    private isFunctional(value: MathJsonExpression) : value is fnType | MathJsonFunctionObject {
        return (isFunctionObject(value) || this.isFunction(value))
    }
    private getSymbol(value: MathJsonSymbol | MathJsonSymbolObject) : MathJsonSymbol {
        if (this.isSymbol(value)) {
            return value;
        } else {
            return value.sym;
        }
    }
    private getNumber(value: number | MathJsonNumberObject) : number {
        if (this.isNumber(value)) {
            return value;
        } else {
            return this.parseNum(value.num);
        }
    }
    private getFunction(value: fnType | MathJsonFunctionObject) : fnType {
        if (this.isFunction(value)) {
            return value;
        } else {
            return value.fn;
        }
    }
    private isError(value: fnType) {
        return value[0] == "Error"
    }
    //Stolen from the @cortex-js/math-json lib as they don't export it for some reason
    private isNumberObject(expr: null | MathJsonExpression) {
        return expr !== null && typeof expr === "object" && "num" in expr;
    }

}