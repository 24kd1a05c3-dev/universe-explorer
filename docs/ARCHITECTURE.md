# Architecture

The workspace contained only an empty Git repository. There was no application, dependency graph, asset pipeline, or reusable renderer to audit.

Chosen stack: strict TypeScript, Vite, Three.js WebGL 2, GLSL, and a restrained DOM interface. React is unnecessary for this shell. The rendering loop never depends on framework reconciliation.

- `data/catalog.ts`: normalized supported bodies, measurement provenance, aliases and JPL elements.
- `engine/astronomy.ts`: explicit units, Kepler solution, scientific-to-render transformation.
- `engine/assets.ts`: deduplicated texture promises and ownership/disposal.
- `engine/universe.ts`: scene lifecycle, time, camera, travel, visibility and telemetry.
- `engine/shaders.ts`: Earth shading, atmosphere and reconstructed rings.
- `main.ts`: search, modal keyboard navigation, controls, journeys, sound and benchmark exports.

CPU simulation is evaluated in float64 kilometer positions. The GPU only receives camera-relative normalized geometry. Destination travel computes its endpoint from the current simulation epoch every frame; rapid travel requests replace the previous path. Keyboard input interrupts autopilot. No per-destination scene allocations occur after startup.

All body meshes share the same rendering lifecycle. App shutdown cancels animation, removes listeners via AbortController, disconnects ResizeObserver, disposes geometry/materials/textures and closes audio. Late texture responses are disposed by their owner. WebGL context loss reports a recovery instruction.

Next architecture milestone: extract flight and navigation into separate controllers, replace local eager map loading with a capped streaming scheduler, add real stellar catalogue ingestion, hierarchical frames and indexed spatial chunks. Deep-space reconstructions require independently sourced morphology constraints before implementation.
