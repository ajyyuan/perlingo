import http from 'node:http';
import {server as challengeServer} from './perlingo-challenge/server.mjs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
http.createServer(async(req,res)=>{if(req.url.startsWith('/challenge/')){challengeServer.emit('request',req,res);return;}try{const url=new URL(req.url,'http://localhost'); if(decodeURIComponent(url.pathname).split('/').some(part=>part.startsWith('.')))throw Error(); const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep))throw Error();const body=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.ogg':'audio/ogg'})[path.extname(file)]||'application/octet-stream');res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(5173,'127.0.0.1',()=>console.log('Perlingo: http://127.0.0.1:5173'));
