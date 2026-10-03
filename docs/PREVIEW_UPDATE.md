# Preview performance and soundtrack

Auto is now the default, including for previews with an older saved quality setting. It starts at 0.8 render scale, uses the analytic thin-disk galaxy LOD, disables bloom, and lowers render scale if a sustained 60-frame window exceeds 28 ms. The camera, positions and catalogue star count remain unchanged. High and Cinematic retain full volumetric ray integration and bloom; Performance uses the fast galaxy LOD. Hidden tabs skip scene rendering.

Browser validation measured approximately 39 ms per presentation frame before the analytic galaxy LOD and 10 ms afterwards, in the automated browser at 1262 × 624 CSS pixels. This is one development-browser measurement, not a performance guarantee on every device. The fast LOD approximates disk emission and a volumetric bulge rather than marching the complete volume.

The sound button starts or pauses an original slow ambient organ score synthesized using Web Audio. It does not contain the Interstellar melody or recording. Settings provides volume and an audio file picker for a user-provided soundtrack, including an Interstellar recording they can use. Local audio uses an object URL, loops, and is not uploaded. Browser user interaction is required to start sound.
