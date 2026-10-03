# Performance and benchmarks

Developer telemetry (backtick or Settings) shows presentation FPS, frame time, a rolling 1% low estimate, draw calls, triangle count, loaded textures, pending texture requests, reference frame and navigation mode. This uses actual requestAnimationFrame intervals and renderer.info; it does not fabricate GPU timing or memory counters.

Quality presets cap device pixel ratio: Cinematic 2, High 1.5, Balanced 1, Performance 0.75. GPU memory/utilization are unavailable through this renderer. The app exposes this limitation.

Settings → Record benchmark samples ten seconds of the current scene and downloads a JSON record. Run separately on Earth, Saturn, Jupiter and an outer-planet view. Measure on target hardware; a browser running through software WebGL is not representative of a gaming laptop. Volumetric, black-hole and galaxy benchmark routes are PLANNED.

Known constraints: all ten planet meshes are initialized eagerly. The 8K cloud and night maps can consume substantial decoded GPU memory; a texture-tier streaming pipeline is needed before lower-end hardware claims. Actual visible draw count is constrained by apparent-size culling. This finite ten-object catalogue can be scanned each frame; million-object datasets must use spatial indexing and workers.

Bounded rolling timing arrays contain 600 frames; asset promise cache contains only bundled maps. Repeated journeys reuse resources. No real 60-FPS claim is made until measured on target GPU hardware.
