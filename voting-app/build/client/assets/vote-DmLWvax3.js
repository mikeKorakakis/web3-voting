import{w as C}from"./with-props-b1i4h9El.js";import{r as n,l as e}from"./chunk-D52XG6IA-DVTnw_rV.js";import"./web3-BWiGdbZi.js";import{g as l}from"./utils-CBmQbvEb.js";import{B as w}from"./button-33l5vJYl.js";import"./AuthContext-BA6Rtxkc.js";import{C as v}from"./candidates-list-DnJVGP1T.js";import{t as p}from"./use-toast-rhCGJxoN.js";import"./index-B3XE2UaP.js";import"./index-BzlDct7J.js";import"./card-CTjxlscv.js";import"./index-B7XgfpAg.js";import"./index-Due4X9lb.js";import"./index-DLfo2w2A.js";import"./index-CoB-VLMc.js";import"./plus-R4PAUIF5.js";import"./createLucideIcon-BizpdrYR.js";import"./label-BV3ipPG8.js";import"./index-DE-pzLVP.js";const j=()=>{const[s,u]=n.useState([]),[m,o]=n.useState(""),[f,h]=n.useState(!1);n.useEffect(()=>{(async()=>{const i=await l(),a=await i.methods.candidatesCount().call(),d=[];for(let t=1;t<=a;t++){const c=await i.methods.getCandidate(t).call();d.push({id:c[0],name:c[1],voteCount:c[2]})}})()},[]);const x=async()=>{const r=await l(),a=(await window.ethereum.request({method:"eth_requestAccounts"}))[0];if((await r.methods.getVoter(a).call())[2]){o("Έχετε ψηφίσει ήδη."),p({title:"Σφάλμα",description:"Έχετε ψηφίσει ήδη.",variant:"destructive"});return}o("Καταχωρούμε την ψήφο σας...");try{alert(s);const t=await r.methods.vote(s).send({from:a});p({title:"Επιτυχία",description:"Η ψήφος σας καταχωρήθηκε.",variant:"default"}),o("Η ψήφος σας καταχωρήθηκε.")}catch(t){t instanceof Error&&o(t.message)}};return e.jsxs("div",{className:"container mx-auto p-4",children:[e.jsxs("div",{className:"w-full flex  flex-col items-center pb-4",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Ψηφίστε"}),e.jsx(w,{className:"mt-4",onClick:x,children:"Καταχωρίστε την ψήφο σας"}),m&&e.jsx("p",{className:"mt-4 text-red-500",children:m})]}),e.jsx(v,{refresh:f,setRefresh:h,selectedCandidates:s,setSelectedCandidates:u})]})};function F({}){return[{title:"Ψηφοφορία"},{name:"description",content:"Ψηφοφορία"}]}const G=C(function(){return e.jsx(j,{})});export{G as default,F as meta};
