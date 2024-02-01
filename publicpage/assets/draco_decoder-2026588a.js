import{L as T,F as _,i as A,j as L}from"./example-e9f3c815.js";const w=new WeakMap;class C extends T{constructor(e){super(e),this.decoderPath="",this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(e){return this.decoderPath=e,this}setDecoderConfig(e){return this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,n,i,r){const s=new _(this.manager);s.setPath(this.path),s.setResponseType("arraybuffer"),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,t=>{this.decodeDracoFile(t,n).catch(r)},i,r)}decodeDracoFile(e,n,i,r){const s={attributeIDs:i||this.defaultAttributeIDs,attributeTypes:r||this.defaultAttributeTypes,useUniqueIDs:!!i};return this.decodeGeometry(e,s).then(n)}decodeGeometry(e,n){const i=JSON.stringify(n);if(w.has(e)){const c=w.get(e);if(c.key===i)return c.promise;if(e.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let r;const s=this.workerNextTaskID++,t=e.byteLength,o=this._getWorker(s,t).then(c=>(r=c,new Promise((f,d)=>{r._callbacks[s]={resolve:f,reject:d},r.postMessage({type:"decode",id:s,taskConfig:n,buffer:e},[e])}))).then(c=>this._createGeometry(c.geometry));return o.catch(()=>!0).then(()=>{r&&s&&this._releaseTask(r,s)}),w.set(e,{key:i,promise:o}),o}_createGeometry(e){const n=new A;e.index&&n.setIndex(new L(e.index.array,1));for(let i=0;i<e.attributes.length;i++){const r=e.attributes[i],s=r.name,t=r.array,o=r.itemSize;n.setAttribute(s,new L(t,o))}return n}_loadLibrary(e,n){const i=new _(this.manager);return i.setPath(this.decoderPath),i.setResponseType(n),i.setWithCredentials(this.withCredentials),new Promise((r,s)=>{i.load(e,r,void 0,s)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;const e=typeof WebAssembly!="object"||this.decoderConfig.type==="js",n=[];return e?n.push(this._loadLibrary("draco_decoder.js","text")):(n.push(this._loadLibrary("draco_wasm_wrapper.js","text")),n.push(this._loadLibrary("draco_decoder.wasm","arraybuffer"))),this.decoderPending=Promise.all(n).then(i=>{const r=i[0];e||(this.decoderConfig.wasmBinary=i[1]);const s=D.toString(),t=["/* draco decoder */",r,"","/* worker */",s.substring(s.indexOf("{")+1,s.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([t]))}),this.decoderPending}_getWorker(e,n){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){const r=new Worker(this.workerSourceURL);r._callbacks={},r._taskCosts={},r._taskLoad=0,r.postMessage({type:"init",decoderConfig:this.decoderConfig}),r.onmessage=function(s){const t=s.data;switch(t.type){case"decode":r._callbacks[t.id].resolve(t);break;case"error":r._callbacks[t.id].reject(t);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+t.type+'"')}},this.workerPool.push(r)}else this.workerPool.sort(function(r,s){return r._taskLoad>s._taskLoad?-1:1});const i=this.workerPool[this.workerPool.length-1];return i._taskCosts[e]=n,i._taskLoad+=n,i})}_releaseTask(e,n){e._taskLoad-=e._taskCosts[n],delete e._callbacks[n],delete e._taskCosts[n]}debug(){console.log("Task load: ",this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}}function D(){let p,e;onmessage=function(t){const o=t.data;switch(o.type){case"init":p=o.decoderConfig,e=new Promise(function(d){p.onModuleLoaded=function(u){d({draco:u})},DracoDecoderModule(p)});break;case"decode":const c=o.buffer,f=o.taskConfig;e.then(d=>{const u=d.draco,a=new u.Decoder,h=new u.DecoderBuffer;h.Init(new Int8Array(c),c.byteLength);try{const l=n(u,a,h,f),y=l.attributes.map(m=>m.array.buffer);l.index&&y.push(l.index.array.buffer),self.postMessage({type:"decode",id:o.id,geometry:l},y)}catch(l){console.error(l),self.postMessage({type:"error",id:o.id,error:l.message})}finally{u.destroy(h),u.destroy(a)}});break}};function n(t,o,c,f){const d=f.attributeIDs,u=f.attributeTypes;let a,h;const l=o.GetEncodedGeometryType(c);if(l===t.TRIANGULAR_MESH)a=new t.Mesh,h=o.DecodeBufferToMesh(c,a);else if(l===t.POINT_CLOUD)a=new t.PointCloud,h=o.DecodeBufferToPointCloud(c,a);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!h.ok()||a.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+h.error_msg());const y={index:null,attributes:[]};for(const m in d){const b=self[u[m]];let g,k;if(f.useUniqueIDs)k=d[m],g=o.GetAttributeByUniqueId(a,k);else{if(k=o.GetAttributeId(a,t[d[m]]),k===-1)continue;g=o.GetAttribute(a,k)}y.attributes.push(r(t,o,a,m,b,g))}return l===t.TRIANGULAR_MESH&&(y.index=i(t,o,a)),t.destroy(a),y}function i(t,o,c){const d=c.num_faces()*3,u=d*4,a=t._malloc(u);o.GetTrianglesUInt32Array(c,u,a);const h=new Uint32Array(t.HEAPF32.buffer,a,d).slice();return t._free(a),{array:h,itemSize:1}}function r(t,o,c,f,d,u){const a=u.num_components(),l=c.num_points()*a,y=l*d.BYTES_PER_ELEMENT,m=s(t,d),b=t._malloc(y);o.GetAttributeDataArrayForAllPoints(c,u,m,y,b);const g=new d(t.HEAPF32.buffer,b,l).slice();return t._free(b),{name:f,array:g,itemSize:a}}function s(t,o){switch(o){case Float32Array:return t.DT_FLOAT32;case Int8Array:return t.DT_INT8;case Int16Array:return t.DT_INT16;case Int32Array:return t.DT_INT32;case Uint8Array:return t.DT_UINT8;case Uint16Array:return t.DT_UINT16;case Uint32Array:return t.DT_UINT32}}}const I="/assets/draco_decoder-bafef896.js";export{C as D,I as a};