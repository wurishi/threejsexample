var z=Object.defineProperty;var F=(s,n,a)=>n in s?z(s,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[n]=a;var S=(s,n,a)=>(F(s,typeof n!="symbol"?n+"":n,a),a);import{E as I,S as O,ao as A,o as D,aA as v,V as G,al as y,G as V,aB as k,b as C,ak as B}from"./example-e9f3c815.js";import{G as K}from"./index-ba66c6be.js";import{O as T}from"./OrbitControls-94bee5b1.js";class J extends I{constructor(){super(...arguments);S(this,"object");S(this,"time",0)}init(a){super.init(a);const E=this.utils.createPerspectiveCamera({fov:36,near:.25,far:16},[0,1.3,3]);this.camera=E;const o=new O;this.scene=o,o.add(new A(5263440));const t=new D(16777215);t.angle=Math.PI/5,t.penumbra=.2,t.position.set(2,3,3),t.castShadow=!0,t.shadow.camera.near=3,t.shadow.camera.far=10,t.shadow.mapSize.set(1024,1024),o.add(t);const f=this.utils.createDirectionalLight(5591130,[0,3,0],[1,-1,-1,1,1,10]);f.shadow.mapSize.set(1024,1024),o.add(f);const d=new v(new G(0,-1,0),.8),c=new v(new G(-1,0,0),.1),p=new y({color:8449552,shininess:100,side:V,clippingPlanes:[d],clipShadows:!0}),M=new k(.4,.08,95,20),h=new C(M,p);h.castShadow=!0,this.object=h,o.add(h);const b=new C(new B(9,9,1,1),new y({color:10530223,shininess:150}));b.rotation.x=-Math.PI/2,b.receiveShadow=!0,o.add(b),this.renderer.shadowMap.enabled=!0;const x=[c],m=Object.freeze([]);this.renderer.clippingPlanes=m,this.renderer.localClippingEnabled=!0;const u=new T(E,this.renderer.domElement);u.target.set(0,1,0),u.update(),this.controls=u;const r=new K,i=this.renderer,l=r.addFolder("Local Clipping"),g={get Enabled(){return i.localClippingEnabled},set Enabled(e){i.localClippingEnabled=e},get Shadows(){return p.clipShadows},set Shadows(e){p.clipShadows=e},get Plane(){return d.constant},set Plane(e){d.constant=e}},w=r.addFolder("Global Clipping"),L={get Enabled(){return i.clippingPlanes!==m},set Enabled(e){i.clippingPlanes=e?x:m},get Plane(){return c.constant},set Plane(e){c.constant=e}};l.add(g,"Enabled"),l.add(g,"Shadows"),l.add(g,"Plane",.3,1.25),l.open(),w.add(L,"Enabled"),w.add(L,"Plane",-.4,3),w.open();const j={get penumbra(){return t.penumbra},set penumbra(e){t.penumbra=e},get visible(){return t.visible},set visible(e){t.visible=e}},P=r.addFolder("聚光灯");return P.add(j,"visible"),P.add(j,"penumbra",0,1),P.open(),()=>{r.destroy()}}run(){const a=super.run();return this.time+=a,this.object&&(this.object.position.y=.8,this.object.rotation.x=this.time*.5,this.object.rotation.y=this.time*.2,this.object.scale.setScalar(Math.cos(this.time)*.125+.875)),a}}export{J as default};