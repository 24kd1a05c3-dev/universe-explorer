# MASTER BUILD PROMPT — CINEMATIC REAL UNIVERSE EXPLORER

You are the principal engineer, rendering architect, scientific-computing engineer, technical artist, and product owner for this project.

Your task is to DESIGN AND BUILD a production-quality, real-time, cinematic **Real Universe Explorer**.

This is NOT:

- an astronomy dashboard
- an educational website
- a collection of NASA images
- a planet encyclopedia
- a simple Three.js demo
- a static solar-system model
- a fictional space game
- a procedural fantasy universe
- a collection of pre-rendered videos

It should feel like the user has somehow been given a spacecraft/camera capable of traveling through the **real known universe**.

The emotional target is:

> I cannot physically travel through the universe, so make my computer give me the closest credible cinematic experience possible.

The application should evoke the enormous scale, darkness, silence, violence, beauty, loneliness, and mystery of space.

The user should be able to begin near Earth and travel outward through:

Earth  
→ Moon  
→ Solar System  
→ heliosphere  
→ nearby stars  
→ stellar systems  
→ Milky Way  
→ nebulae  
→ star-forming regions  
→ stellar remnants  
→ pulsars  
→ black holes  
→ globular clusters  
→ satellite galaxies  
→ Local Group  
→ nearby galaxies  
→ galaxy groups  
→ galaxy clusters  
→ superclusters  
→ quasars / AGN  
→ large-scale cosmic structure  
→ observable-universe context

without the experience turning into a conventional dashboard.

---

# 1. NON-NEGOTIABLE SCIENTIFIC RULE

## DO NOT INVENT THE UNIVERSE.

Every named astronomical object presented as real must correspond to a genuine astronomical object or scientifically recognized structure.

Examples:

- Sun
- Mercury
- Venus
- Earth
- Moon
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune
- Pluto
- Voyager spacecraft where appropriate
- Proxima Centauri
- Alpha Centauri system
- Sirius
- Betelgeuse
- Rigel
- Polaris
- TRAPPIST-1
- Kepler systems
- catalogued exoplanets
- Orion Nebula
- Eagle Nebula
- Pillars of Creation
- Crab Nebula
- Helix Nebula
- Carina Nebula
- Horsehead Nebula
- Sagittarius A*
- known stellar-mass black holes
- M31 / Andromeda
- Triangulum Galaxy
- Magellanic Clouds
- Messier galaxies
- NGC objects
- Virgo Cluster
- other catalogued galaxy clusters
- known quasars
- scientifically supported large-scale structures

Do not procedurally generate fictional named planets, stars, galaxies, civilizations, alien structures, or nebulae and silently mix them with real astronomy.

Procedural rendering MAY be used to reconstruct the appearance of real objects where observational data are incomplete.

That distinction is critical.

---

# 2. OBSERVATION VS RECONSTRUCTION

Astronomy does not provide literal close-range photographs of most objects.

Therefore establish an explicit internal provenance system.

Every rendered object should conceptually belong to one of these categories:

```text
OBSERVATION
OBSERVATION_DERIVED
PHYSICALLY_RECONSTRUCTED
SIMULATED_PHENOMENON
POSITIONAL_CATALOG_DATA
```

The application may use cinematic reconstruction, but never misrepresent reconstruction as direct photography.

For example:

A nebula may use real observations as the foundation for volumetric reconstruction.

A black hole may use measured mass/spin constraints where available and a physically based rendering model.

An exoplanet may use measured orbital and physical properties, but unknown continents must NOT be represented as scientifically known geography.

Accuracy applies to the underlying universe.

Cinematic quality applies to how that information is rendered.

---

# 3. EXPERIENCE PHILOSOPHY

The application should behave more like an interactive astronomical film than traditional software.

When launched:

NO giant dashboard.

NO analytics cards.

NO sidebar full of statistics.

NO bright SaaS interface.

NO obvious game HUD.

Instead:

```text
black screen

subtle stars emerge

camera stabilizes above Earth

sunlight catches the atmosphere

Earth slowly rotates

extremely restrained interface fades in

user gains control
```

The universe should dominate the screen.

UI should disappear automatically when not being used.

---

# 4. VISUAL DIRECTION

Target:

**high-end grounded science-fiction cinematography applied to real astronomy.**

Do not directly copy copyrighted movie shots, spacecraft, interfaces, music, or proprietary visual designs.

Develop an original cinematic language.

Important visual qualities:

- overwhelming astronomical scale
- physically plausible lighting
- deep blacks
- high dynamic range
- subtle bloom
- stellar glare
- realistic exposure adaptation
- enormous planetary silhouettes
- atmospheric scattering
- volumetric dust
- volumetric nebula reconstruction
- star temperature coloration
- physically plausible shadows
- ring shadows
- eclipse lighting
- realistic orbital motion
- subtle lens effects
- relativistic effects where relevant
- gravitational lensing
- black-hole accretion visualization
- enormous dynamic range
- restrained chromatic aberration
- cinematic camera inertia
- cinematic motion blur where appropriate
- temporal anti-aliasing if architecture permits
- high-quality texture filtering
- background star density
- Milky Way structure
- cosmic-scale transitions

