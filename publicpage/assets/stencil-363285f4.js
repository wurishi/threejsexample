var I=Object.defineProperty;var L=(i,o,t)=>o in i?I(i,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[o]=t;var S=(i,o,t)=>(L(i,typeof o!="symbol"?o+"":o,t),t);import{E as z,S as B,ao as R,aA as O,V as y,aC as X,C as T,aB as V,X as E,ak as Z,M as D,aD as Y,aE as G,b as m,G as A,aF as q,c as K,aG as N,a as U,aH as j,aa as $,aI as x}from"./example-e9f3c815.js";import{G as J}from"./index-ba66c6be.js";import{O as Q}from"./OrbitControls-94bee5b1.js";const p={animate:!0,planeX:{constant:0,negated:!1,displayHelper:!1},planeY:{constant:0,negated:!1,displayHelper:!1},planeZ:{constant:0,negated:!1,displayHelper:!1}};class te extends z{constructor(){super(...arguments);S(this,"object");S(this,"planeObjects");S(this,"planes")}init(t){super.init(t);const s=new B;this.scene=s;const e=this.utils.createPerspectiveCamera({fov:36},[2,2,2]);this.camera=e,s.add(new R(16777215,.5));const l=this.utils.createDirectionalLight(16777215,[5,10,7.5],[2,-2,-2,2,.1,2e3]);l.shadow.mapSize.set(1024,1024),s.add(l);const n=[new O(new y(-1,0,0),0),new O(new y(0,-1,0),0),new O(new y(0,0,-1),0)];this.planes=n;const r=n.map(a=>new X(a,2,new T().setHSL(Math.random(),.5,.5).getHex()));r.forEach(a=>{a.visible=!1,s.add(a)});const h=new V(.4,.15,220,60),w=new E;this.object=w,s.add(w);const H=new Array;this.planeObjects=H;const W=new Z(4,4);for(let a=0;a<3;a++){const c=new E,d=n[a],C=_(h,d,a+1),u=new D({color:15277667,metalness:.1,roughness:.75,clippingPlanes:n.filter(M=>M!==d),stencilWrite:!0,stencilRef:0,stencilFunc:Y,stencilFail:G,stencilZFail:G,stencilZPass:G}),g=new m(W,u);g.onAfterRender=M=>{M.clearStencil()},g.renderOrder=a+1.1,w.add(C),c.add(g),H.push(g),s.add(c)}const v=new D({color:16761095,metalness:.1,roughness:.75,clippingPlanes:n,clipShadows:!0,shadowSide:A}),b=new m(h,v);b.castShadow=!0,b.renderOrder=6,w.add(b);const f=new m(new Z(9,9,1,1),new q({color:0,opacity:.25,side:A}));f.rotation.x=-Math.PI/2,f.position.y=-1,f.receiveShadow=!0,s.add(f),this.renderer.shadowMap.enabled=!0,this.renderer.setClearColor(2503224),this.renderer.localClippingEnabled=!0;const F=new Q(e,this.renderer.domElement);F.minDistance=2,F.maxDistance=20,F.update();const P=new J;return P.add(p,"animate"),["planeX","planeY","planeZ"].forEach((a,c)=>{const d=P.addFolder(a);d.add(p[a],"displayHelper").onChange(u=>r[c].visible=u);const C=d.add(p[a],"constant",-1,1,.01).onChange(u=>n[c].constant=u);d.add(p[a],"negated").onChange(()=>{n[c].negate(),p[a].constant=n[c].constant,C.updateDisplay()}),d.open()}),()=>{P.destroy()}}run(){var s;const t=super.run();return p.animate&&this.object&&(this.object.rotation.x+=t*.5,this.object.rotation.y+=t*.2),(s=this.planeObjects)==null||s.forEach((e,l)=>{const n=this.planes[l];n.coplanarPoint(e.position),e.lookAt(e.position.x-n.normal.x,e.position.y-n.normal.y,e.position.z-n.normal.z)}),t}}function _(i,o,t){const s=new E,e=new K;e.depthWrite=!1,e.depthTest=!1,e.colorWrite=!1,e.stencilWrite=!0,e.stencilFunc=N;const l=e.clone();l.side=U,l.clippingPlanes=[o],l.stencilFail=j,l.stencilZFail=j,l.stencilZPass=j;const n=new m(i,l);n.renderOrder=t,s.add(n);const r=e.clone();r.side=$,r.clippingPlanes=[o],r.stencilFail=x,r.stencilZFail=x,r.stencilZPass=x;const h=new m(i,r);return h.renderOrder=t,s.add(h),s}export{te as default};
