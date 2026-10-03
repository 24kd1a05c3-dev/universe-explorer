import { defineConfig } from 'vite';
export default defineConfig({build:{rollupOptions:{output:{manualChunks:{three:['three'],effects:['three/addons/loaders/GLTFLoader.js','three/addons/postprocessing/EffectComposer.js','three/addons/postprocessing/UnrealBloomPass.js'],icons:['lucide']}}}}});