Avoid the cheap appearance of:

```text
random glowing particles
+ excessive bloom
+ giant colorful spheres
+ generic space skybox
```

Space should often be dark.

That darkness is part of the experience.

---

# 5. CORE USER EXPERIENCE

The fundamental interaction is:

```text
EXPLORE
```

The user controls a free cinematic camera.

Provide:

```text
WASD
mouse look
vertical movement
speed adjustment
cinematic acceleration
cinematic deceleration
orbit target
focus target
follow target
free flight
pause
resume
time scale
```

Navigation must work across astronomical scales.

Movement cannot feel like a normal FPS camera.

Implement smooth acceleration and inertial damping.

---

# 6. "TAKE ME TO" SYSTEM

Provide an extremely minimal search experience.

Example:

```text
TAKE ME TO SAGITTARIUS A*
```

or:

```text
TAKE ME TO ANDROMEDA
```

or:

```text
TAKE ME TO PILLARS OF CREATION
```

or:

```text
TAKE ME TO BETELGEUSE
```

or:

```text
TAKE ME TO TON 618
```

if the requested object exists in the supported scientific catalogue.

The system resolves the astronomical object.

Then perform a cinematic journey.

Do NOT simply teleport instantly unless the user chooses instant travel.

Possible transition:

```text
camera aligns
↓
acceleration begins
↓
local objects streak subtly
↓
scale representation changes
↓
intermediate astronomical context passes
↓
camera decelerates
↓
destination emerges
↓
camera enters orbital/flyby mode
```

The transition must conceal changes between rendering coordinate systems and LOD layers.

---

# 7. CINEMATIC AUTOPILOT

Create an optional mode:

```text
CINEMATIC JOURNEY
```

The application becomes an autonomous astronomical documentary without narration.

Example journey:

```text
Earth orbit
↓
Moon
↓
Mars
↓
Jupiter
↓
Saturn rings
↓
outer Solar System
↓
heliosphere
↓
interstellar neighborhood
↓
Orion region
↓
Orion Nebula
↓
Galactic plane
↓
Milky Way overview
↓
Sagittarius A*
↓
Magellanic Clouds
↓
Andromeda
↓
Local Group
↓
Virgo Cluster
↓
large-scale structure
```

Transitions should be carefully choreographed.

Camera motion should have film-like composition rather than random movement.

---

# 8. SCALE IS THE PRIMARY ENGINEERING PROBLEM

The system needs to represent scales spanning many orders of magnitude.

A naïve world-coordinate system will fail.

Do NOT store the entire observable universe in ordinary GPU float world coordinates.

Architect a hierarchical coordinate system.

Consider:

```text
UniverseSpace
GalaxySpace
StellarNeighborhoodSpace
SystemSpace
PlanetarySpace
LocalSurfaceSpace
```

Use high precision CPU-side positions where necessary.

Use camera-relative rendering.

Investigate:

- floating origin
- origin rebasing
- hierarchical reference frames
- split high/low precision coordinates
- logarithmic depth buffers
- reversed-Z
- camera-relative coordinates
- scale-relative rendering
- coordinate normalization
- local scene transforms

Near-camera geometry should retain high precision.

Far-away astronomical structures should not require meter-level coordinates.

---

# 9. ASTRONOMICAL REFERENCE FRAMES

Design the data layer so celestial coordinates are not arbitrary XYZ positions.

Support appropriate transformations between astronomical coordinate systems.

Potential representations include:

```text
ICRS
right ascension
declination
distance
heliocentric coordinates
barycentric coordinates
galactic coordinates
ecliptic coordinates
local rendering coordinates
```

Separate:

```text
scientific coordinate
```

from:

```text
render coordinate
```

Never allow graphics-engine convenience to corrupt scientific positioning.

---

# 10. LEVEL OF DETAIL ARCHITECTURE

The renderer must NEVER attempt to render the entire universe at full fidelity.

Implement hierarchical LOD.

Conceptually:

```text
Observable Universe
    ↓
large-scale structure representation
    ↓
galaxy clusters
    ↓
individual galaxies
    ↓
galactic structures
    ↓
stellar neighborhoods
    ↓
star systems
    ↓
planetary systems
    ↓
planet/moon
    ↓
local detail
```

Only the appropriate representation should be active at each scale.

Use:

- spatial partitioning
- octrees where appropriate
- BVH where appropriate
- GPU instancing
- frustum culling
- distance culling
- apparent-size culling
- hierarchical LOD
- asynchronous asset streaming
- texture streaming
- worker threads
- lazy loading
- caching
- procedural reconstruction only where scientifically justified

