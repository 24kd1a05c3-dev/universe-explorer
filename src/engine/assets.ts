import { Texture, TextureLoader, SRGBColorSpace } from 'three';
export class Assets {
  private cache = new Map<string, Promise<Texture>>();
  private disposed=false;
  pending=0;
  load(name: string): Promise<Texture> {
    const found=this.cache.get(name); if(found) return found;
    this.pending++;
    const promise=new TextureLoader().loadAsync(`/textures/${name}.jpg`).then(t=>{
      if(this.disposed){t.dispose();throw new Error('Asset owner disposed');}
      // Compressed JPEG size does not reflect GPU storage: cap decoded maps to 2K.
      const image=t.image as HTMLImageElement;
      if(Math.max(image.width,image.height)>2048){const scale=2048/Math.max(image.width,image.height);const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);const context=canvas.getContext('2d');if(context){context.drawImage(image,0,0,canvas.width,canvas.height);t.image=canvas;t.needsUpdate=true;}}
      t.colorSpace=SRGBColorSpace;t.anisotropy=4; return t;
    }).finally(()=>this.pending--);
    this.cache.set(name,promise);return promise;
  }
  dispose(){this.disposed=true; for(const p of this.cache.values()) void p.then(t=>t.dispose()).catch(()=>{});this.cache.clear();}
}
