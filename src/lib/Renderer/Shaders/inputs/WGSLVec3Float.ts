import type Stringable from "./Stringable";
import WGSLFloat from "./WGSLFloat";

export default class WGSLVec3Float implements Stringable {
    x: WGSLFloat;
    y: WGSLFloat;
    z: WGSLFloat;
    
    constructor(x: WGSLFloat, y: WGSLFloat, z: WGSLFloat) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    string(): string {
        const string1 = this.x.string();
        const string2 = this.y.string();
        const string3 = this.z.string();
        return `vec3f(${string1},${string2},${string3})`;
    }
    public static Default(): WGSLVec3Float {
        return new WGSLVec3Float(WGSLFloat.Default(), WGSLFloat.Default(), WGSLFloat.Default())
    }
}

