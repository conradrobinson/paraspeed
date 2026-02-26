
export type SchemaDefinition = Record<string, GPUDataType>;

export enum GPUDataType {
    F32,
    I32,
    VEC3F,
    VEC4F
}

export type InferGPUType<T extends GPUDataType> = 
    T extends GPUDataType.F32 ? number :
    T extends GPUDataType.I32 ? number :
    T extends GPUDataType.VEC3F ? [number, number, number] | Float32Array :
    T extends GPUDataType.VEC4F ? [number, number, number, number] | Float32Array :
    never;

export type SchemaPayload<T extends SchemaDefinition> = {
    [K in keyof T]: InferGPUType<T[K]>
};