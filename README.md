# Atlas — Real Universe Explorer

A full-screen, real-time WebGL universe explorer with 61,450 real catalogue stars and nine galaxy destinations. The universe is the canvas: observation-derived maps, directional sunlight, Earth atmosphere and night lights, inertial free flight, and cinematic destination travel.

## Run

Requires Node.js 22.12+ (validated with 24.15).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Production: `npm run build`, then `npx vite preview --host 127.0.0.1`.

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

Drag to look/orbit. WASD enters free flight; Q/E moves vertically; Shift accelerates. Scroll zooms in orbit and changes speed in free flight. `/` opens destination search; Enter travels. F focuses the current target, H hides the interface, M opens the Solar System map, Space pauses orbital time, backtick toggles developer telemetry. Fullscreen and sound are explicit toolbar controls. UI fades after inactivity. Settings include reduced motion, quality, exposure, sensitivity, and benchmark export.

This milestone includes volumetric reconstructed galaxies, HYG catalogue stars, and a Blender-authored Saturn asset. See [deep-space data and limitations](docs/DEEP_SPACE.md). It is not the complete observable-universe product. Moon positions, rotation orientation, cloud distribution, Saturn rings and camera travel have documented approximations. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for limitations.

Planet maps: [Solar System Scope / INOVE](https://www.solarsystemscope.com/textures/), CC BY 4.0; enhanced colors and reconstructed mapping gaps are retained as metadata. Earth day map: NASA-derived Three.js example `earth_atmos_2048.jpg`. [JPL approximate orbital elements](https://ssd.jpl.nasa.gov/planets/approx_pos.html) provide the eight planetary-system positions, valid 1800–2050. Radii and rotation periods use [NASA planetary fact sheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/). No credentials or backend services are required.

