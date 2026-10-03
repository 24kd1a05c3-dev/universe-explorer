/** Original cinematic score with layered voices and a 64-second rise and release. */
export class Soundtrack {
  private context?:AudioContext;private gain?:GainNode;private voices?:GainNode;
  private timer?:ReturnType<typeof setInterval>;private next=0;private step=0;
  private file?:HTMLAudioElement;private url?:string;
  volume=.65;active=false;
  async toggle(){
    if(this.active){this.active=false;if(this.file)this.file.pause();else await this.context?.suspend();return false;}
    if(this.file){await this.file.play();this.active=true;return true;}
    if(!this.context){this.setup();this.timer=setInterval(()=>this.schedule(),150);}
    await this.context!.resume();this.active=true;this.schedule();return true;
  }
  private setup(){
    const c=this.context=new AudioContext();this.voices=c.createGain();this.gain=c.createGain();this.gain.gain.value=this.volume;
    const highpass=c.createBiquadFilter();highpass.type='highpass';highpass.frequency.value=28;
    const bass=c.createBiquadFilter();bass.type='lowshelf';bass.frequency.value=160;bass.gain.value=2;
    const air=c.createBiquadFilter();air.type='highshelf';air.frequency.value=2600;air.gain.value=2;
    const compressor=c.createDynamicsCompressor();compressor.threshold.value=-12;compressor.knee.value=18;compressor.ratio.value=3;compressor.attack.value=.015;compressor.release.value=.35;
    this.voices.connect(highpass);highpass.connect(bass);bass.connect(air);air.connect(this.gain);this.gain.connect(compressor);compressor.connect(c.destination);
    const delay=c.createDelay(2),feedback=c.createGain(),wet=c.createGain();delay.delayTime.value=.75;feedback.gain.value=.24;wet.gain.value=.22;this.voices.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(highpass);
    const reverb=c.createConvolver(),reverbLevel=c.createGain();reverbLevel.gain.value=.2;
    const impulse=c.createBuffer(2,Math.floor(c.sampleRate*2.8),c.sampleRate);
    for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3);}
    reverb.buffer=impulse;this.voices.connect(reverb);reverb.connect(reverbLevel);reverbLevel.connect(highpass);this.next=c.currentTime+.1;
  }
  private schedule(){
    const c=this.context;if(!c||c.state!=='running'||!this.voices)return;
    if(this.next<c.currentTime)this.next=c.currentTime+.05;
    const chords=[[50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64],[43,50,58,62],[46,53,60,65],[45,52,57,64],[50,57,62,69]];
    const melody=[74,69,77,76,72,69,65,67,70,74,72,69,76,77,69,74];
    while(this.next<c.currentTime+.4){
      const arc=Math.sin(Math.PI*(this.step%128)/128)**2,energy=.5+.5*arc,chord=chords[Math.floor(this.step/8)%chords.length];
      if(this.step%8===0)for(const note of chord)this.note(note,this.next,4.6,.075*energy,'organ');
      if(this.step%4===0)this.note(chord[0]-12,this.next,2.3,.15*energy,'bass');
      if(this.step%2===0)this.note(chord[(this.step/2)%4]+12,this.next,1.4,.04+.055*arc,'pulse');
      if(this.step%4===2)this.note(melody[Math.floor(this.step/4)%melody.length],this.next,2.7,.055+.075*arc,'bell');
      if(arc>.65&&this.step%8===6)this.note(chord[2]+24,this.next,3,.045*arc,'bell');
      this.next+=.5;this.step++;
    }
  }
  private note(midi:number,at:number,duration:number,level:number,voice:'organ'|'bass'|'pulse'|'bell'){
    const c=this.context!,envelope=c.createGain(),pan=c.createStereoPanner();pan.pan.value=voice==='bass'?0:Math.sin(midi*1.7)*.3;
    const attack=voice==='organ'?.65:voice==='bass'?.12:.025;
    envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(level,at+attack);envelope.gain.setValueAtTime(level,at+Math.max(attack,voice==='organ'?duration*.55:voice==='bass'?duration*.3:attack));envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);envelope.connect(pan);pan.connect(this.voices!);
    const harmonics=voice==='organ'?[[1,.68],[2,.2],[3,.08],[4,.04]]:voice==='bell'?[[1,.8],[2,.16],[3,.04]]:[[1,1]];let remaining=harmonics.length;
    for(const [harmonic,weight] of harmonics){const oscillator=c.createOscillator(),partial=c.createGain();oscillator.type=voice==='pulse'?'triangle':'sine';oscillator.frequency.value=440*2**((midi-69)/12)*harmonic;partial.gain.value=weight;oscillator.connect(partial);partial.connect(envelope);oscillator.start(at);oscillator.stop(at+duration+.05);oscillator.onended=()=>{oscillator.disconnect();partial.disconnect();if(--remaining===0){envelope.disconnect();pan.disconnect();}};}
  }
  setVolume(value:number){this.volume=Math.max(0,Math.min(1,value));if(this.gain)this.gain.gain.setTargetAtTime(this.volume,this.context!.currentTime,.05);if(this.file)this.file.volume=this.volume;}
  async load(file:File){if(!file.type.startsWith('audio/')&&!/\.(mp3|wav|ogg|m4a|flac)$/i.test(file.name))throw new Error('Choose an audio file.');this.file?.pause();await this.context?.suspend();if(this.url)URL.revokeObjectURL(this.url);this.url=URL.createObjectURL(file);this.file=new Audio(this.url);this.file.loop=true;this.file.volume=this.volume;this.active=false;await this.toggle();}
  dispose(){if(this.timer)clearInterval(this.timer);this.file?.pause();if(this.url)URL.revokeObjectURL(this.url);void this.context?.close();}
}