The transition between LODs should be visually invisible whenever possible.

---

# 11. STAR RENDERING

Stars cannot simply be white dots.

Use available catalog properties such as:

```text
position
distance
apparent magnitude
absolute magnitude
spectral type
temperature
luminosity
radius
```

when available.

Derive visually appropriate:

```text
brightness
color temperature
apparent angular size
glare
```

Do not exaggerate star sizes arbitrarily at close range without a rendering reason.

At galactic scale, billions of stars cannot be represented individually.

Use hierarchical stellar-density representations.

Closer regions may transition into actual catalogued stars.

---

# 12. SOLAR SYSTEM

The Solar System should be the highest-fidelity initial region.

Include:

- Sun
- planets
- major moons
- dwarf planets where practical
- planetary rings
- asteroid-belt representation
- Kuiper-belt representation
- relevant spacecraft trajectories later if supported

Use real orbital parameters where feasible.

Support time evolution.

Planetary positions should be computed rather than permanently hardcoded.

Planet rotation should also be represented where feasible.

---

# 13. EARTH

Earth is the opening benchmark.

It must immediately establish quality.

Target:

- physically convincing sphere
- high-resolution surface textures
- cloud layer
- atmospheric scattering
- night lights where scientifically appropriate
- sunlight terminator
- ocean response
- cloud shadows if performance permits
- limb glow
- correct orientation
- cinematic orbital camera

Do not bury Earth under excessive bloom.

---

# 14. GAS GIANTS

Jupiter and Saturn should be major showcase destinations.

Jupiter:

- atmospheric banding
- Great Red Spot positioning when data permits
- cloud motion approximation
- limb shading
- storms
- major moons
- eclipses
- shadows

Saturn:

- high-resolution ring structure
- ring transparency
- ring shadows on Saturn
- Saturn shadow across rings
- ring particle illusion at closer scales
- major moons
- atmospheric banding

Ring transitions must avoid revealing flat low-resolution textures.

---

# 15. NEBULAE

Nebulae are critical.

Do NOT represent them as flat billboards once the camera approaches.

Use real astronomical observations as source material when licensing permits.

Create volumetric reconstruction.

Potential techniques:

- sparse 3D density volumes
- ray marching
- signed density fields
- layered volumetric textures
- emission maps
- absorption maps
- procedural depth inference constrained by observation
- adaptive sampling
- temporal accumulation

Performance is critical.

The result should remain anchored to the observed object.

Examples:

```text
Orion Nebula
Carina Nebula
Eagle Nebula
Crab Nebula
Helix Nebula
Horsehead region
```

Do not invent arbitrary giant colorful clouds.

---

# 16. BLACK HOLES

Black holes should be among the most technically impressive destinations.

Where scientifically justified, support:

- gravitational lensing
- photon-ring approximation
- accretion disk
- relativistic Doppler effects
- gravitational redshift approximation
- disk warping
- background star distortion

Do NOT render a black hole as a black sphere with an orange ring.

Implement shader-based lensing.

Start with a physically motivated approximation.

Architecture should permit future improvement toward Kerr black-hole visualization.

Differentiate:

```text
black-hole event horizon
accretion disk
lensed disk image
background lensing
jets where applicable
```

Not every black hole should automatically have a giant bright accretion disk.

---

# 17. RELATIVISTIC VISUALIZATION

If high-speed travel modes are added, do not claim visual effects are scientifically exact unless they are.

Potential optional effects:

- aberration
- Doppler shift
- relativistic beaming
- time-scale visualization

These should be physically motivated rather than generic warp-speed streaks.

---

# 18. GALAXIES

At large distances, use observational imagery where appropriate.

As the camera approaches, transition to volumetric/particle/structural reconstruction.

Galaxy rendering should include conceptual components:

```text
stellar disk
bulge
dust lanes
star-forming regions
halo
globular cluster population
```

Spiral galaxies should not simply be rotating PNG files.

At close scale, individual catalogued regions/stars may progressively replace aggregate rendering.

---

# 19. MILKY WAY

The Milky Way deserves a dedicated hierarchy.

At Solar-System scale:

render local stellar neighborhood.

At intermediate scale:

render nearby catalogued stars plus stellar density.

At galactic scale:

render Milky Way structure.

Transition continuously between these representations.

The user should eventually be able to pull away far enough to perceive our position within the galaxy.

Do not imply that we possess an external photograph of the Milky Way.

Any external Milky Way view must be identified internally as reconstruction.

---

# 20. EXOPLANETS

Only use confirmed/catalogued exoplanets.

Use actual known parameters when available:

```text
host star
orbital period
semi-major axis
eccentricity
mass
minimum mass
radius
equilibrium temperature estimates
discovery method
```

