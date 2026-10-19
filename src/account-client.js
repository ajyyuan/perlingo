export const sessionOptions={persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce',storageKey:'perlingo-auth-v1'};
export async function createAccountClient(config){
 if(!config.url||!config.publishableKey)return null;
 const url=new URL(config.url);
 if(url.protocol!=='https:'||!config.publishableKey.startsWith('sb_publishable_'))throw new Error('Use an HTTPS Supabase project URL and public publishable key.');
 const {createClient}=await import('./vendor/supabase.js');
 return createClient(url.href,config.publishableKey,{auth:sessionOptions});
}
export function progressRemote(client,pack){
 return {
  async read(){const {data,error}=await client.from('progress').select('revision,payload').eq('pack',pack).maybeSingle();if(error)throw error;return data;},
  async write(revision,payload){const {data,error}=await client.rpc('save_progress',{p_pack:pack,p_revision:revision,p_payload:payload});if(error)throw error;return data;},
 };
}

export function oauthRedirect(href){
 const url=new URL(href);url.hash='';url.searchParams.delete('code');url.searchParams.delete('error');url.searchParams.delete('error_description');url.searchParams.delete('error_code');return url.href;
}
export async function signInWithProvider(client,config,provider,href){
 if(!['google','apple'].includes(provider)||config.providers?.[provider]!==true)throw new Error('This sign-in option is still being set up.');
 const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:oauthRedirect(href)}});if(error)throw error;
}
