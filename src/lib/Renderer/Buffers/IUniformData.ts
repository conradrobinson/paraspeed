
import { GPUDataType } from "./BufferData"
export const IUniformData = {
    left: GPUDataType.F32,
    top: GPUDataType.F32,
    right: GPUDataType.F32,
    bottom: GPUDataType.F32,
    pixelWidth: GPUDataType.I32,
    pixelHeight: GPUDataType.I32
} as const