var v=Object.defineProperty;var E=(r,s,t)=>s in r?v(r,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[s]=t;var o=(r,s,t)=>(E(r,typeof s!="symbol"?s+"":s,t),t);import{E as P,r as L,al as y,h as g,V as m,aJ as S,S as C,ao as b,i as D,N as H,z as O,b as j,B as A,aK as B,au as F}from"./example-e9f3c815.js";import{O as G}from"./OrbitControls-94bee5b1.js";import{G as T}from"./GLTFLoader-27d86567.js";class k extends P{constructor(){super(...arguments);o(this,"intersection",{intersects:!1,point:new m,normal:new m});o(this,"mesh");o(this,"mouse",new g);o(this,"raycaster",new F);o(this,"intersects",new Array);o(this,"mouseHelper");o(this,"checkIntersection",(t,i)=>{var e,d;if(!this.mesh||!this.camera)return;const n=this.mouse;n.x=t/window.innerWidth*2-1,n.y=-(i/window.innerHeight)*2+1;const c=this.raycaster;if(c.setFromCamera(n,this.camera),c.intersectObject(this.mesh,!1,this.intersects),this.intersects.length>0){const a=this.intersects[0],h=a.point;(e=this.mouseHelper)==null||e.position.copy(h),this.intersection.point.copy(h);const l=a.face.normal.clone();l.transformDirection(this.mesh.matrixWorld),l.multiplyScalar(10),l.add(a.point),this.intersection.normal.copy(a.face.normal),(d=this.mouseHelper)==null||d.lookAt(l)}})}init(t){super.init(t);const i=new L,n=i.load("assets/textures/decals/decal-diffuse.png"),c=i.load("assets/textures/decals/decal-normal.jpg");new y({specular:4473924,map:n,normalMap:c,normalScale:new g(1,1),shininess:30,transparent:!0,depthTest:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,wireframe:!1}),new Array,new m,new S,new m(10,10,10);const e=new C;this.scene=e;const d=this.utils.createPerspectiveCamera({far:1e3},[0,0,120]);this.camera=d;const a=new G(d,this.renderer.domElement);a.minDistance=50,a.maxDistance=200,this.controls=a,e.add(new b(4469555));const h=this.utils.createDirectionalLight(16768460,[1,.75,.5]);e.add(h);const l=this.utils.createDirectionalLight(13421823,[-1,.75,-.5]);e.add(l);const w=new D;w.setFromPoints([new m,new m]);const x=new H(w,new O);e.add(x),V(e).then(M=>{this.mesh=M});const p=new j(new A(1,1,10),new B);p.visible=!1,e.add(p),this.mouseHelper=p;const u=()=>{};a.addEventListener("change",u);const f=()=>{};return window.addEventListener("pointerdown",f),()=>{a.removeEventListener("change",u),window.removeEventListener("pointerdown",f)}}}function V(r){return new Promise(s=>{const t=new L,i=new T,n="assets/models/gltf/LeePerrySmith/";i.load(`${n}LeePerrySmith.glb`,c=>{const e=c.scene.children[0];e.material=new y({specular:1118481,map:t.load(`${n}Map-COL.jpg`),specularMap:t.load(`${n}Map-SPEC.jpg`),normalMap:t.load(`${n}Infinite-Level_02_Tangent_SmoothUV.jpg`),shininess:25}),r.add(e),e.scale.set(10,10,10),s(e)})})}export{k as default};