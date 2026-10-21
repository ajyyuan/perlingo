// AudioContext runs at 16kHz; emit 80ms PCM blocks. Each sample belongs to one capture.
class PCMProcessor extends AudioWorkletProcessor{
 constructor(){super();this.buffer=new Int16Array(1280);this.offset=0;this.token=null;this.port.onmessage=e=>{this.offset=0;this.token=e.data;};}
 process(inputs){const input=inputs[0]?.[0];if(!input)return true;
  for(let i=0;i<input.length;i++){const sample=input[i];if(this.offset===0)this.startTime=(currentFrame+i)/sampleRate;this.buffer[this.offset++]=Math.max(-32768,Math.min(32767,Math.round(sample*32767)));if(this.offset===this.buffer.length){this.port.postMessage({buffer:this.buffer.buffer,token:this.token,startTime:this.startTime},[this.buffer.buffer]);this.buffer=new Int16Array(1280);this.offset=0;}}
  return true;
 }
}
registerProcessor('pcm-capture',PCMProcessor);
