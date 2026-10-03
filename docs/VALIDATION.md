# Validation record

Validated 2026-10-02 using Node 24.15 and the Vercel agent-browser plugin workflow against the live Vite application.

- `npm run lint`: passed.
- `npm run typecheck`: passed through production build.
- `npm run test`: 12 passed. Includes Kepler residuals, J2000 barycenter positions, precision loss regression, lunar distance, finite supported-date coordinates, ICRS axes, easing and catalogue provenance/search.
- `npm run build`: passed; engine and icons split into separate bundles. No oversized-chunk warning after splitting.
- Dependency installation after updating Vitest: audit reports zero vulnerabilities.
- Browser: Earth surface, clouds, night side and limb visually checked. An initial missing common shader chunk was caught and fixed, followed by successful Earth rendering.
- Browser: keyboard search → cinematic Saturn journey → arrival verified; search remains closed. A keyboard Enter default-action defect was caught and fixed.
- Browser: Saturn surface, rings and planet shadow visually checked. Ring radial profile improved after inspection to reduce repetitive banding and use NASA ring boundaries.
- Browser: pause keeps simulation date unchanged, resume works, speed controls update displayed speed after simulation callback, free-flight mode activates, unsupported fictional query returns no object, instant Moon arrival works.
- Browser: Solar System map contains nine heliocentric body markers; Moon is available via the destination catalogue.
- Browser: fresh console output after clearing historical shader errors contained no new errors during the tested flows.

Measured Saturn scene in the verification browser: approximately 120 FPS, rolling 1% low 115 FPS, 8.33-ms mean presentation interval, 4 draws, 27,680 triangles, no pending texture requests. These are a single browser observation, not target-hardware guarantees. Initial loading, long-term GPU memory growth and all quality presets have not received complete benchmark coverage.

Screenshots are saved locally in ignored `artifacts/`. Fullscreen was verified successfully using a trusted browser click; a synthetic click correctly lacked user activation. Reduced-motion, audio and long-duration autopilot remain available but have limited automated coverage. Deep-space phases are not implemented and are not presented as validated.

