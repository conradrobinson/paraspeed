export class Shader {
	shaderModule?: GPUShaderModule;
	private path: string;
	private shaderString?: string;
	private label: string;
    public safe: boolean = false;
	constructor(path: string, label: string) {
		this.path = path;
		this.label = label;
	}
	public async createShader(device: GPUDevice) {
		this.shaderString = await this.getShaderFile();
		this.shaderModule = device.createShaderModule({
			label: this.label,
			code: this.shaderString
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
	private async getShaderFile() {
		return (await fetch(this.path)).text();
	}
}
