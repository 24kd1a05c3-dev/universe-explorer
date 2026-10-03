# Rendering pipeline

WebGL 2, logarithmic depth, ACES tone mapping, sRGB output, native MSAA. Surface maps stream from local files and are owned by Assets. Shader Earth converts color textures to linear light, applies sunlight, night-side emission, static cloud density, an approximate ocean specular term and lit limb color. A slightly enlarged shell provides a view-angle atmosphere approximation. This is not full atmospheric ray integration.

Solar bodies use textured Phong surfaces; Sun uses an emissive appearance. Tilted Saturn rings use reconstructed radial bands, a Cassini-gap approximation, variable opacity and analytic sphere-shadow testing. Ring shadows on the planet, close-up particle transitions and physically constrained ring photometry are planned.

Each frame evaluates apparent radius/distance and culls bodies below a threshold. The image star environment rotates with the view; it is not a procedural particle universe. GPU geometry quality is currently fixed per body; preset changes control pixel resolution. Fine-grained LOD, texture tiers, dynamic resolution and WebGPU are not implemented.

No motion blur, chromatic aberration or bloom is applied. Exposure is user adjustable. Cinematic framing aims slightly off the target center, retains orbit inertia, and hides navigation UI after inactivity. Reduced motion disables idle orbit and travel interpolation.
