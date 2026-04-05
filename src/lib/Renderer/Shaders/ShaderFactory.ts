

export default class ShaderFactory {
    //caches shader sources
    static sources: Record<string, string> = {}

    protected static async getShaderFile(path: string) {
    if (path in ShaderFactory.sources) {
      return ShaderFactory.sources[path];
    }
    const source: string = await (await fetch(path)).text()
    ShaderFactory.sources[path] = source;
		return source;
	}
}