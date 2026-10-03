import { describe, it, expect } from 'vitest';
import { Vector3 } from 'three';
import { AU_KM, LY_KM, icrs, julianDate, position, relativeKm, solveKepler, smoothstep } from './astronomy';
import { catalog, resolve } from '../data/catalog';
describe('astronomical mathematics',()=>{
  it('converts UTC J2000 noon into the Julian date',()=>expect(julianDate(Date.UTC(2000,0,1,12))).toBe(2451545));
  it('solves Kepler for circular and eccentric orbits',()=>{for(const e of [0,.0167,.2056,.8])for(const m of [-Math.PI,-.5,0,2,Math.PI]){const E=solveKepler(m,e);expect(E-e*Math.sin(E)).toBeCloseTo(m,10);}});
  it('matches JPL J2000 Earth barycenter coordinates',()=>{const p=position('earth',2451545).divideScalar(AU_KM);expect(p.x).toBeCloseTo(-.177171,4);expect(-p.z).toBeCloseTo(.967214,4);expect(p.y).toBeCloseTo(0,5);});
  it('preserves local distances beyond GPU float32 precision',()=>{const base=new Vector3(4.5e9,1e9,-4e9),near=base.clone().add(new Vector3(.125,1,-.25));const r=relativeKm(near,base,1);expect(r.toArray()).toEqual([.125,1,-.25]);expect(Math.fround(near.x)-Math.fround(base.x)).not.toBe(.125);});
  it('keeps actual planetary radii separate from render scales',()=>{for(const b of catalog){expect(b.radius.unit).toBe('km');expect(b.radius.value).toBeGreaterThan(0);expect(b.radius.source).toMatch(/^https:/);expect(b.provenance.length).toBeGreaterThan(0);}});
  it('has a moving, bound approximate lunar orbit',()=>{const a=position('moon',2451545).sub(position('earth',2451545));const b=position('moon',2451545+7).sub(position('earth',2451545+7));expect(a.length()).toBeCloseTo(384400,3);expect(a.distanceTo(b)).toBeGreaterThan(400000);});
  it('keeps planetary positions finite over supported dates',()=>{for(const jd of [2378496.5,2451545,2469807.5])for(const b of catalog){expect(position(b.id,jd).toArray().every(Number.isFinite)).toBe(true);}});
  it('transforms ICRS axes with explicit units',()=>{expect(icrs(0,0,LY_KM).x).toBe(LY_KM);expect(icrs(6,0,10).z).toBeCloseTo(-10);expect(icrs(0,90,10).y).toBeCloseTo(10);});
  it('bounds travel easing with zero-slope endpoints',()=>{expect(smoothstep(-1)).toBe(0);expect(smoothstep(2)).toBe(1);expect(smoothstep(.5)).toBe(.5);expect(smoothstep(.001)).toBeLessThan(.00001);});
});
describe('real-object resolver',()=>{
  it('resolves names, aliases, and natural travel prefix',()=>{expect(resolve('TAKE ME TO SATURN')[0].id).toBe('saturn');expect(resolve('Luna')[0].id).toBe('moon');expect(resolve('home')[0].id).toBe('earth');});
  it('rejects fictional and unsupported destinations',()=>{expect(resolve('Tatooine')).toEqual([]);expect(resolve('Andromeda')).toEqual([]);});
  it('has unique real object identifiers',()=>expect(new Set(catalog.map(b=>b.id)).size).toBe(catalog.length));
});