Unknown surface geography must not be presented as observed fact.

If surface rendering is required, mark it internally as reconstruction.

The scientific uncertainty model must survive all the way to the renderer.

---

# 21. COSMIC SCALE

The experience should eventually allow enormous zoom-out.

At those scales, transition away from individual objects.

Possible hierarchy:

```text
stars
→ galaxy
→ galaxy group
→ cluster
→ supercluster-scale context
→ large-scale cosmic structure
```

Do not pretend that a conventional 3D photograph exists for the entire observable universe.

Large-scale structure must be data-driven or explicitly reconstructed.

---

# 22. TIME

Add a simulation clock architecture.

Potential controls:

```text
1×
10×
100×
1000×
pause
reverse where meaningful for visualization
```

Do not fake orbital mechanics merely by rotating everything at arbitrary rates.

For the MVP, accurate orbital calculations for the Solar System are more important than arbitrary time travel.

---

# 23. DATA ARCHITECTURE

Keep scientific data separate from rendering code.

Create normalized object models.

Example:

```ts
interface CelestialObject {
  id: string;
  name: string;
  aliases: string[];

  category:
    | "star"
    | "planet"
    | "moon"
    | "dwarf_planet"
    | "exoplanet"
    | "nebula"
    | "black_hole"
    | "galaxy"
    | "galaxy_cluster"
    | "quasar"
    | "stellar_remnant"
    | "other";

  coordinates: AstronomicalCoordinates;

  distance?: Measurement;
  radius?: Measurement;
  mass?: Measurement;

  provenance: DataProvenance[];

  renderProfile: RenderProfile;
}
```

Every significant numerical value should be capable of retaining:

```text
value
unit
source
uncertainty
epoch
```

where relevant.

---

# 24. DATA SOURCES

Design adapters for authoritative public astronomical data sources.

Potential sources include official datasets and services from organizations/projects such as:

- NASA
- ESA
- Gaia
- SIMBAD
- VizieR
- NASA Exoplanet Archive
- JPL
- Hubble archives
- JWST observation archives
- ESO
- other authoritative astronomical catalogues

Do NOT scrape random astronomy blogs for core scientific data.

Cache and normalize external data.

Do not make the renderer dependent on hundreds of live network requests every frame.

---

# 25. DATA PIPELINE

Architect:

```text
External astronomy source
        ↓
ingestion adapter
        ↓
validation
        ↓
unit normalization
        ↓
coordinate normalization
        ↓
provenance metadata
        ↓
local optimized dataset
        ↓
runtime spatial index
        ↓
renderer
```

Data ingestion should be reproducible.

Create scripts for refreshing datasets.

---

# 26. TECHNOLOGY DIRECTION

Choose the exact stack after inspecting the repository and machine constraints.

For a browser-first implementation, strongly consider:

```text
TypeScript
React / Next.js
Three.js or direct WebGL/WebGPU where justified
React Three Fiber only where it does not obstruct low-level optimization
GLSL / WGSL shaders
Web Workers
IndexedDB/cache where useful
```

However:

DO NOT force React abstractions into performance-critical rendering loops.

The renderer should have clear separation from the application UI.

If WebGPU materially improves the architecture and target browsers support the required functionality, design an abstraction allowing WebGPU progression.

Do not rewrite everything into experimental technology merely because it is newer.

---

# 27. RENDERING ARCHITECTURE

Separate:

```text
Simulation
Astronomy Data
Coordinate System
Scene Graph
LOD
Asset Streaming
Renderer
Post Processing
Camera
Navigation
UI
Audio
Telemetry
```

Avoid a monolithic component containing the entire universe.

Suggested conceptual structure:

```text
src/
  app/
  engine/
    camera/
    coordinates/
    rendering/
    shaders/
    lod/
    streaming/
    simulation/
    physics/
    astronomy/
    spatial/
    time/
  data/
    adapters/
    catalogs/
    cache/
  scenes/
    earth/
    solar-system/
    stellar/
    galactic/
    extragalactic/
  ui/
  audio/
  workers/
  tests/
```

Adapt this to the existing repository rather than blindly replacing everything.

---

# 28. GPU PERFORMANCE

Assume the user may run this on a gaming laptop rather than a workstation.

Target:

```text
60 FPS ideal
30 FPS acceptable under extremely heavy scenes
```

Provide quality tiers:

```text
CINEMATIC
HIGH
BALANCED
PERFORMANCE
```

Do not simply reduce everything globally.

Scale individual features:

- ray-march steps
- shadow quality
- texture resolution
- star density
- volumetric resolution
- particle density
- post-processing
- antialiasing
- lensing quality

Implement dynamic resolution if appropriate.

---

# 29. MEMORY

Avoid loading enormous astronomy catalogues into the browser at once.

Use:

