// Fixed public audio origin; never accept arbitrary URLs or forward credentials.
export async function GET(request: Request, {params}: {params: Promise<{locale:string;clip:string}>}) {
 const {locale,clip}=await params;
 if(!/^es-(ES|MX|AR|CO)$/.test(locale)||! /^[a-f0-9]{24}\.mp3$/.test(clip))return new Response('Not found',{status:404});
 const headers=new Headers();const range=request.headers.get('range');if(range)headers.set('Range',range);
 const upstream=await fetch(`https://perlingoaudio.blob.core.windows.net/pronunciation/${locale}/${clip}`,{headers});
 const output=new Headers();for(const name of ['content-type','content-length','content-range','accept-ranges','etag','last-modified']){const value=upstream.headers.get(name);if(value)output.set(name,value);}
 output.set('Cache-Control',upstream.ok?'public, max-age=31536000, immutable':'no-store');
 return new Response(upstream.body,{status:upstream.status,headers:output});
}
