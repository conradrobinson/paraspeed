import DependentData from "./DependentData";


export default class FunctionData extends DependentData {
    identifier?: string
    //TODO might need to make custom parameters names
    // so x and y dont overlap
    parameters?: string[]
    constructor() {
        super();
    }
}