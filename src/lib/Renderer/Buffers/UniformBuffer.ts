import BufferObject from './BufferObject'
import type { SchemaDefinition } from '$lib/Renderer/Buffers/BufferData'
import type IBuffer from './IBuffer'
export default class UniformBuffer<T extends SchemaDefinition> extends BufferObject<T> implements IBuffer{
    constructor(binding: number, schema: T, device: GPUDevice, label: string) {
        super(binding, schema)
        this.buffer = device.createBuffer({
            label: label,
            size: this.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
    }

    
}