import ShaderFactory from "./ShaderFactory"
import ShaderSource from "./ShaderSource";
import { Shader } from "./Shader";

export default class ShaderFactoryStatic extends ShaderFactory {
    public static async createShader(path: string, label: string, device: GPUDevice) {
        const shaderString: string = await this.getShaderFile(path);
        const shader: Shader = new Shader(label, new ShaderSource(shaderString));
        await shader.createShader(device);
        return shader;   
    }
}