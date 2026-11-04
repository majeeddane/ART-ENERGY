export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('ae-theme');var d=document.documentElement;d.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
