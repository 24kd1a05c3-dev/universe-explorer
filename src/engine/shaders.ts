export const surfaceVertex = `
#include <common>
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
#include <logdepthbuf_pars_vertex>
void main(){ vUv=uv; vNormal=normalize(mat3(modelMatrix)*normal);vPosition=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
#include <logdepthbuf_vertex>
}`;
export const earthFragment = `
uniform sampler2D dayMap;uniform sampler2D nightMap;uniform sampler2D clouds;
uniform vec3 sunDirection;varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;
#include <logdepthbuf_pars_fragment>
void main(){
#include <logdepthbuf_fragment>
vec3 n=normalize(vNormal);vec3 view=normalize(cameraPosition-vPosition);float light=dot(n,sunDirection);
vec3 day=pow(texture2D(dayMap,vUv).rgb,vec3(2.2));
vec3 night=pow(texture2D(nightMap,vUv).rgb,vec3(2.2));
float cl=texture2D(clouds,vUv).r;float lit=smoothstep(-.08,.14,light);
vec3 color=day*(.018+max(light,0.)*1.25);color+=night*(1.-lit)*.72;
color=mix(color,vec3(.95)*(.03+max(light,0.)),smoothstep(.12,.85,cl)*.83);
float ocean=(1.-smoothstep(.06,.2,day.r)) * smoothstep(.01,.09,day.b);
float spec=pow(max(dot(reflect(-sunDirection,n),view),0.),60.);
color+=vec3(.7,.8,.9)*spec*ocean*lit*.35;
float rim=pow(1.-max(dot(n,view),0.),3.8);
color+=vec3(.05,.26,.55)*rim*lit*.6;
gl_FragColor=vec4(color,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
export const atmosphereFragment = `
uniform vec3 sunDirection;varying vec3 vNormal;varying vec3 vPosition;
#include <logdepthbuf_pars_fragment>
void main(){
#include <logdepthbuf_fragment>
vec3 n=normalize(vNormal);vec3 view=normalize(cameraPosition-vPosition);
float rim=pow(1.-abs(dot(n,view)),4.);float sun=smoothstep(-.25,.6,dot(n,sunDirection));
gl_FragColor=vec4(vec3(.12,.42,.85),rim*sun*.48);
}`;
export const ringFragment = `
uniform vec3 sunDirection;uniform vec3 planetCenter;uniform float planetRadius;uniform vec4 ringEdges;uniform float ringOuter;varying vec2 vUv;varying vec3 vPosition;
#include <logdepthbuf_pars_fragment>
void main(){
#include <logdepthbuf_fragment>
float r=vUv.x;float radiusKm=mix(ringEdges.x,ringOuter,r);
// NASA ring boundaries; fine structure is an explicitly reconstructed density field.
float bands=mix(.18,.82,smoothstep(ringEdges.y-200.,ringEdges.y+200.,radiusKm));
bands=mix(bands,.50,smoothstep(ringEdges.w-200.,ringEdges.w+200.,radiusKm));
float gap=smoothstep(ringEdges.z-200.,ringEdges.z+200.,radiusKm)*(1.-smoothstep(ringEdges.w-200.,ringEdges.w+200.,radiusKm));
float fine=.065*sin(r*137.+sin(r*39.)*2.)+.025*sin(r*491.);
fine*=1.-smoothstep(.002,.012,fwidth(r));
bands=clamp(bands+fine,0.,1.)*(1.-gap*.94);
vec3 p=(vPosition-planetCenter)/planetRadius;float behind=dot(p,sunDirection);float perp=length(p-sunDirection*behind);
float shadow=behind<0. ? smoothstep(.92,1.03,perp) : 1.;
gl_FragColor=vec4(vec3(.66,.58,.43)*(.14+.86*shadow),bands*.76);
}`;
export const photosphereFragment=`
varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;uniform vec3 temperatureColor;uniform float time;
#include <logdepthbuf_pars_fragment>
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
void main(){
#include <logdepthbuf_fragment>
vec3 n=normalize(vNormal),view=normalize(cameraPosition-vPosition);float mu=max(dot(n,view),0.);
vec2 uv=vUv*vec2(180.,90.);float granules=noise(uv+vec2(time*.025,0.));float convection=noise(uv*.13+time*.007);
float intensity=(.25+.75*pow(mu,.55))*(.45+.65*granules+.15*convection);
gl_FragColor=vec4(temperatureColor*intensity*1.8,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
