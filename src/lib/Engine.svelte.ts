import { RenderingEngine } from "./Renderer/RenderingEngine"
import ShaderFactory from "./Renderer/Shaders/ShaderFactory";

class Engine {
    renderingEngine: RenderingEngine = new RenderingEngine();
    shaderFactory: ShaderFactory = new ShaderFactory("./shaders/frag.wgsl");
    
    

	constructor() {}

    async setup(canvas: HTMLCanvasElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext('webgpu')
        if (!context) {
            return;
        }
        this.renderingEngine.setContext(context)
        await this.renderingEngine.setupDevice()
        this.tick();
    }

    tick() {
        if (!this.renderingEngine.ready) {
            return;
        }
        this.renderingEngine.renderTick();

        requestAnimationFrame(this.tick.bind(this))
    }
}

export default new Engine()
