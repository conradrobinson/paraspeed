

export default class ShaderFactory {
    //TODO add caching
    protected static async getShaderFile(path: string) {
		return (await fetch(path)).text();
	}
}