export function lemmaRemote(client){
 return {
  async read(){const {data,error}=await client.from('lemma_progress').select('revision,payload').maybeSingle();if(error)throw error;return data;},
  async write(revision,payload){const {data,error}=await client.rpc('save_lemma_progress',{p_revision:revision,p_payload:payload});if(error)throw error;return data;}
 };
}
