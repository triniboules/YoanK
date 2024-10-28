import { c as create_ssr_component } from "../../chunks/ssr.js";
/* empty css                                                */
import "../../chunks/firebase.js";
/* empty css                                                    */
const css = {
  code: ".app.svelte-1ffbr40{display:flex;flex-direction:column;min-height:100vh;margin:0;box-sizing:border-box}main.svelte-1ffbr40{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:100%;margin:0 auto;box-sizing:border-box}footer.svelte-1ffbr40{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px;background:var(--color-bg-1);box-sizing:border-box}@media(min-width: 480px){footer.svelte-1ffbr40{padding:12px 0}}",
  map: `{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script>\\n\\timport Header from './Header.svelte';\\n\\timport '../app.css';\\n  <\/script>\\n  \\n  <div class=\\"app\\">\\n\\n  \\n\\t<main>\\n\\t  <slot />\\n\\t</main>\\n  \\n\\t<footer>\\n\\t\\n\\t</footer>\\n  </div>\\n  \\n  <style>\\n\\t.app {\\n\\t  display: flex;\\n\\t  flex-direction: column;\\n\\t  min-height: 100vh;\\n\\t  margin: 0; /* Ensure no margin affects layout */\\n\\t  box-sizing: border-box; /* Apply box-sizing to all elements */\\n\\t}\\n  \\n\\tmain {\\n\\t  flex: 1;\\n\\t  display: flex;\\n\\t  flex-direction: column;\\n\\t  \\n\\t  width: 100%;\\n\\t  max-width: 100%;\\n\\t  margin: 0 auto;\\n\\t  box-sizing: border-box;\\n\\t}\\n  \\n\\tfooter {\\n\\t  display: flex;\\n\\t  flex-direction: column;\\n\\t  justify-content: center;\\n\\t  align-items: center;\\n\\t  padding: 12px;\\n\\t  background: var(--color-bg-1); /* Optional: set background color if needed */\\n\\t  box-sizing: border-box; /* Apply box-sizing to footer */\\n\\t}\\n\\n\\t@media (min-width: 480px) {\\n\\t  footer {\\n\\t\\tpadding: 12px 0; /* Adjust padding for larger screens */\\n\\t  }\\n\\t}\\n  </style>\\n  "],"names":[],"mappings":"AAkBC,mBAAK,CACH,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,KAAK,CACjB,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,UACd,CAEA,mBAAK,CACH,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,UACd,CAEA,qBAAO,CACL,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,YAAY,CAAC,CAC7B,UAAU,CAAE,UACd,CAEA,MAAO,YAAY,KAAK,CAAE,CACxB,qBAAO,CACR,OAAO,CAAE,IAAI,CAAC,CACb,CACF"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-1ffbr40"><main class="svelte-1ffbr40">${slots.default ? slots.default({}) : ``}</main> <footer class="svelte-1ffbr40" data-svelte-h="svelte-2cd1bs"></footer> </div>`;
});
export {
  Layout as default
};
