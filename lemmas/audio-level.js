// Speech-active RMS, not LUFS: exclude silence and keep one fixed gain per clip.
export function recordingLevel(channels,sampleRate){
 const windows=[],width=Math.max(1,Math.round(sampleRate*.02));let peak=0;
 for(let start=0;start<channels[0].length;start+=width){
  let power=0,count=0;
  for(const channel of channels)for(let i=start;i<Math.min(start+width,channel.length);i++){const x=channel[i];power+=x*x;count++;peak=Math.max(peak,Math.abs(x));}
  if(count)windows.push(power/count);
 }
 const maximum=Math.max(0,...windows),active=windows.filter(p=>p>maximum*.0001);
 const rms=active.length?Math.sqrt(active.reduce((a,b)=>a+b,0)/active.length):0;
 const db=20*Math.log10(Math.max(rms,1e-9));
 const adjustment=rms<.001?0:Math.max(-12,Math.min(12,-19-db));
 return {activeRMSDBFS:db,peak,gain:10**(adjustment/20),adjustmentDB:adjustment};
}
