import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',D=[[0,-1],[0,1],[-1,0],[1,0]],L='udlr';
function P(t){
 const r=t.split('\n').filter(x=>x.length),h=r.length,w=Math.max(...r.map(x=>x.length)),a=new Uint8Array(w*h).fill(1),g=[],b=[];let p=-1;
 r.forEach((s,y)=>{for(let x=0;x<s.length;x++){const c=s[x],i=y*w+x;if(c=='#'||!x||!y||x==w-1||y==h-1)continue;a[i]=0;if('.*+'.includes(c))g.push(i);if('$*'.includes(c))b.push(i);if('@+'.includes(c))p=i}});
 return{w,a,g,b:b.sort((x,y)=>x-y),p};
}
function V(l){
 const v=new Uint8Array(l.a.length),q=[...l.g];
 for(const g of l.g)v[g]=1;
 for(let i=0;i<q.length;i++){const x=q[i];for(const[dx,dy]of D){const d=dy*l.w+dx,y=x-d;if(!l.a[y]&&!l.a[y-d]&&!v[y]){v[y]=1;q.push(y)}}}
 return v;
}
function E(l,o,f,s,t,k){
 let m=f,n=0;k[n++]=f;s[f]=t;
 while(n){const p=k[--n];if(p<m)m=p;for(const[dx,dy]of D){const q=p+dy*l.w+dx;if(!l.a[q]&&!o[q]&&s[q]!=t){s[q]=t;k[n++]=q}}}
 return m;
}
function W(l,o,f,t){
 if(f==t)return'';
 const w=l.w,p=new Int32Array(l.a.length).fill(-1),h=new Array(l.a.length),q=[f];p[f]=f;
 for(let i=0;i<q.length;i++){const x=q[i];if(x==t)break;for(let k=0;k<4;k++){const[dx,dy]=D[k],y=x+dy*w+dx;if(l.a[y]||o[y]||p[y]>=0)continue;p[y]=x;h[y]=L[k];q.push(y)}}
 if(p[t]<0)throw new Error('x');
 let s='';for(let x=t;x!=f;x=p[x])s=h[x]+s;return s;
}
function S(l,M){
 const{w,a,g}=l,z=a.length,G=new Uint8Array(z);
 for(const x of g)G[x]=1;
 const v=V(l),o=new Uint8Array(z),s=new Int32Array(z),m=new Int32Array(z),k=new Int32Array(z);let t=0;
 const done=b=>b.every(x=>G[x]);
 if(l.b.some(x=>!v[x]))return null;
 const B=[l.b.slice()],Y=[l.p],A=[-1],N=[-1],T=[-1],J=[-1],X=new Map;
 for(const b of l.b)o[b]=1;
 const l0=E(l,o,l.p,s,++t,k);
 for(const b of l.b)o[b]=0;
 X.set(l0+':'+B[0],0);
 let f=done(B[0])?0:-1;
 for(let h=0;f<0&&h<B.length;h++){
  const b=B[h];
  for(const x of b)o[x]=1;
  E(l,o,Y[h],s,++t,k);
  const q=t;
  for(let i=0;i<b.length&&f<0;i++){
   const c=b[i];
   for(let j=0;j<4;j++){
    const[dx,dy]=D[j],d=dy*w+dx,u=c+d;
    if(s[c-d]!=q||a[u]||o[u]||!v[u])continue;
    o[c]=0;o[u]=1;
    const n=b.slice();n[i]=u;n.sort((x,y)=>x-y);
    const w2=E(l,o,c,m,++t,k),key=w2+':'+n;
    if(!X.has(key)){
     if(B.length>=M){for(const x of b)o[x]=0;return null}
     X.set(key,B.length);B.push(n);Y.push(c);A.push(h);N.push(c);T.push(u);J.push(j);
     if(done(n))f=B.length-1;
    }
    o[u]=0;o[c]=1;
   }
  }
  for(const x of b)o[x]=0;
 }
 if(f<0)return null;
 const path=[];
 for(let x=f;x>0;x=A[x])path.push(x);
 path.reverse();
 let mv='',p=l.p,b=l.b.slice();
 for(const x of path){
  const n=B[x],fr=N[x],to=T[x],d=to-fr;
  for(const y of b)o[y]=1;
  mv+=W(l,o,p,fr-d);
  for(const y of b)o[y]=0;
  mv+=L[J[x]];p=fr;b=n;
 }
 return[mv,p];
}
function C(l){
 const{w,g,b,p}=l,r=(p/w)|0,M=new Map();
 const s=i=>{const x=i%w,y=(i/w)|0;return y==r?-1:(y<r?0:2)+(x<7?0:1)};
 for(const x of b){const k=s(x);if(k<0)return null;let o=M.get(k);if(!o)M.set(k,o={b:[],g:[]});o.b.push(x)}
 for(const x of g){const k=s(x);if(k<0)return null;let o=M.get(k);if(!o)M.set(k,o={b:[],g:[]});o.g.push(x)}
 const R=[...M.values()];
 if(R.some(x=>x.b.length!=x.g.length))return null;
 return R.filter(x=>x.b.length);
}
function K(t){
 const l=P(t),r=C(l);
 if(!r){const s=S(l,250000);return s?s[0]:''}
 let p=l.p,mv='';
 for(const x of r){
  const a=l.a.slice();
  for(const y of r)if(y!=x)for(const b of y.o?y.g:y.b)a[b]=1;
  const s=S({w:l.w,a,g:x.g,b:x.b,p},250000);
  if(!s)return'';
  mv+=s[0];p=s[1];x.o=1;
 }
 return mv;
}
for(const id of readdirSync(I)){
 const mv=K(readFileSync(I+'/'+id+'/level.txt','utf8'));
 mkdirSync(O+'/'+id,{recursive:true});
 writeFileSync(O+'/'+id+'/solution.txt',mv+'\n');
}
