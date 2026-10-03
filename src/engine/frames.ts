import { Vector3 } from 'three';
export class CameraFrame {
  readonly originKm=new Vector3();
  readonly localKm=new Vector3();
  anchor='sun';
  rebase(anchor:string,newOrigin:Vector3){
    // Deliberately keep the camera offset separate from huge scientific coordinates.
    this.localKm.add(this.originKm.clone().sub(newOrigin));
    this.originKm.copy(newOrigin);this.anchor=anchor;
  }
  relative(objectKm:Vector3,kmPerUnit:number):Vector3{return objectKm.clone().sub(this.originKm).sub(this.localKm).divideScalar(kmPerUnit);}
  toAbsolute():Vector3{return this.originKm.clone().add(this.localKm);}
  distance(objectKm:Vector3):number{return objectKm.clone().sub(this.originKm).sub(this.localKm).length();}
}
