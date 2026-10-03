import * as T from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { saturnRings, type Body } from '../data/catalog';
import { validateStarDataset, registerStars } from '../data/stellar';
import { milkyWay, registerGalaxies, type GalaxyRecord } from '../data/galaxies';
import { position, julianDate, smoothstep, LY_KM } from './astronomy';
import { CameraFrame } from './frames';
import { DeepSpace } from './deep-space';
import { Assets } from './assets';
import { surfaceVertex, earthFragment, atmosphereFragment, ringFragment, photosphereFragment } from './shaders';
export type Mode = 'orbit' | 'free' | 'travel';
export interface Snapshot { body: Body; mode: Mode; altitude: number; speed: number; jd: number; fps: number; low: number; frameMs: number; calls: number; triangles: number; textures: number; pending: number; progress: number; paused: boolean; timeScale: number; stars:number; frame:string; }
interface Visual { body:Body; group:T.Group; mesh:T.Mesh; }
interface Journey { from:T.Vector3; start:number; duration:number; initialDistance:number; }
export class Universe {
  readonly renderer:T.WebGLRenderer;readonly scene=new T.Scene();readonly camera=new T.PerspectiveCamera(48,1,.00001,1e9);
  readonly assets=new Assets();readonly deep=new DeepSpace();readonly frame=new CameraFrame();readonly composer:EffectComposer;readonly bloom:UnrealBloomPass;
  body=milkyWay;mode:Mode='orbit';paused=false;timeScale=1;speed=5000*LY_KM;sensitivity=1;reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  jd=julianDate(Date.now());private velocity=new T.Vector3();private visuals:Visual[]=[];private keys=new Set<string>();private orbitOffset=new T.Vector3();private journey?:Journey;
  private raf=0;private last=0;private report=0;private frames:number[]=[];private drag=false;private kmPerUnit=1;private events=new AbortController();private resizeObserver:ResizeObserver;private disposed=false;private contextLost=false;private lostAt=0;private automatic=true;private adaptAt=0;private renderRatio=.8;
  onSnapshot?: (s:Snapshot)=>void;onError?: (message:string)=>void;onCatalogue?:()=>void;
  constructor(private canvas:HTMLCanvasElement){
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,logarithmicDepthBuffer:true,powerPreference:'high-performance'});
    this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;this.renderer.info.autoReset=false;
    this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.deep.scene,this.deep.camera));
    const foreground=new RenderPass(this.scene,this.camera);foreground.clear=false;foreground.clearDepth=true;this.composer.addPass(foreground);
    this.bloom=new UnrealBloomPass(new T.Vector2(1,1),.28,.65,.85);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());this.quality(localStorage.getItem('atlas-quality-v2')||'auto');
    this.scene.add(new T.AmbientLight(0x687b9b,.035));const light=new T.DirectionalLight(0xffffff,2.15);light.name='sunlight';this.scene.add(light,light.target);
    this.frame.rebase(this.body.id,position(this.body.id,this.jd));this.orbitOffset.copy(this.deep.arrival(this.body));this.frame.localKm.copy(this.orbitOffset);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize();this.bind();
    void this.loadCatalogues();this.raf=requestAnimationFrame(this.tick);document.body.classList.add('loaded');
  }
  private async loadCatalogues(){const signal=this.events.signal;
    const jobs=[fetch('/data/stars.json',{signal}).then(r=>{if(!r.ok)throw new Error('Stellar catalogue unavailable');return r.json();}).then(validateStarDataset).then(d=>{if(this.disposed)return;this.deep.setStars(d);registerStars(d);this.onCatalogue?.();}),fetch('/data/galaxies.json',{signal}).then(r=>{if(!r.ok)throw new Error('Galaxy catalogue unavailable');return r.json() as Promise<GalaxyRecord[]>;}).then(records=>{if(this.disposed)return;for(const b of registerGalaxies(records))this.deep.addGalaxy(b);this.onCatalogue?.();})];
    const results=await Promise.allSettled(jobs);for(const r of results)if(r.status==='rejected'&&!this.disposed)this.onError?.(r.reason instanceof Error?r.reason.message:'Catalogue could not load');
  }
  private createBody(body:Body){
    if(this.visuals.some(v=>v.body.id===body.id)||body.category==='galaxy')return;
    const group=new T.Group(),geometry=new T.SphereGeometry(1,128,96);
    const material:T.Material=body.category==='star'?new T.ShaderMaterial({vertexShader:surfaceVertex,fragmentShader:photosphereFragment,uniforms:{temperatureColor:{value:new T.Color(body.color)},time:{value:0}}}):new T.MeshPhongMaterial({color:body.color,shininess:body.id==='earth'?18:2});
    const mesh:T.Mesh<T.BufferGeometry,T.Material>=new T.Mesh(geometry,material);group.add(mesh);group.rotation.z=body.tilt*Math.PI/180;this.scene.add(group);this.visuals.push({body,group,mesh});
    if(body.id==='earth'){
      void Promise.all([this.assets.load('earth'),this.assets.load('8k_earth_nightmap'),this.assets.load('8k_earth_clouds')]).then(([dayMap,nightMap,clouds])=>{if(!group.parent)return;mesh.material.dispose();mesh.material=new T.ShaderMaterial({vertexShader:surfaceVertex,fragmentShader:earthFragment,uniforms:{dayMap:{value:dayMap},nightMap:{value:nightMap},clouds:{value:clouds},sunDirection:{value:new T.Vector3()}}});}).catch(()=>this.onError?.('Earth maps could not load.'));
      group.add(new T.Mesh(new T.SphereGeometry(1.018,128,96),new T.ShaderMaterial({vertexShader:surfaceVertex,fragmentShader:atmosphereFragment,uniforms:{sunDirection:{value:new T.Vector3()}},transparent:true,side:T.BackSide,depthWrite:false,blending:T.AdditiveBlending})));
    }else if(body.category!=='star')void this.assets.load(body.texture).then(t=>{if(!group.parent)return;const m=mesh.material as T.MeshPhongMaterial;m.map=t;m.color.set(0xffffff);m.needsUpdate=true;}).catch(()=>this.onError?.(`${body.name} map unavailable.`));
    if(body.id==='saturn'){
      mesh.scale.set(60268/body.radius.value,54364/body.radius.value,60268/body.radius.value);
      const inner=saturnRings.innerKm/body.radius.value,outer=saturnRings.outerKm/body.radius.value;
      const g=new T.RingGeometry(inner,outer,512,1),uv=g.getAttribute('uv'),pos=g.getAttribute('position');for(let i=0;i<uv.count;i++)uv.setXY(i,(Math.hypot(pos.getX(i),pos.getY(i))-inner)/(outer-inner),0);
      const ring=new T.Mesh(g,new T.ShaderMaterial({vertexShader:surfaceVertex,fragmentShader:ringFragment,uniforms:{sunDirection:{value:new T.Vector3()},planetCenter:{value:new T.Vector3()},planetRadius:{value:1},ringEdges:{value:new T.Vector4(saturnRings.innerKm,saturnRings.cOuterKm,saturnRings.bOuterKm,saturnRings.aInnerKm)},ringOuter:{value:saturnRings.outerKm}},side:T.DoubleSide,transparent:true,depthWrite:false}));ring.rotation.x=-Math.PI/2;group.add(ring);
      void fetch('/models/saturn.glb',{method:'HEAD',signal:this.events.signal}).then(async r=>{if(!r.ok||!r.headers.get('content-type')?.includes('model'))return;const gltf=await new GLTFLoader().loadAsync('/models/saturn.glb');gltf.scene.traverse(o=>{if(o instanceof T.Mesh){if(!this.disposed&&o.name==='Saturn_Oblate'){mesh.geometry.dispose();o.updateWorldMatrix(true,false);mesh.geometry=o.geometry;mesh.geometry.applyMatrix4(o.matrixWorld);mesh.scale.set(1,1,1);}else o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}).catch(()=>{});
    }
  }
  quality(preset:string){const p={auto:[.8,24],cinematic:[1.5,112],high:[1,72],balanced:[.85,48],performance:[.6,24]}[preset]??[.8,36];this.automatic=preset==='auto';this.renderRatio=Math.min(devicePixelRatio,p[0]);this.renderer.setPixelRatio(this.renderRatio);this.composer.setPixelRatio(this.renderRatio);this.deep.steps=p[1];this.bloom.enabled=preset==='cinematic'||preset==='high';this.frames=[];this.adaptAt=performance.now();localStorage.setItem('atlas-quality',preset);localStorage.setItem('atlas-quality-v2',preset);this.resize();}
  private resize(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;this.renderer.setSize(w,h,false);this.composer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
  private bind(){const signal=this.events.signal;
    window.addEventListener('keydown',e=>{if((e.target as HTMLElement).matches('input,select,textarea')||document.querySelector('#modal:not([hidden])'))return;this.keys.add(e.code);if(['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE'].includes(e.code)){this.cancel();this.mode='free';}if(e.code==='Space'){e.preventDefault();this.paused=!this.paused;}},{signal});
    window.addEventListener('keyup',e=>this.keys.delete(e.code),{signal});window.addEventListener('blur',()=>this.keys.clear(),{signal});
    this.canvas.addEventListener('pointerdown',e=>{this.drag=true;this.canvas.setPointerCapture(e.pointerId);},{signal});this.canvas.addEventListener('pointerup',()=>this.drag=false,{signal});this.canvas.addEventListener('pointercancel',()=>this.drag=false,{signal});
    this.canvas.addEventListener('pointermove',e=>{if(!this.drag)return;this.cancel();const k=.003*this.sensitivity;if(this.mode==='orbit'){this.orbitOffset.applyAxisAngle(new T.Vector3(0,1,0),-e.movementX*k);const right=new T.Vector3(1,0,0).applyQuaternion(this.camera.quaternion);this.orbitOffset.applyAxisAngle(right,-e.movementY*k);}else this.camera.quaternion.multiply(new T.Quaternion().setFromEuler(new T.Euler(-e.movementY*k,-e.movementX*k,0,'YXZ')));},{signal});
    this.canvas.addEventListener('wheel',e=>{e.preventDefault();if(this.mode==='orbit'){this.orbitOffset.multiplyScalar(Math.exp(e.deltaY*.001));this.orbitOffset.clampLength(this.body.radius.value*(this.body.category==='galaxy'?.015:1.04),this.body.radius.value*1e9);}else this.speed=Math.max(.1,Math.min(1e23,this.speed*Math.exp(-e.deltaY*.002)));},{passive:false,signal});
    this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true;this.lostAt=performance.now();cancelAnimationFrame(this.raf);this.keys.clear();this.velocity.set(0,0,0);this.drag=false;this.onError?.('Graphics interrupted. Waiting for the GPU to recover…');},{signal});
    this.canvas.addEventListener('webglcontextrestored',()=>{if(this.disposed)return;this.contextLost=false;if(this.journey)this.journey.start+=performance.now()-this.lostAt;this.composer.reset();this.quality('performance');this.resize();this.last=0;this.frames=[];this.onError?.('Graphics restored. Performance mode enabled; your destination is preserved.');cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(this.tick);},{signal});
  }
  cancel(){this.journey=undefined;if(this.mode==='travel')this.mode='free';}
  orbit(){this.cancel();this.mode='orbit';this.orbitOffset.copy(this.frame.localKm);this.velocity.set(0,0,0);}
  focus(){this.camera.lookAt(this.frame.localKm.clone().negate().divideScalar(this.kmPerUnit));}
  travel(body:Body,instant=false){this.velocity.set(0,0,0);this.frame.rebase(body.id,position(body.id,this.jd));this.body=body;this.createBody(body);this.speed=body.category==='galaxy'?body.radius.value*.08:body.stellar?body.radius.value*.5:1500;
    if(instant||this.reducedMotion){this.arrive();return;}this.journey={from:this.frame.localKm.clone(),start:performance.now(),duration:body.category==='galaxy'||body.stellar?10500:7500,initialDistance:this.frame.localKm.length()};this.mode='travel';}
  private arrivalOffset(){if(this.body.category==='galaxy')return this.deep.arrival(this.body);if(this.body.stellar||this.body.id==='sun')return new T.Vector3(.2,.4,3.7).multiplyScalar(this.body.radius.value);
    const p=position(this.body.id,this.jd),sun=p.clone().negate().normalize(),side=new T.Vector3().crossVectors(sun,new T.Vector3(0,1,0)).normalize();return sun.multiplyScalar(.8).add(side.multiplyScalar(3.1)).add(new T.Vector3(0,.7,0)).normalize().multiplyScalar(this.body.radius.value*(this.body.id==='saturn'?6.5:3.5));}
  private arrive(){this.journey=undefined;this.mode='orbit';this.orbitOffset.copy(this.arrivalOffset());this.frame.localKm.copy(this.orbitOffset);}
  private tick=(now:number)=>{
    if(this.disposed||this.contextLost)return;
    if(document.hidden){this.last=0;this.raf=requestAnimationFrame(this.tick);return;}
    if(this.automatic&&this.frames.length>=60&&now-this.adaptAt>4000){const average=this.frames.slice(-60).reduce((sum,t)=>sum+t,0)/60;this.adaptAt=now;if(average>28&&this.renderRatio>.45){this.renderRatio=Math.max(.45,this.renderRatio*.82);this.renderer.setPixelRatio(this.renderRatio);this.composer.setPixelRatio(this.renderRatio);this.deep.steps=Math.max(20,Math.round(this.deep.steps*.82));this.resize();this.frames=[];}}
    const dt=Math.min((now-(this.last||now))/1000,.05);if(this.last)this.frames.push(now-this.last);if(this.frames.length>600)this.frames.shift();this.last=now;if(!this.paused)this.jd=Math.max(2378496.5,Math.min(2469807.5,this.jd+dt*this.timeScale/86400));
    const newOrigin=position(this.body.id,this.jd);if(this.mode==='free')this.frame.localKm.add(this.frame.originKm.clone().sub(newOrigin));this.frame.originKm.copy(newOrigin);let progress=0;
    if(this.journey){progress=Math.min(1,(now-this.journey.start)/this.journey.duration);const e=smoothstep(progress),end=this.arrivalOffset(),direction=this.journey.from.clone().normalize().lerp(end.clone().normalize(),smoothstep(Math.min(1,progress*2))).normalize();if(direction.lengthSq()<.01)direction.copy(end).normalize();const dist=Math.exp(T.MathUtils.lerp(Math.log(Math.max(1,this.journey.initialDistance)),Math.log(end.length()),e));this.frame.localKm.copy(direction).multiplyScalar(dist);if(progress>=1)this.arrive();}
    else if(this.mode==='orbit'){if(!this.paused&&!this.drag&&!this.reducedMotion){const axis=this.body.category==='galaxy'?new T.Vector3(0,1,0).applyQuaternion(this.deep.rotation(this.body)):new T.Vector3(0,1,0);this.orbitOffset.applyAxisAngle(axis,dt*.012);}this.frame.localKm.copy(this.orbitOffset);}
    else {const input=new T.Vector3(Number(this.keys.has('KeyD'))-Number(this.keys.has('KeyA')),Number(this.keys.has('KeyE'))-Number(this.keys.has('KeyQ')),Number(this.keys.has('KeyS'))-Number(this.keys.has('KeyW')));if(input.lengthSq())input.normalize().applyQuaternion(this.camera.quaternion).multiplyScalar(this.speed*(this.keys.has('ShiftLeft')?10:1));this.velocity.lerp(input,1-Math.exp(-dt*2.5));this.frame.localKm.addScaledVector(this.velocity,dt);if(this.body.category!=='galaxy'&&this.frame.localKm.length()<this.body.radius.value*1.02)this.frame.localKm.setLength(this.body.radius.value*1.02);}
    const distance=this.frame.localKm.length();this.kmPerUnit=Math.max(.1,Math.min(distance*.25,this.body.radius.value*1e6));this.camera.position.set(0,0,0);
    if(this.mode==='orbit'||this.mode==='travel'){const dest=this.frame.localKm.clone().negate().divideScalar(this.kmPerUnit);this.camera.lookAt(dest);if(this.mode==='orbit'){const right=new T.Vector3(1,0,0).applyQuaternion(this.camera.quaternion);this.camera.lookAt(dest.addScaledVector(right,-this.body.radius.value/this.kmPerUnit*.12));}}
    const sunlight=this.scene.getObjectByName('sunlight') as T.DirectionalLight;sunlight.position.copy(newOrigin.clone().negate().normalize().multiplyScalar(100));sunlight.target.position.set(0,0,0);
    for(const v of this.visuals){const p=position(v.body.id,this.jd),d=this.frame.distance(p),angular=v.body.radius.value/Math.max(v.body.radius.value,d);v.group.visible=angular>.000007&&d/this.kmPerUnit<1e8;if(!v.group.visible)continue;v.group.position.copy(this.frame.relative(p,this.kmPerUnit));v.group.scale.setScalar(v.body.radius.value/this.kmPerUnit);if(v.body.rotationHours)v.mesh.rotation.y=((this.jd-2451545)*24/v.body.rotationHours*2*Math.PI)%(2*Math.PI);
      const sun=p.clone().negate().normalize();v.group.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.ShaderMaterial){const u=o.material.uniforms;if(u.sunDirection)u.sunDirection.value.copy(sun);if(u.time)u.time.value=now/1000;if(u.planetCenter){u.planetCenter.value.copy(v.group.position);u.planetRadius.value=v.group.scale.x;}}});}
    this.deep.update(this.frame,this.body,this.camera,this.jd,this.renderer.getPixelRatio());this.renderer.info.reset();this.composer.render();
    if(now-this.report>250){this.report=now;const sorted=this.frames.slice().sort((a,b)=>a-b),mean=this.frames.reduce((a,b)=>a+b,0)/Math.max(1,this.frames.length);this.onSnapshot?.({body:this.body,mode:this.mode,altitude:this.body.category==='galaxy'?distance:distance-this.body.radius.value,speed:this.speed,jd:this.jd,fps:1000/mean,low:1000/(sorted[Math.floor(sorted.length*.99)]||mean),frameMs:mean,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,textures:this.renderer.info.memory.textures,pending:this.assets.pending,progress,paused:this.paused,timeScale:this.timeScale,stars:this.deep.starCount,frame:this.frame.anchor});}
    this.raf=requestAnimationFrame(this.tick);
  };
  dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.events.abort();this.resizeObserver.disconnect();this.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});this.scene.clear();this.deep.dispose();this.assets.dispose();for(const pass of this.composer.passes)pass.dispose();this.composer.dispose();this.renderer.dispose();}
}
