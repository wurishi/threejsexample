function d(n,t){if(document.getElementById(t))return;const e=document.createElement("style");e.id=t,e.type="text/css",(document.getElementsByTagName("head")[0]||document.body).appendChild(e),e.appendChild(document.createTextNode(n))}function m(n){var e;const t=document.getElementById(n);t&&((e=t.parentElement)==null||e.removeChild(t))}export{d as i,m as r};