- binary packed formats where justified
- spatial chunks
- streaming
- compression
- worker parsing
- caching
- eviction
- texture disposal
- geometry disposal
- GPU resource lifecycle management

Explicitly prevent memory leaks.

Every loaded astronomical region must have a lifecycle.

---

# 30. ASYNCHRONOUS STREAMING

Travel must not freeze while assets load.

Create predictive streaming.

When camera trajectory indicates movement toward a destination:

```text
resolve destination
↓
determine upcoming spatial regions
↓
prefetch catalogs
↓
prefetch textures
↓
prepare shaders
↓
prepare destination LOD
↓
transition
```

Fallback gracefully if high-resolution assets are unavailable.

Never display an empty screen because one asset request failed.

---

# 31. CINEMATIC CAMERA

Camera behavior is critical.

Implement:

- inertia
- acceleration curves
- smooth damping
- orbit mode
- tracking
- dolly movement
- automatic framing
- target approach
- flyby
- reveal shots
- controlled roll
- FOV transitions
- exposure transitions

Avoid nausea-inducing instantaneous rotation.

Autopilot should compose shots.

For example, approaching Saturn should not aim directly at its center for the entire journey.

Use offset trajectories that reveal the ring plane dramatically.

---

# 32. CAMERA SCALE TRANSITIONS

When crossing reference-frame boundaries:

```text
planetary → system
system → stellar
stellar → galactic
galactic → extragalactic
```

the user should NOT notice a coordinate reset.

Perform origin rebasing and LOD swaps behind cinematic movement.

This is one of the core technical challenges.

---

# 33. POST PROCESSING

Use restraint.

Potential stack:

```text
HDR
tone mapping
bloom
exposure adaptation
motion blur
TAA/FXAA/SMAA depending architecture
subtle lens flare
depth effects only where physically meaningful
```

Avoid:

- excessive bloom
- RGB split everywhere
- fake film scratches
- constant lens dirt
- oversaturated nebulae
- videogame HUD effects

The image should feel expensive rather than flashy.

---

# 34. AUDIO

Space itself is not transmitting cinematic sound to an observer like an atmosphere would.

Therefore audio should be treated as **artistic interpretation**, not physical sound propagation.

Use:

- extremely restrained ambient score
- low-frequency cinematic textures
- UI feedback
- optional sonification of scientific data later

Do not fill every scene with explosions.

Provide:

```text
PURE SILENCE MODE
CINEMATIC AUDIO MODE
```

---

# 35. USER INTERFACE

Minimal.

Possible overlay:

```text
EARTH
12,742 km diameter

[optional tiny controls]
```

Then fade away.

Search may appear with:

```text
/
```

or another simple shortcut.

UI should never compete with the universe.

---

# 36. INFORMATION MODE

Scientific information is allowed but OPTIONAL.

When requested, show restrained data.

Example:

```text
BETELGEUSE
Alpha Orionis

Distance: ~...
Type: Red supergiant
```

Never force encyclopedia text during exploration.

The default experience is visual.

---

# 37. LOADING EXPERIENCE

Do not show:

```text
Loading... 42%
```

over a generic spinner unless absolutely necessary.

Use astronomical transition sequences to hide loading.

If initial loading is required:

```text
darkness
subtle stars
short title
initial assets stream
Earth fades into view
```

---

# 38. ERROR HANDLING

If an object cannot be resolved:

Do not crash.

Return something like:

```text
OBJECT NOT FOUND IN CURRENT CATALOG
```

Offer scientifically relevant matching names.

Network failure must not destroy the current scene.

---

# 39. OFFLINE / CACHE STRATEGY

After assets are fetched, cache appropriate resources.

Core Solar System experience should eventually be capable of working without continuous dependence on external APIs.

External astronomical APIs are ingestion sources, not rendering servers.

---

# 40. FIRST-RUN EXPERIENCE

First run:

```text
black

stars

Earth appears slowly

camera is ~orbital distance

sun rises behind Earth

atmosphere illuminates

UI:

DRAG TO LOOK
WASD TO MOVE
SCROLL TO CHANGE TRAVEL SPEED

then UI fades
```

No lengthy tutorial.

---

# 41. PERFORMANCE TELEMETRY

Development mode should expose:

```text
FPS
frame time
draw calls
triangles
GPU memory estimate
loaded chunks
active stars
active volumetrics
LOD level
camera reference frame
streaming queue
```

Production UI keeps this hidden.

Provide a developer toggle.

---

# 42. DEBUGGING TOOLS

Create development visualizers for:

- reference frames
- LOD boundaries
- octree/spatial cells
- bounding volumes
- active chunks
- object coordinates
- origin rebasing
- camera speed
- astronomical distance
- GPU resource count

This project will be impossible to debug efficiently without them.

---

# 43. TESTING

Do not treat rendering as untestable.

Test:

### Mathematics

