import type ShaderSource from "./ShaderSource";

export class Shader {
	shaderModule?: GPUShaderModule;
	private source: ShaderSource;
	private label: string;
    public safe: boolean = false;
	constructor(label: string, source: ShaderSource) {
		this.source = source;
		this.label = label;
	}
	public async createShader(device: GPUDevice) {
		this.shaderModule = device.createShaderModule({
			label: this.label,
			code: this.source.source
		});
		const compilationInfo = await this.shaderModule.getCompilationInfo();
        let foundError = false;
		if (compilationInfo.messages.length > 0) {
			for (const message of compilationInfo.messages) {
				if (message.type === 'error') {
                    foundError = true;
				}
			}
		}
            if (!foundError) {
                this.safe = true;
            }
	}
	
}
