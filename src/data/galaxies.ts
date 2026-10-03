import { catalog, type Body } from './catalog';
import { PC_KM } from './stellar';
export interface GalaxyRecord{id:string;raDegrees:number;decDegrees:number;distanceMpc:number;distanceSEM_Mpc:number;diameterKpc:number;morphology:string;source:string;epoch:string;reference:string;}
export const milkyWay:Body={id:'milky-way',name:'Milky Way',aliases:['our galaxy','galaxy','Milkyway'],category:'galaxy',radius:{value:50000*9460730472580.8,unit:'km',source:'https://supernova.eso.org/exhibition/1004/?lang=en'},rotationHours:0,tilt:0,texture:'',color:0xb9bfdf,description:'The island of stars we call home. A barred spiral spanning roughly a hundred thousand light-years. Our Sun lives in one small part of it.',provenance:['PHYSICALLY_RECONSTRUCTED'],coordinates:{raHours:17.760333,decDegrees:-28.936175,distancePc:8150,source:'https://supernova.eso.org/exhibition/1004/?lang=en',epoch:'J2000.0'},galaxy:{arms:2,pitch:5.4,bulge:.9,dust:1,thickness:.032,inclination:0,positionAngle:0,shape:'spiral',source:'https://supernova.eso.org/germany/exhibition/videos/1008_spiral_arms/'}};
catalog.push(milkyWay);
const profiles:Record<string,{name:string;aliases:string[];arms:number;bulge:number;dust:number;pitch:number;shape:'spiral'|'elliptical'|'irregular';inclination:number;pa:number;fallbackDiameterLy?:number}>={
 m31:{name:'Andromeda',aliases:['M31','NGC 224','Andromeda Galaxy'],arms:2,bulge:1.2,dust:1.25,pitch:7.4,shape:'spiral',inclination:77,pa:38},
 m33:{name:'Triangulum',aliases:['M33','NGC 598'],arms:3,bulge:.24,dust:.6,pitch:4.4,shape:'spiral',inclination:54,pa:23},
 m51:{name:'Whirlpool Galaxy',aliases:['M51','NGC 5194'],arms:2,bulge:.55,dust:1,pitch:4.2,shape:'spiral',inclination:22,pa:163,fallbackDiameterLy:76000},
 m81:{name:"Bode's Galaxy",aliases:['M81','NGC 3031'],arms:2,bulge:1.1,dust:.8,pitch:6,shape:'spiral',inclination:59,pa:157},
 m104:{name:'Sombrero Galaxy',aliases:['M104','NGC 4594'],arms:0,bulge:2.5,dust:2,pitch:3,shape:'spiral',inclination:84,pa:90},
 m87:{name:'Messier 87',aliases:['M87','Virgo A','NGC 4486'],arms:0,bulge:2,dust:0,pitch:3,shape:'elliptical',inclination:0,pa:0},
 lmc:{name:'Large Magellanic Cloud',aliases:['LMC'],arms:1,bulge:.45,dust:.4,pitch:3.5,shape:'irregular',inclination:35,pa:170,fallbackDiameterLy:14000},
 smc:{name:'Small Magellanic Cloud',aliases:['SMC'],arms:0,bulge:.3,dust:.25,pitch:3,shape:'irregular',inclination:55,pa:45},
};
export function registerGalaxies(records:GalaxyRecord[]):Body[]{
  return records.map(r=>{
    const p=profiles[r.id];if(!p||!(r.distanceMpc>0)||!Number.isFinite(r.raDegrees)||!Number.isFinite(r.decDegrees))throw new Error('Invalid NED galaxy record');
    const radius=r.diameterKpc>0?r.diameterKpc*1000*PC_KM/2:(p.fallbackDiameterLy??30000)*9460730472580.8/2;
    const b:Body={id:r.id,name:p.name,aliases:p.aliases,category:'galaxy',radius:{value:radius,unit:'km',source:r.source,epoch:r.epoch},rotationHours:0,tilt:0,texture:'',color:0xb9bfdf,description:`${r.morphology||'Catalogue'} galaxy, ${(r.distanceMpc*3.26156).toFixed(2)} million light-years from home. Its luminous core, stellar population and dust are explored as a three-dimensional reconstruction.`,provenance:['POSITIONAL_CATALOG_DATA','PHYSICALLY_RECONSTRUCTED'],coordinates:{raHours:r.raDegrees/15,decDegrees:r.decDegrees,distancePc:r.distanceMpc*1e6,distanceUncertaintyPc:r.distanceSEM_Mpc*1e6,source:r.source,epoch:r.epoch},galaxy:{arms:p.arms,pitch:p.pitch,bulge:p.bulge,dust:p.dust,thickness:p.shape==='elliptical'?.45:.028,inclination:p.inclination,positionAngle:p.pa,shape:p.shape,source:r.source}};
    if(!catalog.some(o=>o.id===b.id))catalog.push(b);return b;
  });
}

