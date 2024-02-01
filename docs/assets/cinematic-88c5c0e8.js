var w=Object.defineProperty;var x=(c,s,t)=>s in c?w(c,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[s]=t;var n=(c,s,t)=>(x(c,typeof s!="symbol"?s+"":s,t),t);import{h as v,Y as C,aq as m,S as D,_ as k,ar as g,as as E,b,ak as S,E as y,B as T,at as F,au as _,Z as u}from"./example-e9f3c815.js";import{G as z}from"./index-ba66c6be.js";const M={uniforms:{textureWidth:{value:1},textureHeight:{value:1},focalDepth:{value:1},focalLength:{value:24},fstop:{value:.9},tColor:{value:null},tDepth:{value:null},maxblur:{value:1},showFocus:{value:0},manualdof:{value:0},vignetting:{value:0},depthblur:{value:0},threshold:{value:.5},gain:{value:2},bias:{value:.5},fringe:{value:.7},znear:{value:.1},zfar:{value:100},noise:{value:1},dithering:{value:1e-4},pentagon:{value:0},shaderFocus:{value:1},focusCoords:{value:new v}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;
		uniform float textureWidth;
		uniform float textureHeight;

		uniform float focalDepth;  //focal distance value in meters, but you may use autofocus option below
		uniform float focalLength; //focal length in mm
		uniform float fstop; //f-stop value
		uniform bool showFocus; //show debug focus point and focal range (red = focal point, green = focal range)

		/*
		make sure that these two values are the same for your camera, otherwise distances will be wrong.
		*/

		uniform float znear; // camera clipping start
		uniform float zfar; // camera clipping end

		//------------------------------------------
		//user variables

		const int samples = SAMPLES; //samples on the first ring
		const int rings = RINGS; //ring count

		const int maxringsamples = rings * samples;

		uniform bool manualdof; // manual dof calculation
		float ndofstart = 1.0; // near dof blur start
		float ndofdist = 2.0; // near dof blur falloff distance
		float fdofstart = 1.0; // far dof blur start
		float fdofdist = 3.0; // far dof blur falloff distance

		float CoC = 0.03; //circle of confusion size in mm (35mm film = 0.03mm)

		uniform bool vignetting; // use optical lens vignetting

		float vignout = 1.3; // vignetting outer border
		float vignin = 0.0; // vignetting inner border
		float vignfade = 22.0; // f-stops till vignete fades

		uniform bool shaderFocus;
		// disable if you use external focalDepth value

		uniform vec2 focusCoords;
		// autofocus point on screen (0.0,0.0 - left lower corner, 1.0,1.0 - upper right)
		// if center of screen use vec2(0.5, 0.5);

		uniform float maxblur;
		//clamp value of max blur (0.0 = no blur, 1.0 default)

		uniform float threshold; // highlight threshold;
		uniform float gain; // highlight gain;

		uniform float bias; // bokeh edge bias
		uniform float fringe; // bokeh chromatic aberration / fringing

		uniform bool noise; //use noise instead of pattern for sample dithering

		uniform float dithering;

		uniform bool depthblur; // blur the depth buffer
		float dbsize = 1.25; // depth blur size

		/*
		next part is experimental
		not looking good with small sample and ring count
		looks okay starting from samples = 4, rings = 4
		*/

		uniform bool pentagon; //use pentagon as bokeh shape?
		float feather = 0.4; //pentagon shape feather

		//------------------------------------------

		float penta(vec2 coords) {
			//pentagonal shape
			float scale = float(rings) - 1.3;
			vec4  HS0 = vec4( 1.0,         0.0,         0.0,  1.0);
			vec4  HS1 = vec4( 0.309016994, 0.951056516, 0.0,  1.0);
			vec4  HS2 = vec4(-0.809016994, 0.587785252, 0.0,  1.0);
			vec4  HS3 = vec4(-0.809016994,-0.587785252, 0.0,  1.0);
			vec4  HS4 = vec4( 0.309016994,-0.951056516, 0.0,  1.0);
			vec4  HS5 = vec4( 0.0        ,0.0         , 1.0,  1.0);

			vec4  one = vec4( 1.0 );

			vec4 P = vec4((coords),vec2(scale, scale));

			vec4 dist = vec4(0.0);
			float inorout = -4.0;

			dist.x = dot( P, HS0 );
			dist.y = dot( P, HS1 );
			dist.z = dot( P, HS2 );
			dist.w = dot( P, HS3 );

			dist = smoothstep( -feather, feather, dist );

			inorout += dot( dist, one );

			dist.x = dot( P, HS4 );
			dist.y = HS5.w - abs( P.z );

			dist = smoothstep( -feather, feather, dist );
			inorout += dist.x;

			return clamp( inorout, 0.0, 1.0 );
		}

		float bdepth(vec2 coords) {
			// Depth buffer blur
			float d = 0.0;
			float kernel[9];
			vec2 offset[9];

			vec2 wh = vec2(1.0/textureWidth,1.0/textureHeight) * dbsize;

			offset[0] = vec2(-wh.x,-wh.y);
			offset[1] = vec2( 0.0, -wh.y);
			offset[2] = vec2( wh.x -wh.y);

			offset[3] = vec2(-wh.x,  0.0);
			offset[4] = vec2( 0.0,   0.0);
			offset[5] = vec2( wh.x,  0.0);

			offset[6] = vec2(-wh.x, wh.y);
			offset[7] = vec2( 0.0,  wh.y);
			offset[8] = vec2( wh.x, wh.y);

			kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;
			kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;
			kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;


			for( int i=0; i<9; i++ ) {
				float tmp = texture2D(tDepth, coords + offset[i]).r;
				d += tmp * kernel[i];
			}

			return d;
		}


		vec3 color(vec2 coords,float blur) {
			//processing the sample

			vec3 col = vec3(0.0);
			vec2 texel = vec2(1.0/textureWidth,1.0/textureHeight);

			col.r = texture2D(tColor,coords + vec2(0.0,1.0)*texel*fringe*blur).r;
			col.g = texture2D(tColor,coords + vec2(-0.866,-0.5)*texel*fringe*blur).g;
			col.b = texture2D(tColor,coords + vec2(0.866,-0.5)*texel*fringe*blur).b;

			vec3 lumcoeff = vec3(0.299,0.587,0.114);
			float lum = dot(col.rgb, lumcoeff);
			float thresh = max((lum-threshold)*gain, 0.0);
			return col+mix(vec3(0.0),col,thresh*blur);
		}

		vec3 debugFocus(vec3 col, float blur, float depth) {
			float edge = 0.002*depth; //distance based edge smoothing
			float m = clamp(smoothstep(0.0,edge,blur),0.0,1.0);
			float e = clamp(smoothstep(1.0-edge,1.0,blur),0.0,1.0);

			col = mix(col,vec3(1.0,0.5,0.0),(1.0-m)*0.6);
			col = mix(col,vec3(0.0,0.5,1.0),((1.0-e)-(1.0-m))*0.2);

			return col;
		}

		float linearize(float depth) {
			return -zfar * znear / (depth * (zfar - znear) - zfar);
		}

		float vignette() {
			float dist = distance(vUv.xy, vec2(0.5,0.5));
			dist = smoothstep(vignout+(fstop/vignfade), vignin+(fstop/vignfade), dist);
			return clamp(dist,0.0,1.0);
		}

		float gather(float i, float j, int ringsamples, inout vec3 col, float w, float h, float blur) {
			float rings2 = float(rings);
			float step = PI*2.0 / float(ringsamples);
			float pw = cos(j*step)*i;
			float ph = sin(j*step)*i;
			float p = 1.0;
			if (pentagon) {
				p = penta(vec2(pw,ph));
			}
			col += color(vUv.xy + vec2(pw*w,ph*h), blur) * mix(1.0, i/rings2, bias) * p;
			return 1.0 * mix(1.0, i /rings2, bias) * p;
		}

		void main() {
			//scene depth calculation

			float depth = linearize(texture2D(tDepth,vUv.xy).x);

			// Blur depth?
			if ( depthblur ) {
				depth = linearize(bdepth(vUv.xy));
			}

			//focal plane calculation

			float fDepth = focalDepth;

			if (shaderFocus) {

				fDepth = linearize(texture2D(tDepth,focusCoords).x);

			}

			// dof blur factor calculation

			float blur = 0.0;

			if (manualdof) {
				float a = depth-fDepth; // Focal plane
				float b = (a-fdofstart)/fdofdist; // Far DoF
				float c = (-a-ndofstart)/ndofdist; // Near Dof
				blur = (a>0.0) ? b : c;
			} else {
				float f = focalLength; // focal length in mm
				float d = fDepth*1000.0; // focal plane in mm
				float o = depth*1000.0; // depth in mm

				float a = (o*f)/(o-f);
				float b = (d*f)/(d-f);
				float c = (d-f)/(d*fstop*CoC);

				blur = abs(a-b)*c;
			}

			blur = clamp(blur,0.0,1.0);

			// calculation of pattern for dithering

			vec2 noise = vec2(rand(vUv.xy), rand( vUv.xy + vec2( 0.4, 0.6 ) ) )*dithering*blur;

			// getting blur x and y step factor

			float w = (1.0/textureWidth)*blur*maxblur+noise.x;
			float h = (1.0/textureHeight)*blur*maxblur+noise.y;

			// calculation of final color

			vec3 col = vec3(0.0);

			if(blur < 0.05) {
				//some optimization thingy
				col = texture2D(tColor, vUv.xy).rgb;
			} else {
				col = texture2D(tColor, vUv.xy).rgb;
				float s = 1.0;
				int ringsamples;

				for (int i = 1; i <= rings; i++) {
					/*unboxstart*/
					ringsamples = i * samples;

					for (int j = 0 ; j < maxringsamples ; j++) {
						if (j >= ringsamples) break;
						s += gather(float(i), float(j), ringsamples, col, w, h, blur);
					}
					/*unboxend*/
				}

				col /= s; //divide by sample count
			}

			if (showFocus) {
				col = debugFocus(col, blur, depth);
			}

			if (vignetting) {
				col *= vignette();
			}

			gl_FragColor.rgb = col;
			gl_FragColor.a = 1.0;
		}`},H={uniforms:{mNear:{value:1},mFar:{value:1e3}},vertexShader:`

		varying float vViewZDepth;

		void main() {

			#include <begin_vertex>
			#include <project_vertex>

			vViewZDepth = - mvPosition.z;

		}`,fragmentShader:`

		uniform float mNear;
		uniform float mFar;

		varying float vViewZDepth;

		void main() {

			float color = 1.0 - smoothstep( mNear, mFar, vViewZDepth );
			gl_FragColor = vec4( vec3( color ), 1.0 );

		}`};class L extends C{constructor(s,t,e,o){super(s,t,e,o),this.type="CinematicCamera",this.postprocessing={enabled:!0},this.shaderSettings={rings:3,samples:4};const r=H;this.materialDepth=new m({uniforms:r.uniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader}),this.materialDepth.uniforms.mNear.value=e,this.materialDepth.uniforms.mFar.value=o,this.setLens(),this.initPostProcessing()}setLens(s=35,t=35,e=8,o=.019){this.filmGauge=t,this.setFocalLength(s),this.fNumber=e,this.coc=o,this.aperture=s/this.fNumber,this.hyperFocal=s*s/(this.aperture*this.coc)}linearize(s){const t=this.far,e=this.near;return-t*e/(s*(t-e)-t)}smoothstep(s,t,e){const o=this.saturate((e-s)/(t-s));return o*o*(3-2*o)}saturate(s){return Math.max(0,Math.min(1,s))}focusAt(s=20){const t=this.getFocalLength();this.focus=s,this.nearPoint=this.hyperFocal*this.focus/(this.hyperFocal+(this.focus-t)),this.farPoint=this.hyperFocal*this.focus/(this.hyperFocal-(this.focus-t)),this.depthOfField=this.farPoint-this.nearPoint,this.depthOfField<0&&(this.depthOfField=0),this.sdistance=this.smoothstep(this.near,this.far,this.focus),this.ldistance=this.linearize(1-this.sdistance),this.postprocessing.bokeh_uniforms.focalDepth.value=this.ldistance}initPostProcessing(){if(this.postprocessing.enabled){this.postprocessing.scene=new D,this.postprocessing.camera=new k(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,-1e4,1e4),this.postprocessing.scene.add(this.postprocessing.camera),this.postprocessing.rtTextureDepth=new g(window.innerWidth,window.innerHeight),this.postprocessing.rtTextureColor=new g(window.innerWidth,window.innerHeight);const s=M;this.postprocessing.bokeh_uniforms=E.clone(s.uniforms),this.postprocessing.bokeh_uniforms.tColor.value=this.postprocessing.rtTextureColor.texture,this.postprocessing.bokeh_uniforms.tDepth.value=this.postprocessing.rtTextureDepth.texture,this.postprocessing.bokeh_uniforms.manualdof.value=0,this.postprocessing.bokeh_uniforms.shaderFocus.value=0,this.postprocessing.bokeh_uniforms.fstop.value=2.8,this.postprocessing.bokeh_uniforms.showFocus.value=1,this.postprocessing.bokeh_uniforms.focalDepth.value=.1,this.postprocessing.bokeh_uniforms.znear.value=this.near,this.postprocessing.bokeh_uniforms.zfar.value=this.near,this.postprocessing.bokeh_uniforms.textureWidth.value=window.innerWidth,this.postprocessing.bokeh_uniforms.textureHeight.value=window.innerHeight,this.postprocessing.materialBokeh=new m({uniforms:this.postprocessing.bokeh_uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,defines:{RINGS:this.shaderSettings.rings,SAMPLES:this.shaderSettings.samples,DEPTH_PACKING:1}}),this.postprocessing.quad=new b(new S(window.innerWidth,window.innerHeight),this.postprocessing.materialBokeh),this.postprocessing.quad.position.z=-500,this.postprocessing.scene.add(this.postprocessing.quad)}}renderCinematic(s,t){if(this.postprocessing.enabled){const e=t.getRenderTarget();t.clear(),s.overrideMaterial=null,t.setRenderTarget(this.postprocessing.rtTextureColor),t.clear(),t.render(s,this),s.overrideMaterial=this.materialDepth,t.setRenderTarget(this.postprocessing.rtTextureDepth),t.clear(),t.render(s,this),t.setRenderTarget(null),t.render(this.postprocessing.scene,this.postprocessing.camera),t.setRenderTarget(e)}}}class N extends y{constructor(){super(...arguments);n(this,"initGUI",t=>{const e={focalLength:15,fstop:2,showFocus:!1,focalDepth:3,maxblur:1,manualdof:!1,vignetting:!1,depthblur:!1,threshold:.5,gain:2,bias:.5,fringe:.7,noise:!0,pentagon:!1,dithering:1e-4},o=new z;t.appendChild(o.domElement.parentElement);let r=!0;const i=()=>{const a=this.camera;if(a){const l=e;Object.keys(l).forEach(h=>{h in a.postprocessing.bokeh_uniforms?(r&&console.log(h,"in"),a.postprocessing.bokeh_uniforms[h].value=l[h]):r&&console.log(h,"not in")}),r=!1,a.postprocessing.bokeh_uniforms.znear.value=a.near,a.postprocessing.bokeh_uniforms.zfar.value=a.far,a.setLens(e.focalLength,void 0,e.fstop,a.coc),e.focalDepth=a.postprocessing.bokeh_uniforms.focalDepth.value}};return o.add(e,"focalLength",1,135,.01).onChange(i),o.add(e,"fstop",1.8,22,.01).onChange(i),o.add(e,"focalDepth",.1,100,.001).onChange(i),o.add(e,"maxblur",1,100,1).onChange(i),o.add(e,"manualdof").onChange(i),o.add(e,"vignetting").onChange(i),o.add(e,"depthblur").onChange(i),o.add(e,"threshold").onChange(i),o.add(e,"gain").onChange(i),o.add(e,"bias").onChange(i),o.add(e,"fringe").onChange(i),o.add(e,"noise").onChange(i),o.add(e,"pentagon").onChange(i),o.add(e,"dithering").onChange(i),o.add(e,"showFocus",!0).onChange(i),o.add(this.checkUI,"enable").onChange(a=>{const l=this.camera;l&&(l.postprocessing.enabled=a)}),o.add(this.checkUI,"check"),i(),()=>{o.destroy()}});n(this,"raycaster");n(this,"mouse",new v);n(this,"theta",0);n(this,"INTERSECTED");n(this,"INTERSECTED_COLOR",0);n(this,"checkUI",{check:!1,enable:!0});n(this,"check",!1);n(this,"getMeshLambertEmissive",t=>{const e=t,o=e==null?void 0:e.material;return o==null?void 0:o.emissive.getHex()});n(this,"setMeshLambertEmissive",(t,e)=>{const o=t,r=o==null?void 0:o.material;r&&r.emissive.setHex(e)})}init(t){super.init(t);const e=new L(60,window.innerWidth/window.innerHeight,1,1e3);e.setLens(5),e.position.set(2,1,500),this.camera=e;const o=this.utils.createScene(15790320);this.scene=o;const r=this.utils.createDirectionalLight();r.position.set(1,1,1).normalize(),o.add(r);const i=new T(20,20,20);for(let f=0;f<1500;f++){const p=new b(i,new F({color:Math.random()*16777215}));p.position.set(Math.random()*800-400,Math.random()*800-400,Math.random()*800-400),o.add(p)}const a=new _;this.raycaster=a;const l=this.initGUI(t.ui),h=f=>{f.preventDefault(),this.mouse.x=f.clientX/window.innerWidth*2-1,this.mouse.y=-(f.clientY/window.innerHeight)*2+1},d=()=>{this.checkUI.check&&(this.check=!0)};return window.addEventListener("mousemove",h),window.addEventListener("click",d),()=>{l&&l(),window.removeEventListener("mousemove",h),window.removeEventListener("click",d)}}run(){var o,r,i;this.theta+=.1;const t=100;if((o=this.camera)==null||o.position.set(t*Math.sin(u.degToRad(this.theta)),t*Math.sin(u.degToRad(this.theta)),t*Math.cos(u.degToRad(this.theta))),this.scene&&((r=this.camera)==null||r.lookAt(this.scene.position)),(i=this.camera)==null||i.updateMatrixWorld(),this.raycaster&&this.camera&&this.scene&&this.check){this.check=!1,this.raycaster.setFromCamera(this.mouse,this.camera);const a=this.raycaster.intersectObjects(this.scene.children,!1);if(a.length>0){const l=a[0].distance;this.camera.focusAt(l),this.INTERSECTED!==a[0].object&&(this.setMeshLambertEmissive(this.INTERSECTED,this.INTERSECTED_COLOR),this.INTERSECTED=a[0].object,this.INTERSECTED_COLOR=this.getMeshLambertEmissive(this.INTERSECTED),this.setMeshLambertEmissive(this.INTERSECTED,16711680))}else this.setMeshLambertEmissive(this.INTERSECTED,this.INTERSECTED_COLOR),this.INTERSECTED=null}const e=this.camera;return this.scene&&e&&(e.postprocessing.enabled?e.renderCinematic(this.scene,this.renderer):(this.scene.overrideMaterial=null,this.renderer.clear(),this.renderer.render(this.scene,e))),0}}export{N as default};
