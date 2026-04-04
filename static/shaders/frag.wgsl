struct FragmentInput {
    @builtin(position) coords: vec4f,
};
struct EquationData {
    value: f32,
    colour: vec3f,
    line_thickness: f32,
    line_opacity: f32    
}
struct UniformData {
    left: f32,
    top: f32,
    right: f32,
    bottom: f32,
    pixelWidth: i32,
    pixelHeight: i32
}

fn getAlpha(data: EquationData) -> f32 {
    let dx = dpdx(data.value);
    let dy = dpdy(data.value);
    let gradient_length = length(vec2f(dx, dy));
    let pixel_distance = abs(data.value) / gradient_length;

    let softness = 1.0;
    let edge0 = data.line_thickness;
    let edge1 = data.line_thickness + softness;
    let alpha = 1- smoothstep(edge0, edge1, pixel_distance);
    return alpha * data.line_opacity;
}

@group(0) @binding(0) var<uniform> inputs: UniformData;
@fragment fn fs(positionInput: FragmentInput) -> @location(0) vec4f {
    //position handling
    var width = inputs.right - inputs.left;
    var height = inputs.top - inputs.bottom;
    var xRatio = positionInput.coords.x/f32(inputs.pixelWidth);
    var yRatio = positionInput.coords.y/f32(inputs.pixelHeight);
    var x = xRatio * f32(width) + f32(inputs.left);
    var y = f32(inputs.top) - yRatio * f32(height);
    
    {{DERIVED_VARS}}

    //define equations
    let numEqs = {{NUMBER_EQUATIONS}};
    if (numEqs == 0) {
        return vec4f(0.0,0.0,0.0,1.0);
    }
    let renderables = {{EQUATION_DATA}};
        
    

    //calculate final colour of pixel
    var outputColour = vec4f(vec3f(0),1);
    for (var i: i32 = 0; i < numEqs; i++) {
        outputColour = mix(outputColour, vec4(renderables[i].colour, 1), getAlpha(renderables[i]));
    }
    return outputColour;

}
