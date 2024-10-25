import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import "chart.js/auto";
import "../../../chunks/firebase.js";
import "firebase/firestore";
import { B as Background } from "../../../chunks/Background.js";
const css = {
  code: ".container.svelte-1gesvcf{grid-column:2;grid-row:2;background:rgba(255, 255, 255, 0.1);border-radius:10px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 4px 30px rgba(0, 0, 0, 0.5);padding:20px;text-align:center;width:100%;height:100%}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import TimestampConverter from \\"../../components/TimestampConverter.svelte\\";\\nimport Background from \\"../../components/Background.svelte\\";\\n<\/script>\\r\\n<Background />\\r\\n<style>\\r\\n  body {\\r\\n    margin: 0;\\r\\n    height: 100vh;\\r\\n    display: grid;\\r\\n    grid-template-columns: 1fr 30% 1fr; /* Middle column 60% */\\r\\n    grid-template-rows: 1fr 1fr 1fr; /* Three equal rows */\\r\\n    box-sizing: border-box; /* Include padding in height/width calculations */\\r\\n  }\\r\\n\\r\\n  .container {\\r\\n    grid-column: 2; /* Middle column */\\r\\n    grid-row: 2; /* Middle row */\\r\\n    background: rgba(255, 255, 255, 0.1); /* Semi-transparent background */\\r\\n    border-radius: 10px;\\r\\n    -webkit-backdrop-filter: blur(8px);\\r\\n            backdrop-filter: blur(8px);\\r\\n    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);\\r\\n    padding: 20px; /* Inner padding */\\r\\n    text-align: center;\\r\\n    width: 100%; /* Full width of the grid cell */\\r\\n    height: 100%; /* Full height of the grid cell */\\r\\n  }\\r\\n</style>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAcE,yBAAW,CACT,WAAW,CAAE,CAAC,CACd,QAAQ,CAAE,CAAC,CACX,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACpC,aAAa,CAAE,IAAI,CACnB,uBAAuB,CAAE,KAAK,GAAG,CAAC,CAC1B,eAAe,CAAE,KAAK,GAAG,CAAC,CAClC,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzC,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IACV"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Background, "Background").$$render($$result, {}, {}, {})}  <div class="container svelte-1gesvcf" data-svelte-h="svelte-z9w4z4"></div>`;
});
export {
  Page as default
};