- coordinate conversion
- astronomical units
- parsecs
- light years
- distance scaling
- quaternion orientation
- orbital calculations
- reference-frame transformations

### Data

- catalogue validation
- missing values
- malformed data
- unit conversions
- provenance preservation

### Engine

- origin rebasing
- LOD selection
- chunk loading
- chunk eviction
- resource disposal

### Application

- destination search
- travel
- pause/resume
- settings persistence
- failure states

---

# 44. NUMERICAL PRECISION

Explicitly investigate catastrophic floating-point precision.

A camera traveling from:

```text
Earth orbit
```

to:

```text
intergalactic distances
```

cannot rely on one ordinary float coordinate system.

Document the chosen precision strategy.

Write tests specifically designed to expose precision failure.

---

# 45. SECURITY

If backend services exist:

- validate parameters
- sanitize external data
- rate limit expensive endpoints
- do not expose secrets
- store API credentials in environment variables
- provide `.env.example`
- never commit credentials

---

# 46. ACCESSIBILITY

Even though this is highly visual:

- keyboard navigation for UI
- reduced motion mode
- configurable camera sensitivity
- configurable bloom
- configurable motion blur
- high-contrast minimal UI
- readable text
- disable flashing effects

---

# 47. RESPONSIVE DESIGN

Primary target:

```text
desktop/laptop
```

Mobile may receive a reduced experience later.

Do not compromise desktop cinematic quality to force feature parity on low-end phones.

---

# 48. QUALITY SETTINGS

Implement intelligent presets.

## CINEMATIC

Maximum quality.

## HIGH

High visual fidelity with sensible optimizations.

## BALANCED

Target stable frame rate.

## PERFORMANCE

Aggressive optimization.

Allow manual overrides.

---

# 49. BENCHMARK SCENES

Create benchmark routes.

### Benchmark A

Earth orbit.

### Benchmark B

Saturn ring flyby.

### Benchmark C

dense stellar region.

### Benchmark D

volumetric nebula.

### Benchmark E

black-hole lensing.

### Benchmark F

galaxy-scale scene.

Record:

```text
average FPS
1% low FPS
frame time
draw calls
memory
loading latency
```

---

# 50. VISUAL QUALITY BAR

Reject implementations that look like:

```text
Three.js beginner solar system tutorial
```

Reject:

```text
simple spheres + star texture
```

Reject:

```text
CSS dashboard surrounding a tiny canvas
```

Reject:

```text
random particle universe
```

The renderer itself is the product.

---

# 51. SCIENTIFIC QUALITY BAR

Never invent precision.

If a value is uncertain, preserve uncertainty.

If the 3D morphology of an object is unknown, do not imply exact knowledge.

If colors are wavelength mappings rather than human-visible colors, retain metadata allowing this distinction.

The user wants reality, not fabricated certainty.

---

# 52. INITIAL IMPLEMENTATION STRATEGY

Do NOT attempt the entire observable universe in one commit.

Build vertically.

## PHASE 0 — REPOSITORY AUDIT

Before changing anything:

1. inspect every relevant file
2. identify current stack
3. run the project
4. inspect build errors
5. inspect dependencies
6. inspect rendering code
7. inspect asset pipeline
8. inspect performance
9. identify reusable work
10. create architecture plan

Do NOT delete working code simply because you prefer another stack.

---

# 53. PHASE 1 — ENGINE FOUNDATION

Build:

- rendering canvas
- render loop
- camera
- cinematic camera controller
- coordinate abstraction
- floating-origin/reference-frame architecture
- scene lifecycle
- asset manager
- resource disposal
- quality settings
- performance monitor
- error boundaries

Verify everything before continuing.

---

# 54. PHASE 2 — EARTH EXPERIENCE

Make Earth spectacular.

Required:

- Earth
- Sun lighting
- atmosphere
- cloud layer
- night side
- rotation
- cinematic camera
- orbital movement
- HDR/tone mapping
- quality presets

This becomes the visual benchmark.

Do not move forward with a broken Earth scene.

---

# 55. PHASE 3 — SOLAR SYSTEM

Add:

```text
Sun
Mercury
Venus
Earth
Moon
Mars
Jupiter
Saturn
Uranus
Neptune
```

Then relevant moons.

Use astronomical scale abstraction.

Add cinematic travel between planets.

---

# 56. PHASE 4 — STELLAR NEIGHBORHOOD

Integrate a real star catalogue subset.

Implement:

- coordinate conversion
- stellar color
- magnitude
- distance
- GPU point rendering
- instancing
- LOD
- spatial chunks

Allow:

```text
Earth → Proxima Centauri
```

without destroying coordinate precision.

---

# 57. PHASE 5 — SEARCH + AUTOPILOT

Implement object registry and resolver.

Add:

```text
TAKE ME TO <OBJECT>
```

Build cinematic path planning.

Add prefetching.

---

# 58. PHASE 6 — NEBULA ENGINE

