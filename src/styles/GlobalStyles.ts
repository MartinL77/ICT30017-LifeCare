import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root{
    --brand:#6a0dad;
    --brandDark:#580a9e;
    --bg:#f7f7fb;
    --text:#23222a;
    --muted:#777;
    --card:#ffffff;
    --danger:#d64545;
    --success:#2f9e44;
    --border:#e7e7ef;
    --navH: 64px; 
  }
  *{ box-sizing:border-box; }
  html,body,#root{ height:100%; }
  body{
    margin:0;
    background:var(--bg);
    color:var(--text);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans";
    padding-top: var(--navH); 
  }
  a{ text-decoration:none; color:inherit; }
  input,select,button{ font:inherit; }
`;

export default GlobalStyles;
