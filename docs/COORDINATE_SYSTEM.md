# Coordinate system and precision

Scientific coordinates are J2000 heliocentric ecliptic positions in kilometers. Elements use AU and degrees explicitly; `AU_KM` converts to kilometers only at the solver boundary. Three.js uses Y-up; the mapping is `(X, Z, -Y)`.

Camera state remains a float64 vector on the CPU. Each frame computes `(objectKm - cameraKm) / kmPerUnit` **before** uploading the position to GPU float32. The rendering camera is always at the origin. Physical radii use the same scale division, so planetary size is not inflated. Near/far projection uses a logarithmic depth buffer with custom shaders including the corresponding Three.js chunks.

This strategy preserves sub-kilometer offsets at outer-planet distances. A dedicated test demonstrates that subtracting float32 world coordinates loses a 125-meter offset or introduces a 512-km jump, while subtracting first in CPU float64 preserves it.

It is not sufficient to preserve meter detail at intergalactic distances. Float64 itself eventually fails. Universe/Galaxy/System/local reference frames and split high/low coordinates are PLANNED. The current catalogue is bounded to Solar System scales; no intergalactic precision capability is implied. An ICRS RA/declination/distance conversion exists and is unit-tested, but is not yet integrated with a stellar dataset.

Orbit camera follows its body as orbital time changes. Free camera remains heliocentric. Surface collision clamps free-flight distance just above physical radius. Cinematic travel interpolates compressed space with quintic easing; it does not model a relativistic spacecraft trajectory.