Choose one real nebula first.

Build the volumetric rendering system around it.

Do NOT add twenty low-quality nebulae.

One extraordinary nebula is better than twenty billboards.

---

# 59. PHASE 7 — BLACK-HOLE ENGINE

Implement one scientifically grounded showcase.

Focus on:

- lensing
- accretion
- background distortion
- performance

Then generalize.

---

# 60. PHASE 8 — MILKY WAY

Implement hierarchical galactic representation.

Connect local star rendering to galaxy-scale rendering.

The transition must be seamless.

---

# 61. PHASE 9 — EXTRAGALACTIC SPACE

Add real galaxies.

Start with:

```text
Andromeda
Magellanic Clouds
Triangulum
```

then expand catalogues.

---

# 62. PHASE 10 — COSMIC SCALE

Implement galaxy groups/clusters and data-driven large-scale representations.

Do this only after lower scales work correctly.

---

# 63. PHASE 11 — CINEMATIC JOURNEYS

Build curated routes.

Examples:

```text
THE SOLAR SYSTEM
BIRTH AND DEATH OF STARS
BLACK HOLES
THE MILKY WAY
GALACTIC NEIGHBORS
EDGE OF THE OBSERVABLE UNIVERSE
```

These are camera journeys through real astronomical objects, not prerecorded movies.

---

# 64. CODE QUALITY

Use strict TypeScript where applicable.

Avoid:

```text
any
giant components
duplicated constants
magic numbers
hidden coordinate conversions
silent unit conversion
unbounded request loops
GPU resource leaks
unhandled promises
```

Document complex mathematics.

Simple code does not need essays.

Complex coordinate/rendering code DOES need explanation.

---

# 65. UNITS

Create explicit unit handling.

Never mix:

```text
meters
kilometers
AU
light-years
parsecs
```

implicitly.

Use named conversion functions or typed wrappers.

Unit mistakes at astronomical scale can silently destroy the simulation.

---

# 66. FRAME BUDGET

At 60 FPS:

\[
T_{frame} \approx 16.67\text{ ms}
\]

Treat this as a budget.

Track:

```text
CPU simulation
catalog processing
culling
draw submission
GPU rendering
volumetrics
post processing
```

Move heavy CPU processing away from the main thread when appropriate.

---

# 67. SPATIAL COMPLEXITY

Never iterate across the entire astronomical catalogue every frame.

A naïve implementation of:

\[
O(N)
\]

per-frame scanning becomes unacceptable as \(N\) grows into millions.

Use spatial indexes and hierarchical visibility systems so runtime work primarily depends on visible/relevant regions.

---

# 68. RESOURCE MANAGEMENT

Every resource must have ownership.

Track:

```text
textures
buffers
materials
geometry
framebuffers
workers
network requests
timers
event listeners
```

Dispose them correctly.

Repeated interstellar travel must not continuously increase memory usage.

---

# 69. CONCURRENCY EDGE CASES

Protect against:

- user changing destination during streaming
- stale asynchronous responses
- destination assets loading after cancellation
- duplicate texture loads
- workers returning obsolete data
- LOD changes while assets are loading
- scene disposal during network activity
- race conditions in cache mutation

Use cancellation/abort mechanisms.

---

# 70. TRAVEL EDGE CASES

Handle:

- target inside current system
- extremely distant target
- unknown distance
- incomplete coordinates
- object too large for ordinary orbit camera
- object without close-up reconstruction
- target behind camera
- user manually interrupting autopilot
- rapid repeated destination requests

---

# 71. RENDERING EDGE CASES

Watch for:

- Z-fighting
- near-plane clipping
- far-plane precision
- star flickering
- aliasing
- transparent ring sorting
- volumetric banding
- ray-march noise
- temporal ghosting
- overexposure
- shader compilation stalls
- texture seams
- floating-origin jitter

---

# 72. DEVELOPMENT PRINCIPLE

Never respond to a hard rendering problem by replacing it with a fake UI mockup.

Solve the engine problem.

If a feature is too expensive, implement an approximation and document it.

If data are unavailable, represent uncertainty.

If something cannot yet be built correctly, create the architecture for it rather than pretending it works.

---

# 73. NO PLACEHOLDER-HELL

Temporary placeholders are acceptable during development.

They must be clearly tracked.

Do not finish a phase with:

```text
TODO
fake data
random values
placeholder planet
temporary button
mock API
```

and claim production readiness.

Maintain:

```text
docs/IMPLEMENTATION_STATUS.md
```

containing:

```text
COMPLETE
PARTIAL
PLACEHOLDER
BLOCKED
PLANNED
```

for major systems.

---

# 74. DOCUMENTATION

Maintain:

