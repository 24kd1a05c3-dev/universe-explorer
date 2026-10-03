# Data and provenance

Supported real objects: Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus and Neptune. No fictional objects or invented named star fields.

Planet elements and century rates are transcribed from JPL Table 1: https://ssd.jpl.nasa.gov/planets/approx_pos.html . The solver uses orbital-plane eccentric anomaly and rotates into the J2000 ecliptic. Earth currently follows the Earth–Moon barycenter; the Earth-center correction is not modeled. The UTC-based Julian clock approximates the TDB epoch input and does not model leap seconds or relativistic timescales. This is visualization accuracy, not navigation accuracy. Time is bounded to 1800–2050, the published element validity interval.

Moon: mean 384,400 km circular two-body reconstruction, 27.321661-day period and 5.145-degree inclination. No nodal precession, eccentricity, perturbations or lunar ephemeris. Its provenance is approximate physical reconstruction. Planet mean radii, sidereal periods, and tilts are rounded fact-sheet values: https://nssdc.gsfc.nasa.gov/planetary/factsheet/ . Values retain a source URL and unit; schema permits uncertainty and epoch where supplied. Rounded physical constants are not claimed to be measurements with zero uncertainty.

Texture attribution: Solar System Scope / INOVE, https://www.solarsystemscope.com/textures/ . CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ . Planet color textures, Earth clouds/night composite and star-map environment. These are observation-derived composites with enhanced saturation and potentially reconstructed gaps. Earth day map is the NASA-derived `earth_atmos_2048.jpg` mirrored by Three.js: https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets . Clouds are a static composite, not live weather. Background stars are an image environment with no navigable individual catalogue positions. No arbitrary named stars are synthesized.

Saturn ring density and cloud/ocean shading are physical approximations, not measurements of local particles. Rings are marked reconstructed in the UI. Planet axis tilts use simplified ecliptic orientation; pole longitude and IAU body prime-meridian models remain planned. Surface rotation periods are physically motivated, but geographic texture orientation is not an accurate Earth-fixed reference frame.

No live API is required during rendering. Texture files are local and reusable after browser caching. A service worker and a validated external ingestion pipeline are not yet implemented. Maps can be refreshed using `scripts/refresh-assets.ps1`; that script leaves existing files intact on a failed download.
Saturn ring boundaries are sourced from the NASA Saturnian Rings Fact Sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/satringfact.html . The radial boundaries are data-driven; optical density and unresolved fine structure remain reconstructed.

