import { describe, it, expect } from 'vitest';
import { Vector3 } from 'three';
import { CameraFrame } from './frames';
import { equatorialEcliptic, galacticEcliptic } from './astronomy';
import { colorTemperature, validateStarDataset } from '../data/stellar';
describe('interstellar reference frames',()=>{
  it('retains sub-kilometre offsets at galaxy distances',()=>{
    const f=new CameraFrame(),centre=new Vector3(2e19,-3e19,1e19);
    f.originKm.copy(centre);f.localKm.set(.001,.002,.003);
    expect(f.relative(centre,1).toArray()).toEqual([-.001,-.002,-.003]);
  });
  it('rebases without moving the camera',()=>{
    const f=new CameraFrame();f.originKm.set(1e12,2e12,3e12);f.localKm.set(20,30,40);
    const before=f.toAbsolute();f.rebase('star',new Vector3(2e12,4e12,6e12));
    expect(f.toAbsolute().distanceTo(before)).toBe(0);
  });
  it('keeps orthogonal coordinate axes and distance',()=>{
    const x=galacticEcliptic(0,0,1),y=galacticEcliptic(90,0,1),z=galacticEcliptic(0,90,1);
    expect(x.dot(y)).toBeCloseTo(0,8);expect(x.dot(z)).toBeCloseTo(0,8);
    expect(equatorialEcliptic(12,-45,20).length()).toBeCloseTo(20,10);
  });
  it('rejects sentinel unknown distances rather than inventing a position',()=>{
    expect(()=>validateStarDataset({version:'HYG 4.1',stars:[[1,1,'X',0,0,100000,1,1,null,'G',1]]})).toThrow('Malformed');
    expect(colorTemperature(.65)).toBeCloseTo(5778, -2);
  });
});