```text
README.md
docs/ARCHITECTURE.md
docs/ASTRONOMY_DATA.md
docs/COORDINATE_SYSTEM.md
docs/RENDERING_PIPELINE.md
docs/PERFORMANCE.md
docs/IMPLEMENTATION_STATUS.md
```

README must contain exact commands to run the project.

---

# 75. AUTOMATED VALIDATION

After meaningful changes:

```text
install
lint
typecheck
test
build
```

Run the actual application where possible.

Inspect browser console.

Fix warnings that indicate real defects.

Do not claim success based solely on code compilation.

---

# 76. VISUAL VALIDATION

For every major rendering milestone:

Run the application.

Inspect visually.

Check:

```text
Earth limb
planet edges
star brightness
camera clipping
Saturn rings
nebula volume
black-hole distortion
galaxy LOD transitions
```

Do not assume visual code works because TypeScript compiles.

---

# 77. PERFORMANCE VALIDATION

Profile.

Do not guess.

Measure:

```text
frame time
draw calls
GPU utilization where available
CPU load
memory growth
network requests
shader stalls
```

Fix the largest bottleneck first.

---

# 78. PRODUCT PRIORITY

When forced to choose between:

```text
more destinations
```

and:

```text
better rendering
```

choose better rendering for the important destinations.

When forced to choose between:

```text
more UI
```

and:

```text
better universe
```

choose the universe.

When forced to choose between:

```text
fiction
```

and:

```text
scientific uncertainty
```

choose scientific uncertainty.

---

# 79. TARGET EMOTIONAL MOMENTS

Design specifically for moments like:

### EARTH DEPARTURE

Earth slowly shrinks behind the camera.

### JUPITER APPROACH

Jupiter grows from a bright point into something filling the field of view.

### SATURN RING CROSSING

The camera approaches the ring plane until individual structure becomes apparent.

### INTERSTELLAR DARKNESS

The Solar System disappears and the sense of emptiness becomes overwhelming.

### NEBULA

The camera gradually enters a real stellar nursery reconstruction.

### BLACK HOLE

Background stars begin distorting before the black hole dominates the frame.

### GALACTIC REVEAL

The camera escapes the Milky Way's local representation and the galaxy becomes comprehensible as a structure.

### ANDROMEDA

A faint object gradually becomes an enormous galaxy.

### COSMIC SCALE

Individual galaxies become points within enormous structures.

These moments are more important than conventional feature count.

---

# 80. FINAL EXPERIENCE

The finished application should eventually allow me to sit in a dark room, put on headphones, launch fullscreen and spend an hour simply traveling through the known universe.

I should be able to search:

```text
Saturn
```

and travel there.

Then:

```text
Orion Nebula
```

and travel there.

Then:

```text
Sagittarius A*
```

and travel there.

Then:

```text
Andromeda
```

and travel there.

The application should continuously adjust scale, coordinate systems, rendering techniques, LOD and asset streaming behind the scenes.

I should not have to think about any of that.

I should simply feel that I am traveling.

---

# 81. WHAT I EXPECT FROM YOU AS CODEX

Do not merely explain how I could build this.

BUILD IT.

Do not stop after producing an architecture document.

Do not stop after creating a landing page.

Do not replace difficult rendering features with screenshots.

Do not create fake functionality.

Work iteratively through the repository.

For each phase:

```text
1. inspect
2. understand
3. plan
4. implement
5. run
6. test
7. visually inspect
8. profile
9. fix
10. document
11. continue
```

If you encounter an error:

Investigate it.

Do not abandon the implementation and provide generic instructions to me unless human action is genuinely required.

---

# 82. FIRST ACTION

Start immediately.

First inspect the entire repository.

Determine:

```text
existing stack
folder structure
current functionality
rendering architecture
dependencies
assets
performance issues
broken functionality
technical debt
```

Then produce a concise implementation plan.

After that, begin **Phase 1 immediately**.

Do not wait for confirmation after merely explaining the plan unless there is a genuinely destructive or irreversible decision requiring human approval.

---

# 83. MVP SUCCESS CRITERIA

The first serious milestone is complete only when I can:

1. launch the application
2. enter fullscreen
3. see a high-quality Earth
4. freely move the cinematic camera
5. change travel speed
6. move outward from Earth
7. see the Moon and Solar System context
8. select another real Solar System object
9. initiate cinematic travel
10. arrive without obvious coordinate instability
11. maintain acceptable performance
12. see no fake dashboard dominating the experience

After this is stable, expand outward.

---

# 84. NORTH STAR

Whenever uncertain about a design decision, return to this requirement:

**This is not a website about the universe.**

**This is an attempt to make the user feel physically present inside the real known universe.**

The scientific database provides truth.

The rendering engine provides presence.

The camera provides scale.

The sound design provides emotion.

The architecture makes the illusion survive astronomical distances.

Build accordingly.

BEGIN BY INSPECTING THE REPOSITORY AND IMPLEMENTING THE FOUNDATION.