import test from 'node:test';
import assert from 'node:assert/strict';
import {createAccount} from '../src/account.js';
const progress=day=>({srsVersion:2,appDay:day,settings:{languages:['fr'],noun:1,verb:0,grammar:0,sentence:0},history:{},sessions:[]});
test('restored sessions use account cache; refresh does not reset a lesson; sign-out restores guest',async t=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document;
 globalThis.window={addEventListener(){}};globalThis.document={querySelector:()=>null,addEventListener(){},hidden:true};
 t.after(()=>{globalThis.window=oldWindow;globalThis.document=oldDocument;});
 const map=new Map([['perlingo-account-v1:a:course',JSON.stringify({progress:progress(8),revision:1,linked:true,dirty:false})]]);
 const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 let changed;const applied=[];
 const client={auth:{onAuthStateChange:fn=>changed=fn,getSession:async()=>({data:{session:{user:{id:'a',email:'a@example.test'}}}})},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{revision:1,payload:progress(8)}})})})})};
 const account=createAccount({config:{url:'https://example.test',publishableKey:'public'},pack:'course',storage,getGuest:()=>progress(2),apply:p=>applied.push(p),onStorageError:()=>assert.fail('storage failure'),clientFactory:async()=>client});
 await account.start();assert.equal(applied.at(-1).appDay,8);
 changed('TOKEN_REFRESHED',{user:{id:'a'}});await new Promise(r=>setTimeout(r,5));assert.equal(applied.length,1);
 assert.equal(account.save(progress(9)),true);
 changed('SIGNED_OUT',null);await new Promise(r=>setTimeout(r,5));assert.equal(applied.at(-1).appDay,2);assert.equal(account.save(progress(3)),false);
 assert.equal(JSON.parse(map.get('perlingo-account-v1:a:course')).progress.appDay,9);
 changed('SIGNED_IN',{user:{id:'b'}});await new Promise(r=>setTimeout(r,5));assert.equal(applied.at(-1).appDay,2);
 changed('SIGNED_OUT',null);await new Promise(r=>setTimeout(r,5));
});

test('OAuth permits only configured Google/Apple and preserves pack on a clean callback URL',async()=>{
 const {signInWithProvider,sessionOptions}=await import('../src/account-client.js');
 const calls=[];const client={auth:{signInWithOAuth:async args=>{calls.push(args);return {};}}};
 const config={providers:{google:true,apple:true}};
 for(const provider of ['google','apple'])await signInWithProvider(client,config,provider,'https://perlingo.app/?pack=course&code=old#error=old');
 assert.deepEqual(calls.map(x=>x.provider),['google','apple']);
 assert.equal(calls[0].options.redirectTo,'https://perlingo.app/?pack=course');
 await assert.rejects(signInWithProvider(client,config,'email','https://perlingo.app/'));
 await assert.rejects(signInWithProvider(client,{providers:{google:false}},'google','https://perlingo.app/'));
 assert.equal(calls.length,2);assert.equal(sessionOptions.flowType,'pkce');assert.equal(sessionOptions.detectSessionInUrl,true);
 await assert.rejects(signInWithProvider({auth:{signInWithOAuth:async()=>({error:new Error('Provider unavailable')})}},config,'google','https://perlingo.app/'),/Provider unavailable/);
});

test('signed-out settings expose only gated Google and Apple login, never email or password',t=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document;
 const panel={innerHTML:'',querySelectorAll:()=>[]};
 globalThis.window={addEventListener(){}};globalThis.document={querySelector:()=>panel,addEventListener(){},hidden:true};
 t.after(()=>{globalThis.window=oldWindow;globalThis.document=oldDocument;});
 const account=createAccount({config:{url:'https://example.test',publishableKey:'public',providers:{google:false,apple:false}},pack:'course',storage:{},getGuest:()=>progress(1),apply(){},onStorageError(){}});
 account.mount();assert.match(panel.innerHTML,/Sign in with Google/);assert.match(panel.innerHTML,/Sign in with Apple/);
 assert.equal((panel.innerHTML.match(/disabled/g)||[]).length,2);assert.doesNotMatch(panel.innerHTML,/<input|account-form|Send sign-in code/);
});

