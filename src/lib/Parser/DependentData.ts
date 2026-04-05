import type Stringable from "$lib/Renderer/Shaders/inputs/Stringable";


export default class DependentData {
        referencedVariables: string[] = []
        //identifier, number of arguments
        referencedFunctions: [string,number][] = []
        syntaxTree?: Stringable;
        constructor() {

        }
}