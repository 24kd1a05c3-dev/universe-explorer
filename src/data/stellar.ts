import { Color } from 'three';
import { catalog, setCatalogueLookup, type Body } from './catalog';
export const PC_KM=30856775814913.67;
export type StarRow=[number,number,string,number,number,number,number,number,number|null,string,number|null];
export interface StarDataset{version:string;source:string;license:string;epoch:string;selection:string;stars:StarRow[];}
export function colorTemperature(ci:number|null):number{
  if(ci===null)return 5772;
  const bv=Math.max(-.4,Math.min(2.5,ci));
  // Ballesteros 2012 B-V approximation; reddening is not corrected here.
  return 4600*(1/(.92*bv+1.7)+1/(.92*bv+.62));
}
export function stellarColor(kelvin:number):Color{
  const t=Math.max(1000,Math.min(40000,kelvin))/100;
  const r=t<=66?255:329.698727446*Math.pow(t-60,-.1332047592);
  const g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-.0755148492);
  const b=t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;
  return new Color().setRGB(Math.max(0,Math.min(255,r))/255,Math.max(0,Math.min(255,g))/255,Math.max(0,Math.min(255,b))/255);
}
export function starBody(s:StarRow,source:string):Body{
  const temperature=colorTemperature(s[8]);
  // Visual photometry is not bolometric. This radius is explicitly a model scale,
  // not a measured stellar radius. Missing radii survive as metadata to the UI.
  const inferredRadius=695700*Math.sqrt(Math.max(.0001,s[10]??1))*Math.pow(5772/temperature,2);
  const name=s[2]||(s[1]?`HIP ${s[1]}`:`HYG ${s[0]}`);
  const aliases=[`HYG ${s[0]}`,...(s[1]?[`HIP ${s[1]}`]:[])];
  if(name==='Rigil Kentaurus')aliases.push('Alpha Centauri','Alpha Centauri A');
  if(name==='Toliman')aliases.push('Alpha Centauri B');
  return {id:`hyg-${s[0]}`,name,aliases,category:'star',radius:{value:inferredRadius,unit:'km',source,epoch:'J2000.0'},rotationHours:0,tilt:0,texture:'2k_sun',color:stellarColor(temperature).getHex(),description:`${s[9]||'Catalogue'} star, ${(s[5]*3.26156).toFixed(s[5]<10?2:0)} light-years from the Sun. Its light has crossed the interstellar dark to reach us.`,provenance:['POSITIONAL_CATALOG_DATA','PHYSICALLY_RECONSTRUCTED'],coordinates:{raHours:s[3],decDegrees:s[4],distancePc:s[5],source,epoch:'J2000.0'},stellar:{hygId:s[0],magnitude:s[6],absoluteMagnitude:s[7],colorIndex:s[8],spectralType:s[9],temperature,radiusEstimated:true}};
}
export function registerStars(data:StarDataset){
  for(const s of data.stars){if(!s[2])continue;const body=starBody(s,data.source);if(!catalog.some(b=>b.id===body.id))catalog.push(body);}
  const indexed=new Map<string,StarRow>();
  for(const s of data.stars){indexed.set(`hyg ${s[0]}`,s);if(s[1])indexed.set(`hip ${s[1]}`,s);}
  setCatalogueLookup(query=>{const row=indexed.get(query.replace(/^(hip|hyg)\s*/,'$1 '));if(!row)return;const existing=catalog.find(b=>b.id===`hyg-${row[0]}`);if(existing)return existing;const b=starBody(row,data.source);catalog.push(b);return b;});
}
export function validateStarDataset(value:unknown):StarDataset{
  if(!value||typeof value!=='object')throw new Error('Invalid stellar dataset');
  const d=value as StarDataset;
  if(d.version!=='HYG 4.1'||!Array.isArray(d.stars)||d.stars.length>150000)throw new Error('Unsupported stellar schema');
  if(!d.stars.every(s=>Array.isArray(s)&&s.length===11&&Number.isFinite(s[3])&&s[3]>=0&&s[3]<=24&&Number.isFinite(s[4])&&Math.abs(s[4])<=90&&Number.isFinite(s[5])&&s[5]>0&&s[5]<100000&&Number.isFinite(s[6])&&Number.isFinite(s[7])))throw new Error('Malformed stellar record');
  return d;
}
