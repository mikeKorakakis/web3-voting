import{r as s,l as i}from"./chunk-D52XG6IA-DVTnw_rV.js";import{u as l,d}from"./index-Due4X9lb.js";import{$ as p}from"./index-CoB-VLMc.js";import{P as f}from"./index-DLfo2w2A.js";function b(a,e=globalThis==null?void 0:globalThis.document){const t=l(a);s.useEffect(()=>{const r=o=>{o.key==="Escape"&&t(o)};return e.addEventListener("keydown",r,{capture:!0}),()=>e.removeEventListener("keydown",r,{capture:!0})},[t,e])}var m="Portal",E=s.forwardRef((a,e)=>{var c;const{container:t,...r}=a,[o,u]=s.useState(!1);d(()=>u(!0),[]);const n=t||o&&((c=globalThis==null?void 0:globalThis.document)==null?void 0:c.body);return n?p.createPortal(i.jsx(f.div,{...r,ref:e}),n):null});E.displayName=m;export{E as P,b as u};