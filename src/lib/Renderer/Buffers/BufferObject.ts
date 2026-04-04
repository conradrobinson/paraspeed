import { GPUDataType } from '$lib/Renderer/Buffers/BufferData';
import type { SchemaDefinition, SchemaPayload } from '$lib/Renderer/Buffers/BufferData';
import type IBuffer from './IBuffer';

export default class BufferObject<T extends SchemaDefinition> implements IBuffer {
	public binding: number;
	protected arrayBuffer: ArrayBuffer;
	private view: DataView;
	private offset = 0;
	public buffer?: GPUBuffer;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private offsets: Record<keyof T, number> = {} as any;
	private schema: T;

	constructor(binding: number, schema: T) {
		this.binding = binding;
		this.schema = schema;

		for (const key in schema) {
			const type = schema[key];
			this.offsets[key] = this.offset;
			switch (type) {
				case GPUDataType.F32:
					this.calcOffset(4, 4);
					break;
				case GPUDataType.I32:
					this.calcOffset(4, 4);
					break;
				case GPUDataType.VEC3F:
					this.calcOffset(12, 16);
					break;
				case GPUDataType.VEC4F:
					this.calcOffset(16, 16);
					break;
			}
		}

		const structLeftover = this.offset % 16;
		if (structLeftover !== 0) {
			this.offset += 16 - structLeftover;
		}
		this.arrayBuffer = new ArrayBuffer(this.offset);
		this.view = new DataView(this.arrayBuffer);
	}

	public writeToGPU(device: GPUDevice, data: SchemaPayload<T>) {
		this.setData(data);
		// this.printHex(this.arrayBuffer)
		if (this.buffer) {
			device.queue.writeBuffer(this.buffer, 0, this.arrayBuffer);
		} else {
			console.warn('Tried to write to GPU, but the buffer is not initialized!');
		}
	}

	private setData(data: SchemaPayload<T>) {
		for (const key in this.schema) {
			const type = this.schema[key];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const value = data[key] as any;

			switch (type) {
				case GPUDataType.F32:
					this.setF32(key, value);
					break;
				case GPUDataType.I32:
					this.setI32(key, value);
					break;
				case GPUDataType.VEC3F:
					this.setVec3f(key, value[0], value[1], value[2]);
					break;
				case GPUDataType.VEC4F:
					this.setVec4f(key, value[0], value[1], value[2], value[3]);
					break;
			}
		}
	}

	public setF32(key: keyof T, value: number) {
		this.view.setFloat32(this.offsets[key], value, true);
	}

	public setI32(key: keyof T, value: number) {
		this.view.setInt32(this.offsets[key], value, true);
	}

	public setVec3f(key: keyof T, x: number, y: number, z: number) {
		const offset = this.offsets[key];
		this.view.setFloat32(offset, x, true);
		this.view.setFloat32(offset + 4, y, true);
		this.view.setFloat32(offset + 8, z, true);
	}

	public setVec4f(key: keyof T, x: number, y: number, z: number, w: number) {
		const offset = this.offsets[key];
		this.view.setFloat32(offset, x, true);
		this.view.setFloat32(offset + 4, y, true);
		this.view.setFloat32(offset + 8, z, true);
		this.view.setFloat32(offset + 12, w, true);
	}

	private calcOffset(size: number, alignment: number) {
		const leftover = this.offset % alignment;
		const padding = alignment - leftover;
		if (padding % alignment != 0) {
			this.offset += padding + size;
		} else {
			this.offset += size;
		}
	}

	printHex(buffer: ArrayBuffer, length?: number) {
		// 1. Create a view. This does NOT copy or detach the buffer.
		// We use the length written (this.offset) so we don't print empty trailing memory.
		const view = new Uint8Array(buffer, 0, length ?? buffer.byteLength);

		let hexString = '';
		for (let i = 0; i < view.length; i++) {
			// Convert to Hex and ensure 2 digits (e.g., '0' becomes '00')
			hexString += view[i].toString(16).padStart(2, '0').toUpperCase() + ' ';

			// Add a visual separator every 4 bytes (one 32-bit word)
			if ((i + 1) % 4 === 0) hexString += '| ';

			// Add a newline every 16 bytes for readability
			if ((i + 1) % 16 === 0) hexString += '\n';
		}

		console.log('--- Buffer Hex Dump ---');
		console.log(hexString);
		console.log('-----------------------');
	}
}
