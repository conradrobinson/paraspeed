import type IBuffer from "./Buffers/IBuffer";

export default class BindGroup {
	public gpuBindGroup?: GPUBindGroup;
	constructor() {}
	setup(device: GPUDevice, pipeline: GPURenderPipeline, label: string, buffers: IBuffer[]) {
		const entries: GPUBindGroupEntry[] = buffers.map((x) => {
			return <GPUBindGroupEntry>{ binding: x.binding, resource: x.buffer };
		});
		this.gpuBindGroup = device.createBindGroup({
			label,
			layout: pipeline.getBindGroupLayout(0),
			entries: entries
		});
	}
}
