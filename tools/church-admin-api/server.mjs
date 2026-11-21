// Local read-only prototype. No credentials, no writes, no private ministry data.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const boards=Object.freeze({
  news:'content/news.json',
  sermons:'content/sermons.json',
  school:'content/sunday-school.json',
  sharing:'content/sarangbang-sharing.json'
});
const send=(res,status,payload)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(payload));};
const server=createServer(async(req,res)=>{
  if(req.method!=='GET')return send(res,405,{error:'method_not_allowed'});
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/health')return send(res,200,{status:'ok',mode:'read_only_prototype'});
  if(url.pathname!=='/v1/posts')return send(res,404,{error:'not_found'});
  const board=url.searchParams.get('board');
  if(!Object.hasOwn(boards,board))return send(res,400,{error:'invalid_board',allowed:Object.keys(boards)});
  try{
    const data=JSON.parse(await readFile(resolve(root,boards[board]),'utf8'));
    const posts=board==='school'?data.weekly:data;
    if(!Array.isArray(posts))throw Error('invalid content format');
    return send(res,200,{board,count:posts.length,posts:posts.map((p,index)=>({id:board+':'+index,date:p.date||'',title:p.title||'',...p}))});
  }catch(err){return send(res,500,{error:'read_failed'});}
});
server.listen(8787,'127.0.0.1',()=>console.log('Church API prototype: http://127.0.0.1:8787'));
