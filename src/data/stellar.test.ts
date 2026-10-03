import { describe, it, expect } from 'vitest';
import { registerStars, starBody, type StarDataset, type StarRow } from './stellar';
import { resolve } from './catalog';
const row:StarRow=[120001,120002,'',6,-20,8,5,5,.65,'G2V',1];
describe('catalogue navigation',()=>{
  it('keeps inferred stellar dimensions explicit',()=>{
    const b=starBody(row,'https://github.com/astronexus/HYG-Database');
    expect(b.stellar?.radiusEstimated).toBe(true);
    expect(b.coordinates?.distancePc).toBe(8);
    expect(b.rotationHours).toBe(0);
  });
  it('materializes unnamed stars only when an exact identifier is searched',()=>{
    registerStars({version:'HYG 4.1',source:'https://github.com/astronexus/HYG-Database',license:'CC BY-SA 4.0',epoch:'J2000',selection:'test',stars:[row]} as StarDataset);
    expect(resolve('HIP120002')[0]?.id).toBe('hyg-120001');
    expect(resolve('HYG 120001')[0]?.coordinates?.distancePc).toBe(8);
    expect(resolve('HYG 999999')).toEqual([]);
  });
});
