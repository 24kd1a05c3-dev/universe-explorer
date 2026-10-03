import { Vector3 } from 'three';
import { elements, catalog } from '../data/catalog';
export const AU_KM = 149597870.7;
export const LY_KM = 9460730472580.8;
const DEG = Math.PI/180;
export const julianDate = (ms: number) => ms/86400000+2440587.5;
export function solveKepler(mean: number, e: number): number {
  let E = mean;
  for(let i=0;i<20;i++){ const d=(E-e*Math.sin(E)-mean)/(1-e*Math.cos(E)); E-=d; if(Math.abs(d)<1e-12) break; }
  return E;
}
export function position(id: string, jd: number): Vector3 {
  if(id==='sun') return new Vector3();
  if(id==='moon') {
    // Low precision two-body lunar approximation. Not a JPL lunar ephemeris.
    const angle=(jd-2451545)*2*Math.PI/27.321661+218.316*DEG;
    return position('earth',jd).add(new Vector3(384400*Math.cos(angle),384400*Math.sin(angle)*Math.sin(5.145*DEG),-384400*Math.sin(angle)*Math.cos(5.145*DEG)));
  }
  const entry=elements[id];
  if(!entry){const b=catalog.find(b=>b.id===id);if(b?.coordinates)return equatorialEcliptic(b.coordinates.raHours,b.coordinates.decDegrees,b.coordinates.distancePc*30856775814913.67);throw new Error(`Unknown body ${id}`);}
  const T=(jd-2451545)/36525;
  const [a,e,i,l,p,o]=entry[0].map((v,k)=>v+entry[1][k]*T);
  const E=solveKepler(((l-p)%360)*DEG,e), w=(p-o)*DEG, O=o*DEG, I=i*DEG;
  const x=a*(Math.cos(E)-e), y=a*Math.sqrt(1-e*e)*Math.sin(E);
  const X=(Math.cos(w)*Math.cos(O)-Math.sin(w)*Math.sin(O)*Math.cos(I))*x+(-Math.sin(w)*Math.cos(O)-Math.cos(w)*Math.sin(O)*Math.cos(I))*y;
  const Y=(Math.cos(w)*Math.sin(O)+Math.sin(w)*Math.cos(O)*Math.cos(I))*x+(-Math.sin(w)*Math.sin(O)+Math.cos(w)*Math.cos(O)*Math.cos(I))*y;
  const Z=Math.sin(w)*Math.sin(I)*x+Math.cos(w)*Math.sin(I)*y;
  // Explicit ecliptic -> Y-up graphics mapping: (X,Z,-Y).
  return new Vector3(X,Z,-Y).multiplyScalar(AU_KM);
}
export function relativeKm(object: Vector3, camera: Vector3, kmPerUnit: number): Vector3 {
  // Subtract in CPU float64 BEFORE uploading float32 transforms to GPU.
  return object.clone().sub(camera).divideScalar(kmPerUnit);
}
export function icrs(raHours: number, decDegrees: number, distanceKm: number): Vector3 {
  const a=raHours*15*DEG,d=decDegrees*DEG;
  return new Vector3(Math.cos(d)*Math.cos(a),Math.sin(d),-Math.cos(d)*Math.sin(a)).multiplyScalar(distanceKm);
}
export function equatorialEcliptic(raHours:number,decDegrees:number,distanceKm:number):Vector3{
  const ra=raHours*15*DEG,d=decDegrees*DEG,e=23.43928*DEG;
  const x=Math.cos(d)*Math.cos(ra),y=Math.cos(d)*Math.sin(ra),z=Math.sin(d);
  return new Vector3(x,-y*Math.sin(e)+z*Math.cos(e),-(y*Math.cos(e)+z*Math.sin(e))).multiplyScalar(distanceKm);
}
export function galacticEcliptic(lDegrees:number,bDegrees:number,distanceKm:number):Vector3{
  const l=lDegrees*DEG,b=bDegrees*DEG,gx=Math.cos(b)*Math.cos(l),gy=Math.cos(b)*Math.sin(l),gz=Math.sin(b);
  // Transpose of the IAU J2000 equatorial-to-galactic rotation.
  const x=-.0548755604*gx+.4941094279*gy-.8676661490*gz;
  const y=-.8734370902*gx-.4448296300*gy-.1980763734*gz;
  const z=-.4838350155*gx+.7469822445*gy+.4559837762*gz;
  const e=23.43928*DEG;
  return new Vector3(x,-y*Math.sin(e)+z*Math.cos(e),-(y*Math.cos(e)+z*Math.sin(e))).multiplyScalar(distanceKm);
}
export const smoothstep = (t: number) => {const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
