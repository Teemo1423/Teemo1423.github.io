// Local-only admin API prototype. GitHub credentials remain on server.
// NOT a production OAuth server. Never expose this listener to the internet.
import { createServer } from 'node:http';
import { readFile, appendFile } from 'node:fs/promises';
import { randomUUID, timingSafeEqual, createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const repo='Teemo1423/Teemo1423.github.io';
const boards={news:'content/news.json',sermons:'content/sermons.json',school:'content/sunday-school.json',sharing:'content/sarangbang-sharing.json'};
const drafts=new Map();
const key=process.env.CHURCH_ADMIN_API_KEY||'';
const gh=process.env.CHURCH_GITHUB_TOKEN||'';
const writable=key.length>=32&&gh.length>10;
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(data));};
function authenticated(req){const token=req.headers.authorization?.replace(/^Bearer /,'')||'';const a=Buffer.from(token),b=Buffer.from(key);return writable&&a.length===b.length&&timingSafeEqual(a,b);}
async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>100000)throw Error('body_too_large')}return JSON.parse(text||'{}')}
async function github(path,method='GET',payload){const response=await fetch('https://api.github.com/repos/'+repo+'/contents/'+path,{method,headers:{Authorization:'Bearer '+gh,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'mohyeon-church-admin-prototype',...(payload?{'Content-Type':'application/json'}:{})},body:payload?JSON.stringify(payload):undefined});const data=await response.json();if(!response.ok)throw Error('github_'+response.status);return data}
async function audit(entry){await appendFile(resolve(root,'tools/church-admin-api/audit.local.jsonl'),JSON.stringify({time:new Date().toISOString(),...entry})+'\n',{mode:0o600})}
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');const board=url.searchParams.get('board');
  if(req.method==='GET'&&url.pathname==='/health')return send(res,200,{status:'ok',mode:'local_admin_staging',writesEnabled:writable});
  if(!Object.hasOwn(boards,board))return send(res,400,{error:'invalid_board'});
  if(req.method==='GET'&&url.pathname==='/v1/posts'){
   const data=JSON.parse(await readFile(resolve(root,boards[board]),'utf8'));
   const posts=board==='school'?data.weekly:data;
   return send(res,200,{board,count:posts.length,posts});
  }
  if(!authenticated(req))return send(res,401,{error:'admin_auth_required',hint:'Local staging requires CHURCH_ADMIN_API_KEY and CHURCH_GITHUB_TOKEN'});
  if(req.method==='POST'&&url.pathname==='/v1/changes/preview'){
   const input=await body(req);const {operation,index,post}=input;
   if(!['create','update','delete'].includes(operation))return send(res,400,{error:'invalid_operation'});
   const path=boards[board],file=await github(path);
   const decoded=JSON.parse(Buffer.from(file.content.replace(/\s/g,''),'base64').toString('utf8'));
   const posts=board==='school'?decoded.weekly:decoded;
   if(!Array.isArray(posts))throw Error('invalid_data');
   if(operation!=='create'&&(!Number.isInteger(index)||index<0||index>=posts.length))return send(res,400,{error:'invalid_index'});
   if(operation!=='delete'&&(!post||typeof post!=='object'||Array.isArray(post)||typeof post.title!=='string'||!post.title.trim()||typeof post.date!=='string'))return send(res,400,{error:'invalid_post'});
   const previous=operation==='create'?null:posts[index];
   const next=structuredClone(posts);
   if(operation==='create')next.unshift(post);
   if(operation==='update')next[index]=post;
   if(operation==='delete')next.splice(index,1);
   const updated=board==='school'?{...decoded,weekly:next}:next;
   const id=randomUUID();drafts.set(id,{id,board,path,operation,sha:file.sha,updated,expires:Date.now()+300000});
   return send(res,200,{draftId:id,expiresInSeconds:300,operation,board,previous,proposed:operation==='delete'?null:post,requiresConfirmation:true});
  }
  if(req.method==='POST'&&url.pathname==='/v1/changes/commit'){
   const {draftId,confirm}=await body(req);
   if(confirm!==true)return send(res,400,{error:'explicit_confirmation_required'});
   const draft=drafts.get(draftId);
   if(!draft||draft.board!==board||draft.expires<Date.now())return send(res,409,{error:'draft_missing_or_expired'});
   drafts.delete(draftId);
   const current=await github(draft.path);
   if(current.sha!==draft.sha)return send(res,409,{error:'content_changed_preview_again'});
   const content=Buffer.from(JSON.stringify(draft.updated,null,2)+'\n').toString('base64');
   const result=await github(draft.path,'PUT',{message:'Church admin '+draft.operation+' '+board+' (confirmed)',content,sha:draft.sha,branch:'main'});
   try{await audit({board,operation:draft.operation,commit:result.commit.sha,draftId})}catch(e){console.error('Audit write failed',e)}
   return send(res,200,{ok:true,commit:result.commit.sha,board,operation:draft.operation});
  }
  return send(res,404,{error:'not_found'});
 }catch(e){return send(res,e.message==='body_too_large'?413:500,{error:'request_failed',detail:e.message})}
});
server.listen(8787,'127.0.0.1',()=>console.log('Local church admin staging API listening on http://127.0.0.1:8787'));
