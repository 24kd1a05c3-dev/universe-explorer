import { readFileSync, writeFileSync } from 'node:fs';
const path=process.argv[2]||'artifacts/hyg-v41.csv';
function csv(line){let q=false,field='',out=[];for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){field+='"';i++;}else q=!q;}else if(c===','&&!q){out.push(field);field='';}else field+=c;}out.push(field);return out;}
const lines=readFileSync(path,'utf8').trim().split(/\r?\n/);const headers=csv(lines.shift());
const fields=['id','hip','proper','ra','dec','dist','mag','absmag','ci','spect','lum'];
const indices=fields.map(f=>headers.indexOf(f));if(indices.some(i=>i<0))throw new Error('HYG schema mismatch');
const stars=[];
for(const line of lines){const row=csv(line),s=indices.map(i=>row[i]);const d=Number(s[5]),mag=Number(s[6]);if(!(d>0&&d<100000)||!Number.isFinite(mag))continue;if(mag>8.5&&d>30&&!s[2])continue;
stars.push([Number(s[0]),s[1]?Number(s[1]):0,s[2],Number(s[3]),Number(s[4]),d,mag,Number(s[7]),s[8]?Number(s[8]):null,s[9],s[10]?Number(s[10]):null]);}
const dataset={version:'HYG 4.1',source:'https://github.com/astronexus/HYG-Database/tree/main/hyg/CURRENT',license:'CC BY-SA 4.0',epoch:'J2000.0',selection:'V magnitude <= 8.5, or distance <= 30 pc, or a catalogue proper name; invalid parallax sentinel excluded',columns:fields,stars};
writeFileSync('public/data/stars.json',JSON.stringify(dataset));
writeFileSync('public/data/LICENSE.txt','HYG Database 4.1 — David Nash / Astronexus. Derived from Hipparcos, Yale Bright Star and Gliese catalogues.\nThis filtered dataset is distributed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/\nSource: https://github.com/astronexus/HYG-Database\nModifications: filtered by magnitude/distance/name; selected columns encoded as JSON arrays.\n');
console.log(`Packed ${stars.length} real catalogue stars (${(JSON.stringify(dataset).length/1048576).toFixed(2)} MiB).`);
