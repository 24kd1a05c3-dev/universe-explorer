export type Provenance = 'OBSERVATION_DERIVED' | 'PHYSICALLY_RECONSTRUCTED' | 'POSITIONAL_CATALOG_DATA';
export interface Measurement { value: number; unit: string; source: string; uncertainty?: number; epoch?: string }
export interface Body {
  id: string; name: string; aliases: string[]; category: 'star' | 'planet' | 'moon' | 'galaxy';
  radius: Measurement; rotationHours: number; tilt: number; texture: string;
  color: number; description: string; provenance: Provenance[];
  coordinates?: { raHours:number; decDegrees:number; distancePc:number; distanceUncertaintyPc?:number; source:string; epoch:string };
  stellar?: { hygId:number; magnitude:number; absoluteMagnitude:number; colorIndex:number|null; spectralType:string; temperature:number; radiusEstimated:boolean };
  galaxy?: { arms:number; pitch:number; bulge:number; dust:number; thickness:number; inclination:number; positionAngle:number; shape:'spiral'|'elliptical'|'irregular'; source:string };
}
const source = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/';
function body(id: string, radius: number, rotationHours: number, tilt: number, color: number, description: string, texture = `2k_${id}`, category: Body['category'] = 'planet'): Body {
  return { id, name: id[0].toUpperCase()+id.slice(1), aliases: id === 'moon' ? ['Luna'] : id === 'earth' ? ['Terra','home'] : [], category, radius:{value:radius,unit:'km',source},rotationHours,tilt,color,description,texture,provenance:['OBSERVATION_DERIVED','POSITIONAL_CATALOG_DATA'] };
}
export const catalog: Body[] = [
  body('sun',695700,609.12,7.25,0xffe2a4,'The star at the center of our world. A furnace of hydrogen, holding eight planets in its gravity.','2k_sun','star'),
  body('mercury',2439.7,1407.6,0.034,0x928780,'A cratered world of extremes, tracing the shortest orbit around the Sun.'),
  body('venus',6051.8,-5832.5,177.36,0xdbbd8f,'An entire world hidden beneath clouds. Sunlight filters through a dense carbon-dioxide atmosphere.','2k_venus_atmosphere'),
  body('earth',6371,23.9345,23.439,0x5390b6,'Our pale blue home. An ocean world wrapped in a thin atmosphere, suspended in the silence of space.','earth'),
  {...body('moon',1737.4,655.728,6.68,0xa7a7a7,'The familiar face of another world. Ancient impact basins preserve a history written in stone.','2k_moon','moon'),provenance:['OBSERVATION_DERIVED','PHYSICALLY_RECONSTRUCTED']},
  body('mars',3389.5,24.6229,25.19,0xbb7052,'A rust-colored desert. Once shaped by water, now sculpted by wind and time.'),
  body('jupiter',69911,9.925,3.13,0xc8b5a0,'A giant without a solid surface. Cloud bands and immense storms sweep around the largest planet.'),
  body('saturn',58232,10.656,26.73,0xddcaa4,'A world encircled by ice. Countless fragments catch the light in an impossibly thin ring.'),
  body('uranus',25362,-17.24,97.77,0x9acbd1,'An ice giant turned on its side, moving through the distant reaches of the Solar System.'),
  body('neptune',24622,16.11,28.32,0x4b74cf,'At the edge of the planetary realm, an ice giant swept by powerful atmospheric winds.'),
];
let catalogueLookup:((query:string)=>Body|undefined)|undefined;
export function setCatalogueLookup(lookup:(query:string)=>Body|undefined){catalogueLookup=lookup;}
export function resolve(query: string): Body[] {
  const q = query.toLowerCase().replace(/^take me to\s+/,'').trim();
  const matches=catalog.filter(b => [b.name,...b.aliases].some(n=>n.toLowerCase().includes(q)));
  if(!matches.length){const found=catalogueLookup?.(q);if(found)return [found];}
  return matches;
}
// JPL Table 1: [a AU, e, I deg, L deg, perihelion deg, ascending node deg].
// Each second row is the corresponding rate per Julian century; valid 1800–2050.
export const elements: Record<string, [number[],number[]]> = {
 mercury:[[.38709927,.20563593,7.00497902,252.2503235,77.45779628,48.33076593],[.00000037,.00001906,-.00594749,149472.67411175,.16047689,-.12534081]],
 venus:[[.72333566,.00677672,3.39467605,181.9790995,131.60246718,76.67984255],[.0000039,-.00004107,-.0007889,58517.81538729,.00268329,-.27769418]],
 earth:[[1.00000261,.01671123,-.00001531,100.46457166,102.93768193,0],[.00000562,-.00004392,-.01294668,35999.37244981,.32327364,0]],
 mars:[[1.52371034,.0933941,1.84969142,-4.55343205,-23.94362959,49.55953891],[.00001847,.00007882,-.00813131,19140.30268499,.44441088,-.29257343]],
 jupiter:[[5.202887,.04838624,1.30439695,34.39644051,14.72847983,100.47390909],[-.00011607,-.00013253,-.00183714,3034.74612775,.21252668,.20469106]],
 saturn:[[9.53667594,.05386179,2.48599187,49.95424423,92.59887831,113.66242448],[-.0012506,-.00050991,.00193609,1222.49362201,-.41897216,-.28867794]],
 uranus:[[19.18916464,.04725744,.77263783,313.23810451,170.9542763,74.01692503],[-.00196176,-.00004397,-.00242939,428.48202785,.40805281,.04240589]],
 neptune:[[30.06992276,.00859048,1.77004347,-55.12002969,44.96476227,131.78422574],[.00026291,.00005105,.00035372,218.45945325,-.32241464,-.00508664]],
};
export const saturnRings = {
  source:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/satringfact.html',
  innerKm:74658,cOuterKm:92000,bOuterKm:117507,aInnerKm:122340,outerKm:136780,
  provenance:'PHYSICALLY_RECONSTRUCTED' as const,
};
