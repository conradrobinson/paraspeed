import BindGroup from './BindGroup';
import { IUniformData } from './Buffers/IUniformData';
import UniformBuffer from './Buffers/UniformBuffer';
import { Shader } from './Shaders/Shader';

export class RenderingEngine {
	private context?: GPUCanvasContext;
	private device?: GPUDevice;
	private presentationFormat?: GPUTextureFormat;
	private renderPipeline?: GPURenderPipeline;
	private renderPassDescriptor?: GPURenderPassDescriptor;
	private vertexShader?: Shader;
	private fragmentShader?: Shader;
    private bindGroup?: BindGroup
	public ready: boolean = false;

    //buffers
    private uniformDataBuffer?: UniformBuffer<typeof IUniformData>;

    constructor() {
    }


	public async setupDevice() {
		if (!this.context) {
			console.error('No canvas context set in rendering engine');
			this.ready = false;
			return;
		}
		if (!navigator.gpu) {
			console.error('This browser does not support WebGPU');
			return;
		}

		const adapter = await navigator.gpu.requestAdapter();
		if (!adapter) {
			console.error('This browser supports webgpu but it appears disabled');
			return;
		}

		this.device = await adapter.requestDevice();

		this.device.lost.then((info) => {
			console.error(`WebGPU device was lost: ${info.message}`);
			this.ready = false;
			if (info.reason !== 'destroyed') {
				this.setupDevice();
			}
		});
		this.ready = await this.init();
	}

	private async init() {
		if (!this.device) {
			return false;
		}
		if (!this.context) {
			console.error('No canvas context set in rendering engine');
			return false;
		}
		//inits the shaders and render pipeline
		//and the presentation format

		this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		//set canvas presentation format as the best possible one
		this.context?.configure({ device: this.device, format: this.presentationFormat });
		//shaders
		this.fragmentShader = new Shader('/shaders/frag.wgsl', 'Main fragment shader');
		this.vertexShader = new Shader('/shaders/vert.wgsl', 'Basic vertex shader');
		//wait for all shaders to fetch their string src and compile
		await Promise.all([
			this.fragmentShader.createShader(this.device),
			this.vertexShader.createShader(this.device)
		]);
		//if any of them failed to compile then exit this function
		if (!this.fragmentShader.safe || !this.vertexShader.safe) {
			return false;
		}

		//create a render pipeline
		this.renderPipeline = this.device.createRenderPipeline({
			label: 'Main render pipeline',
			layout: 'auto',
			vertex: {
				module: this.vertexShader.shaderModule!
			},
			fragment: {
				module: this.fragmentShader.shaderModule!,
				targets: [{ format: this.presentationFormat }]
			}
		});
        //buffers
        this.uniformDataBuffer = new UniformBuffer(0, IUniformData, this.device, "Uniform Data Buffer")

        
        //bindgroup
        this.bindGroup = new BindGroup()
        this.bindGroup.setup(this.device, this.renderPipeline, "Main bind group", [this.uniformDataBuffer])


		const colorAttachments: GPURenderPassColorAttachment[] = [
			{
				view: this.context.getCurrentTexture().createView(),
				clearValue: { r: 0, g: 0, b: 0, a: 1.0 }, //clears to black
				loadOp: 'clear',
				storeOp: 'store'
			}
		];

		this.renderPassDescriptor = {
			label: 'Render Pass Descriptor',
			colorAttachments: colorAttachments
		};
        //ensure all objects are now instantiated
		return this.checkGPUObjects();
	}

	public setContext(context: GPUCanvasContext) {
		this.context = context;
	}

	public renderTick() {
		if (!this.device) {
			this.ready = false;
			return;
		}
		if (!this.context) {
			this.ready = false;
			return;
		}
        if (!this.bindGroup?.gpuBindGroup) {
            this.ready = false;
            return;
        }

        this.uniformDataBuffer?.writeToGPU(this.device, {
            left: -100,
            right: 100,
            top: 100,
            bottom: -100,
            pixelWidth: window.innerWidth,
            pixelHeight: window.innerHeight
        });
		(this.renderPassDescriptor!.colorAttachments as GPURenderPassColorAttachment[])[0]!.view = this.context
			.getCurrentTexture()
			.createView();
        const encoder = this.device.createCommandEncoder({label: "Render Pass Encoder"})
        const pass = encoder.beginRenderPass(this.renderPassDescriptor!);
        pass.setPipeline(this.renderPipeline!)
        pass.setBindGroup(0, this.bindGroup!.gpuBindGroup!);
        pass.draw(6);
        pass.end()

        const commandBuffer = encoder.finish()
        this.device.queue.submit([commandBuffer])
	}

    private checkGPUObjects() : boolean {
        return (this.context && this.device && this.presentationFormat && this.renderPassDescriptor && this.renderPipeline && this.fragmentShader && this.vertexShader && this.vertexShader.safe && this.fragmentShader.safe) ?? false
    }
}
