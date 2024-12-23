import{w as x}from"./with-props-b1i4h9El.js";import{l as e,p as d,q as u,t,O as p}from"./chunk-D52XG6IA-DVTnw_rV.js";import{c as f}from"./utils-CBmQbvEb.js";import{u as h}from"./AuthContext-BA6Rtxkc.js";import{B as j}from"./button-33l5vJYl.js";import"./index-B3XE2UaP.js";import"./index-BzlDct7J.js";function v({className:s}){return e.jsxs("div",{className:f("flex items-center text-primary",s),children:[e.jsx("span",{className:"relative whitespace-nowrap",children:e.jsxs("span",{className:"flex items-center",children:[e.jsx("svg",{"aria-hidden":"true",viewBox:"0 0 418 42",className:"absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70",preserveAspectRatio:"none",children:e.jsx("path",{d:"M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"})}),e.jsx("img",{src:"/ballot.jpg",alt:"Logo",className:"h-10 w-auto"}),e.jsx("span",{className:"text-indigo-900 font-semibold ml-1",children:"Web 3.0 Εκλογές"})]})})," "]})}function g({children:s}){const r=d(),{pathname:a}=u(),l=h(),{isAuthenticated:o,isAdmin:i,logout:m,user:n}=l;return!o&&a.includes("vote")&&r("/signin"),a.includes("admin")&&!i&&r("/signin"),e.jsxs("div",{className:"h-screen flex-col",children:[e.jsxs("div",{className:"relative flex flex-row justify-between top-0 left-0 w-full py-4 px-6 max-w-[1980px] mx-auto",children:[e.jsxs("div",{className:"flex ",children:[e.jsx(v,{}),i&&e.jsxs(e.Fragment,{children:[e.jsx(t,{to:"/admin/contract",className:"ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Contract"}),e.jsx(t,{to:"/admin/candidates",className:"ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Υποψήφιοι"}),e.jsx(t,{to:"/admin/import-voters",className:"ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Εισαγωγή Ψηφοφόρων"})]}),!i&&o&&e.jsx(t,{to:"/vote",className:"ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Ψηφίστε"}),e.jsx(t,{to:"/results",className:"ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Αποτελέσματα"})]}),o&&e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{children:["Έχετε συνδεθεί ως ",n==null?void 0:n.username]}),e.jsx(j,{onClick:()=>{try{m()}catch(c){console.error(c)}},children:"Αποσύνδεση"})]}),!o&&e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(t,{to:"/signin",className:"text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Σύνδεση"}),e.jsx(t,{to:"/signup",className:"text-sm font-medium text-muted-foreground transition-colors hover:text-primary",children:"Εγγραφή"})]})]}),e.jsx("div",{className:"flex justify-center py-16 h-[calc(100%-200px)]",children:s})]})}const B=x(function({children:r}){return e.jsx(g,{children:e.jsx(p,{})})});export{B as default};