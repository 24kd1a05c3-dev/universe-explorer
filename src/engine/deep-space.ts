import * as T from 'three';
import { catalog, type Body } from '../data/catalog';
import { PC_KM, stellarColor, colorTemperature, type StarDataset } from '../data/stellar';
import { galacticEcliptic, equatorialEcliptic, position } from './astronomy';
import { CameraFrame } from './frames';
import { galaxyVertex, galaxyFragment, starVertex, starFragment } from './galactic-shaders';
interface GalaxyVisual{body:Body;mesh:T.Mesh<T.BoxGeometry,T.ShaderMaterial>;rotation:T.Quaternion;}
export class DeepSpace {
  readonly scene=new T.Scene();readonly camera=new T.PerspectiveCamera(43,1,.000001,1e8);
  private galaxies:GalaxyVisual[]=[];private stars?:T.Points<T.BufferGeometry,T.ShaderMaterial>;
  starCount=0;steps=96;exposure=1.8;
  constructor(){this.addGalaxy(catalog.find(b=>b.id==='milky-way')!);}
  rotation(body:Body):T.Quaternion{
    if(body.id==='milky-way'){
      const x=galacticEcliptic(0,0,1).normalize(),y=galacticEcliptic(0,90,1).normalize(),z=new T.Vector3().crossVectors(x,y).normalize();
      return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));
    }
    const c=body.coordinates!,los=equatorialEcliptic(c.raHours,c.decDegrees,1).normalize();
    const north=equatorialEcliptic(c.raHours,c.decDegrees+.01,1).sub(los).normalize();
    const east=new T.Vector3().crossVectors(north,los).normalize();
    const pa=(body.galaxy?.positionAngle??0)*Math.PI/180,inc=(body.galaxy?.inclination??0)*Math.PI/180;
    const major=north.clone().multiplyScalar(Math.cos(pa)).addScaledVector(east,Math.sin(pa));
    const normal=los.clone().applyAxisAngle(major,inc).normalize();const minor=new T.Vector3().crossVectors(major,normal).normalize();
    return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(major,normal,minor));
  }
  addGalaxy(body:Body){if(this.galaxies.some(v=>v.body.id===body.id))return;const g=body.galaxy!;
    const material=new T.ShaderMaterial({vertexShader:galaxyVertex,fragmentShader:galaxyFragment,transparent:true,depthWrite:false,side:T.BackSide,uniforms:{localCamera:{value:new T.Vector3()},armCount:{value:g.arms},pitch:{value:g.pitch},bulge:{value:g.bulge},dust:{value:g.dust},thickness:{value:g.thickness},shape:{value:g.shape==='elliptical'?1:g.shape==='irregular'?2:0},steps:{value:this.steps},opacity:{value:1}}});
    const mesh=new T.Mesh(new T.BoxGeometry(2.5,2.5,2.5),material);const rotation=this.rotation(body);mesh.quaternion.copy(rotation);mesh.frustumCulled=false;this.scene.add(mesh);this.galaxies.push({body,mesh,rotation});
  }
  setStars(data:StarDataset){
    const n=data.stars.length,pos=new Float32Array(n*3),colors=new Float32Array(n*3),mags=new Float32Array(n),ids=new Float32Array(n);
    data.stars.forEach((s,i)=>{const p=equatorialEcliptic(s[3],s[4],s[5]);pos.set(p.toArray(),i*3);colors.set(stellarColor(colorTemperature(s[8])).toArray(),i*3);mags[i]=s[7];ids[i]=s[0];});
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('starColor',new T.BufferAttribute(colors,3));g.setAttribute('absoluteMagnitude',new T.BufferAttribute(mags,1));g.setAttribute('hygId',new T.BufferAttribute(ids,1));
    const m=new T.ShaderMaterial({vertexShader:starVertex,fragmentShader:starFragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{originHigh:{value:new T.Vector3()},originLow:{value:new T.Vector3()},pcPerUnit:{value:1},pixelRatio:{value:1},exposure:{value:this.exposure},selectedId:{value:-1}}});
    this.stars=new T.Points(g,m);this.stars.frustumCulled=false;this.stars.renderOrder=10;this.scene.add(this.stars);this.starCount=n;
  }
  arrival(body:Body):T.Vector3{
    const q=this.rotation(body);const angle=body.id==='m104'?.18:body.id==='m31'?.40:body.id==='m87'?.65:.65;
    return new T.Vector3(.35,Math.sin(angle)*2.4,Math.cos(angle)*2.4).applyQuaternion(q).multiplyScalar(body.radius.value);
  }
  update(frame:CameraFrame,body:Body,camera:T.PerspectiveCamera,jd:number,pixelRatio:number){
    const scale=body.category==='galaxy'?body.radius.value:50000*9460730472580.8;
    this.camera.quaternion.copy(camera.quaternion);this.camera.aspect=camera.aspect;this.camera.fov=camera.fov;this.camera.updateProjectionMatrix();
    for(const v of this.galaxies){const p=position(v.body.id,jd),dist=frame.distance(p)/v.body.radius.value;v.mesh.visible=dist<2000;if(!v.mesh.visible)continue;
      v.mesh.position.copy(frame.relative(p,scale));v.mesh.scale.setScalar(v.body.radius.value/scale);
      const local=frame.originKm.clone().sub(p).add(frame.localKm).applyQuaternion(v.rotation.clone().invert()).divideScalar(v.body.radius.value);
      v.mesh.material.uniforms.localCamera.value.copy(local);v.mesh.material.uniforms.steps.value=this.steps;
      // Local stellar catalogue resolves Solar neighborhood; suppress overbright aggregate there.
      v.mesh.material.uniforms.opacity.value=body.category==='galaxy'?1:.045;
    }
    if(this.stars){
      const origin=frame.toAbsolute().divideScalar(PC_KM),hi=new T.Vector3(Math.fround(origin.x),Math.fround(origin.y),Math.fround(origin.z));
      const u=this.stars.material.uniforms;u.originHigh.value.copy(hi);u.originLow.value.copy(origin).sub(hi);u.pcPerUnit.value=scale/PC_KM;u.pixelRatio.value=pixelRatio;u.exposure.value=this.exposure;u.selectedId.value=body.stellar?.hygId??-1;
    }
  }
  dispose(){for(const v of this.galaxies){v.mesh.geometry.dispose();v.mesh.material.dispose();}this.stars?.geometry.dispose();this.stars?.material.dispose();this.scene.clear();}
}
