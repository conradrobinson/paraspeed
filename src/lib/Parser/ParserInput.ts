import type {MathJsonExpression} from '@cortex-js/compute-engine/math-json'


export default class ParserInput {
    mathJSON: MathJsonExpression;
    constructor(mathJSON: MathJsonExpression) {
        this.mathJSON = mathJSON;
    }
}