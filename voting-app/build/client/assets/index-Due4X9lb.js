import{r as s,l as C}from"./chunk-D52XG6IA-DVTnw_rV.js";import{u as A}from"./index-B3XE2UaP.js";function b(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e==null||e(r),n===!1||!r.defaultPrevented)return t==null?void 0:t(r)}}function I(e,t){const n=s.createContext(t),o=c=>{const{children:i,...a}=c,f=s.useMemo(()=>a,Object.values(a));return C.jsx(n.Provider,{value:f,children:i})};o.displayName=e+"Provider";function r(c){const i=s.useContext(n);if(i)return i;if(t!==void 0)return t;throw new Error(`\`${c}\` must be used within \`${e}\``)}return[o,r]}function _(e,t=[]){let n=[];function o(c,i){const a=s.createContext(i),f=n.length;n=[...n,i];const u=m=>{var h;const{scope:d,children:l,...p}=m,x=((h=d==null?void 0:d[e])==null?void 0:h[f])||a,P=s.useMemo(()=>p,Object.values(p));return C.jsx(x.Provider,{value:P,children:l})};u.displayName=c+"Provider";function N(m,d){var x;const l=((x=d==null?void 0:d[e])==null?void 0:x[f])||a,p=s.useContext(l);if(p)return p;if(i!==void 0)return i;throw new Error(`\`${m}\` must be used within \`${c}\``)}return[u,N]}const r=()=>{const c=n.map(i=>s.createContext(i));return function(a){const f=(a==null?void 0:a[e])||c;return s.useMemo(()=>({[`__scope${e}`]:{...a,[e]:f}}),[a,f])}};return r.scopeName=e,[o,O(r,...t)]}function O(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const o=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(c){const i=o.reduce((a,{useScope:f,scopeName:u})=>{const m=f(c)[`__scope${u}`];return{...a,...m}},{});return s.useMemo(()=>({[`__scope${t.scopeName}`]:i}),[i])}};return n.scopeName=t.scopeName,n}function S(e){const t=s.useRef(e);return s.useEffect(()=>{t.current=e}),s.useMemo(()=>(...n)=>{var o;return(o=t.current)==null?void 0:o.call(t,...n)},[])}var v=globalThis!=null&&globalThis.document?s.useLayoutEffect:()=>{};function g(e,t){return s.useReducer((n,o)=>t[n][o]??n,e)}var w=e=>{const{present:t,children:n}=e,o=R(t),r=typeof n=="function"?n({present:o.isPresent}):s.Children.only(n),c=A(o.ref,T(r));return typeof n=="function"||o.isPresent?s.cloneElement(r,{ref:c}):null};w.displayName="Presence";function R(e){const[t,n]=s.useState(),o=s.useRef({}),r=s.useRef(e),c=s.useRef("none"),i=e?"mounted":"unmounted",[a,f]=g(i,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return s.useEffect(()=>{const u=M(o.current);c.current=a==="mounted"?u:"none"},[a]),v(()=>{const u=o.current,N=r.current;if(N!==e){const d=c.current,l=M(u);e?f("MOUNT"):l==="none"||(u==null?void 0:u.display)==="none"?f("UNMOUNT"):f(N&&d!==l?"ANIMATION_OUT":"UNMOUNT"),r.current=e}},[e,f]),v(()=>{if(t){let u;const N=t.ownerDocument.defaultView??window,m=l=>{const x=M(o.current).includes(l.animationName);if(l.target===t&&x&&(f("ANIMATION_END"),!r.current)){const P=t.style.animationFillMode;t.style.animationFillMode="forwards",u=N.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=P)})}},d=l=>{l.target===t&&(c.current=M(o.current))};return t.addEventListener("animationstart",d),t.addEventListener("animationcancel",m),t.addEventListener("animationend",m),()=>{N.clearTimeout(u),t.removeEventListener("animationstart",d),t.removeEventListener("animationcancel",m),t.removeEventListener("animationend",m)}}else f("ANIMATION_END")},[t,f]),{isPresent:["mounted","unmountSuspended"].includes(a),ref:s.useCallback(u=>{u&&(o.current=getComputedStyle(u)),n(u)},[])}}function M(e){return(e==null?void 0:e.animationName)||"none"}function T(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}function L({prop:e,defaultProp:t,onChange:n=()=>{}}){const[o,r]=E({defaultProp:t,onChange:n}),c=e!==void 0,i=c?e:o,a=S(n),f=s.useCallback(u=>{if(c){const m=typeof u=="function"?u(e):u;m!==e&&a(m)}else r(u)},[c,e,r,a]);return[i,f]}function E({defaultProp:e,onChange:t}){const n=s.useState(e),[o]=n,r=s.useRef(o),c=S(t);return s.useEffect(()=>{r.current!==o&&(c(o),r.current=o)},[o,r,c]),n}export{w as P,_ as a,L as b,b as c,v as d,I as e,S as u};