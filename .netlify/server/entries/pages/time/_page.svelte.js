import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { B as Background } from "../../../chunks/Background.js";
const css = {
  code: ":root{--color-bg-1:transparent}button.svelte-1ijr4di{cursor:pointer}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Background from \\"../../components/Background.svelte\\";\\n<\/script>\\n\\n<button style=\\"position: relative; width: 150px; height: 75px; border: none; background: transparent; padding: 0; overflow: hidden;\\">\\n    <Background />\\n    <span style=\\"position: relative; z-index: 1; color: white;\\">Click Me</span>\\n</button>\\n\\n<style>\\n    :root {\\n        --color-bg-1: transparent; /* Override the global background color */\\n    }\\n    \\n    button {\\n        cursor: pointer;\\n    }\\n</style>\\n"],"names":[],"mappings":"AASI,KAAM,CACF,YAAY,CAAE,WAClB,CAEA,qBAAO,CACH,MAAM,CAAE,OACZ"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<button style="position: relative; width: 150px; height: 75px; border: none; background: transparent; padding: 0; overflow: hidden;" class="svelte-1ijr4di">${validate_component(Background, "Background").$$render($$result, {}, {}, {})} <span style="position: relative; z-index: 1; color: white;" data-svelte-h="svelte-1t1r9zk">Click Me</span> </button>`;
});
export {
  Page as default
};