test('fresh-account policy never copies guest progress; identity changes remain isolated',async t=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document;
 globalThis.window={addEventListener(){}};globalThis.document={querySelector:()=>null,addEventListener(){},hidden:true};
 t.after(()=>{globalThis.window=oldWindow;globalThis.document=oldDocument;});
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 let changed,owner='a';const clouds=new Map(),applied=[];
 const client={auth:{onAuthStateChange:fn=>changed=fn,getSession:async()=>({data:{session:{user:{id:'a'}}}})}};
 const account=createAccount({config:{url:'https://example.test',publishableKey:'public'},pack:'lemmas',storage,getGuest:()=>progress(19),initialAccount:()=>progress(1),autoLink:true,apply:p=>applied.push(p),onStorageError:()=>assert.fail(),clientFactory:async()=>client,
 remoteFactory:()=>{const id=owner;return {read:async()=>clouds.get(id)||null,write:async(r,p)=>{clouds.set(id,{revision:r+1,payload:structuredClone(p)});return r+1;}};}});
 await account.start();assert.equal(clouds.get('a').payload.appDay,1);
 owner='b';changed('SIGNED_IN',{user:{id:'b'}});await new Promise(r=>setTimeout(r,5));assert.equal(clouds.get('b').payload.appDay,1);
 changed('SIGNED_OUT',null);await new Promise(r=>setTimeout(r,5));assert.equal(applied.at(-1).appDay,19);assert.equal(await account.reset(progress()),false);
});

test('explicit guest sign-in offers import even with a cached account, consumes the handoff, and preserves guest on sign-out',async t=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document;
 let handlers={},changed,current=null,choices=0,writes=0,failLogin=false;
 const panel={innerHTML:'',querySelectorAll(selector){return selector==='[data-account]'?['google','guest','cloud','device'].map(action=>({dataset:{account:action},addEventListener:(_type,fn)=>{handlers[action]=fn;}})):[];}};
 globalThis.window={location:{href:'http://127.0.0.1:5173/lemmas/'},addEventListener(){}};
 globalThis.document={querySelector:selector=>selector==='#account-settings'?panel:null,addEventListener(){},hidden:true};
 t.after(()=>{globalThis.window=oldWindow;globalThis.document=oldDocument;});
 const guest=progress(19),map=new Map([['guest',JSON.stringify(guest)],['perlingo-account-v1:a:lemmas',JSON.stringify({progress:progress(8),revision:1,linked:true,dirty:false})]]);
 const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const applied=[];let row={revision:1,payload:progress(8)};
 const client={auth:{onAuthStateChange:fn=>changed=fn,getSession:async()=>({data:{session:current}}),signInWithOAuth:async()=>failLogin?{error:Error('login failed')}:{}}};
 const options={config:{url:'https://example.test',publishableKey:'public',providers:{google:true}},pack:'lemmas',storage,getGuest:()=>JSON.parse(map.get('guest')),initialAccount:()=>progress(1),autoLink:true,offerGuestOnSignIn:true,onProgressChoice:()=>choices++,apply:p=>applied.push(p),onStorageError:()=>assert.fail('storage failure'),clientFactory:async()=>client,remoteFactory:()=>({read:async()=>structuredClone(row),write:async(r,p)=>{writes++;row={revision:r+1,payload:structuredClone(p)};return r+1;}})};
 const account=createAccount(options);await account.start();
 failLogin=true;await handlers.google();assert.equal(storage.getItem('perlingo-guest-import-v1:lemmas'),null);
 failLogin=false;await handlers.google();assert.equal(storage.getItem('perlingo-guest-import-v1:lemmas'),'pending');
 // A new instance models returning from OAuth after the page reload.
 current={user:{id:'a',email:'a@example.test'}};const returned=createAccount(options);await returned.start();
 assert.equal(storage.getItem('perlingo-guest-import-v1:lemmas'),null);assert.equal(writes,0);assert.equal(choices,1);
 assert.match(panel.innerHTML,/Use guest progress/);assert.match(panel.innerHTML,/Keep account progress/);assert.doesNotMatch(panel.innerHTML,/Keep account on this device/);
 await handlers.guest();assert.equal(row.payload.appDay,19);assert.equal(applied.at(-1).appDay,19);assert.equal(writes,1);
 changed('TOKEN_REFRESHED',current);await new Promise(r=>setTimeout(r,5));assert.equal(choices,1);
 changed('SIGNED_OUT',null);await new Promise(r=>setTimeout(r,5));assert.deepEqual(applied.at(-1),guest);assert.equal(storage.getItem('guest'),JSON.stringify(guest));
 // Restoring the account later does not silently offer the retained guest again.
 const restored=createAccount(options);await restored.start();assert.equal(choices,1);assert.equal(applied.at(-1).appDay,19);
 changed('SIGNED_OUT',null);await new Promise(r=>setTimeout(r,5));
});
