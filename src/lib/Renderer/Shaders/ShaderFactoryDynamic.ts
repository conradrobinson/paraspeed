import ShaderFactory from "./ShaderFactory";
import ShaderSource from "./ShaderSource";
import { Shader } from "./Shader";
import type ShaderInputs from "./inputs/ShaderInputs";

export default class ShaderFactoryDynamic extends ShaderFactory {
    public static async createShader(path: string, label: string, device: GPUDevice, shaderInput: ShaderInputs): Promise<Shader> {
        const shaderString: string = await this.getShaderFile(path);
        const source: ShaderSource = this.generateSource(shaderString, shaderInput);
        const shader: Shader = new Shader(label, source);
        await shader.createShader(device);
        return shader;
    }

    private static generateSource(shaderString: string, shaderInput: ShaderInputs): ShaderSource {
        const keys = Object.keys(shaderInput);
        for (const key of keys) {
            shaderString = shaderString.replace(`{{${key}}}`, shaderInput[key as keyof ShaderInputs].string())
        }
        return new ShaderSource(shaderString);
    }
    
}