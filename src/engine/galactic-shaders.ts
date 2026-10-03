export const galaxyVertex=`
varying vec3 vLocal;
void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
export const galaxyFragment=`
precision highp float;
varying vec3 vLocal;
uniform vec3 localCamera;uniform float armCount;uniform float pitch;uniform float bulge;uniform float dust;uniform float thickness;uniform float shape;uniform int steps;uniform float opacity;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.3,.7));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return noise(p)*.57+noise(p*2.13)*.28+noise(p*4.27)*.15;}
vec2 box(vec3 ro,vec3 rd){vec3 inv=1./rd;vec3 a=(-vec3(1.25)-ro)*inv,b=(vec3(1.25)-ro)*inv;vec3 lo=min(a,b),hi=max(a,b);return vec2(max(max(lo.x,lo.y),lo.z),min(min(hi.x,hi.y),hi.z));}
void main(){
vec3 rd=normalize(vLocal-localCamera);vec2 hit=box(localCamera,rd);float entry=max(hit.x,0.);if(hit.y<=entry)discard;
float dt=(hit.y-entry)/float(steps);float jitter=hash(vec3(floor(gl_FragCoord.xy),7.));
// Fast LOD: integrate the thin disk analytically and retain a volumetric bulge.
// This avoids dozens of noise evaluations per pixel in embedded previews.
if(steps<=28){
vec3 metric=shape>.5&&shape<1.5?vec3(1.,1.25,1.):vec3(1.,2.4,1.);
vec3 origin=localCamera*metric,dir=rd*metric;
float closest=clamp(-dot(origin,dir)/dot(dir,dir),entry,hit.y);
float core=exp(-length(origin+dir*closest)*(shape>.5&&shape<1.5?7.:18.))*bulge;
vec3 light=vec3(1.15,.83,.52)*core*1.6;
float plane=-localCamera.y/rd.y;
if(!(shape>.5&&shape<1.5)&&abs(rd.y)>.001&&plane>=entry&&plane<=hit.y){
vec3 p=localCamera+rd*plane;float r=length(p.xz),n=fbm(p*19.);
float phase=atan(p.z,p.x)*max(armCount,1.)-log(r+.06)*pitch;
float arms=armCount<.5?.3:pow(.5+.5*cos(phase+1.2*(n-.5)),12.);
float disk=exp(-r*2.6)*(1.-smoothstep(.75,1.12,r))/max(.3,abs(rd.y));
float lane=pow(.5+.5*cos(phase+.43),5.)*dust;
light+=disk*mix(vec3(.34,.25,.17),vec3(.30,.46,.78),arms)*(.45+n*.55)*exp(-lane*1.8);
}
float alpha=clamp(length(light)*opacity,.0,.98);if(alpha<.001)discard;
gl_FragColor=vec4(light*opacity/max(alpha,.02),alpha);return;
}
vec3 radiance=vec3(0.);float transmittance=1.;
for(int i=0;i<160;i++){if(i>=steps)break;vec3 p=localCamera+rd*(entry+(float(i)+jitter)*dt);
float r=length(p.xz),angle=atan(p.z,p.x);float outer=1.-smoothstep(.75,1.12,r);
float fine=fbm(p*29.+vec3(5,1,3));float turbulent=fbm(p*83.);
float phase=angle*max(armCount,1.)-log(r+.06)*pitch;
float arms=pow(.5+.5*cos(phase+1.2*(fine-.5)),16.);
if(armCount<.5)arms=.3;
float spiral=exp(-abs(p.y)/thickness)*exp(-r*2.6)*outer;
float core=exp(-length(p*vec3(1.,2.4,1.))*18.)*bulge;
float bar=exp(-length(p*vec3(3.5,20.,12.)))*bulge*.16;
float density=spiral*(.17+arms*(.62+fine*.4))*(.4+fine*.9)+core+bar;
float obscuration=exp(-abs(p.y)/(thickness*.35))*exp(-r*2.)*outer*dust;
obscuration*=pow(.5+.5*cos(phase+.43),5.)*(.4+fine*.95);
vec3 warm=vec3(1.15,.83,.52),young=vec3(.40,.58,1.);
float knots=pow(noise(p*210.),4.)*8.;
vec3 emission=spiral*mix(warm*.16,young*1.25,arms)*(.10+fine*fine*1.3+knots*.45);
emission+=warm*(core*2.6+bar*.4);
float nursery=pow(max(turbulent-.61,0.)*5.,3.)*arms*spiral;
emission+=vec3(1.,.16,.30)*nursery*.5;
if(shape>.5&&shape<1.5){float sph=exp(-length(p*vec3(1.,1.25,1.))*7.);emission=warm*sph*bulge*1.5;density=sph;obscuration=0.;}
if(shape>1.5){density*=.6+fine;emission*=.55+fine*1.8;}
float extinction=density*.55+obscuration*10.;radiance+=transmittance*emission*dt*9.;transmittance*=exp(-extinction*dt*5.);if(transmittance<.008)break;
}
float alpha=clamp((1.-transmittance)*opacity,0.,.99);if(alpha<.001)discard;
// Premultiplied emission keeps faint outskirts and physically separate extinction.
gl_FragColor=vec4(radiance*opacity/max(alpha,.02),alpha);
}`;
export const starVertex=`
attribute vec3 starColor;attribute float absoluteMagnitude;attribute float hygId;
uniform vec3 originHigh;uniform vec3 originLow;uniform float pcPerUnit;uniform float pixelRatio;uniform float exposure;uniform float selectedId;
varying vec3 vColor;varying float vIntensity;
void main(){vec3 delta=(position-originHigh)-originLow;float distancePc=max(length(delta),.000001);
float magnitude=absoluteMagnitude+5.*log(distancePc/10.)/log(10.);
float flux=pow(10.,-.4*(magnitude-2.));float visibility=1.-smoothstep(7.4+exposure,9.+exposure,magnitude);
vColor=starColor;vIntensity=clamp(flux*.6,.065,2.5)*visibility;
if(abs(hygId-selectedId)<.1)vIntensity=0.;
vec4 view=modelViewMatrix*vec4(delta/pcPerUnit,1.);gl_Position=projectionMatrix*view;
gl_PointSize=clamp((2.+pow(max(flux,0.),.25)*1.7)*pixelRatio,2.,11.*pixelRatio);
}`;
export const starFragment=`
varying vec3 vColor;varying float vIntensity;
void main(){vec2 p=gl_PointCoord*2.-1.;float r=length(p);if(r>1.||vIntensity<.001)discard;
float core=exp(-r*r*22.),halo=exp(-r*5.)*.22;gl_FragColor=vec4(vColor*(core+halo)*vIntensity*2.,clamp((core+halo)*vIntensity,0.,1.));}`;
